-- ==============================================================================
-- CSI CMRIT — SCHEMA MIGRATION v2
-- Adds: gallery_posts, gallery_images, activity_log, expanded statuses, priority
-- Run this AFTER the initial schema.sql has been applied.
-- ==============================================================================

-- ==============================================================================
-- 1. EXPAND STATUS CHECK CONSTRAINTS
-- ==============================================================================

-- Events: add 'unpublished' and 'archived'
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE public.events ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'published', 'unpublished', 'archived'));

-- Announcements: add 'unpublished' and 'archived'
ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_status_check;
ALTER TABLE public.announcements ADD CONSTRAINT announcements_status_check
  CHECK (status IN ('draft', 'published', 'unpublished', 'archived'));

-- Highlights: add 'unpublished' and 'archived'
ALTER TABLE public.highlights DROP CONSTRAINT IF EXISTS highlights_status_check;
ALTER TABLE public.highlights ADD CONSTRAINT highlights_status_check
  CHECK (status IN ('draft', 'published', 'unpublished', 'archived'));

-- SIH Items: add 'unpublished' and 'archived'
ALTER TABLE public.sih_items DROP CONSTRAINT IF EXISTS sih_items_status_check;
ALTER TABLE public.sih_items ADD CONSTRAINT sih_items_status_check
  CHECK (status IN ('draft', 'published', 'unpublished', 'archived'));

-- ==============================================================================
-- 2. ADD PRIORITY COLUMN TO ANNOUNCEMENTS
-- ==============================================================================

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium'
  CHECK (priority IN ('high', 'medium', 'low'));

-- ==============================================================================
-- 3. GALLERY POSTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.gallery_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Community'
      CHECK (category IN ('Workshops', 'Hackathons', 'SIH', 'Competitions', 'Technical Sessions', 'Community', 'Events', 'Other')),
    cover_image TEXT,
    event_date DATE,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft'
      CHECK (status IN ('draft', 'published', 'unpublished', 'archived')),
    created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- 4. GALLERY IMAGES TABLE (child of gallery_posts)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_post_id UUID NOT NULL REFERENCES public.gallery_posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- 5. ACTIVITY LOG TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    admin_name TEXT,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    target_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- 6. TRIGGERS — auto-updated_at for new tables
-- ==============================================================================

DROP TRIGGER IF EXISTS tr_gallery_posts_updated_at ON public.gallery_posts;
CREATE TRIGGER tr_gallery_posts_updated_at
  BEFORE UPDATE ON public.gallery_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE public.gallery_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 8. RLS POLICIES — Gallery Posts
-- ==============================================================================

CREATE POLICY "Public can view published gallery posts" ON public.gallery_posts
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Admins have full access to gallery posts" ON public.gallery_posts
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 9. RLS POLICIES — Gallery Images
-- ==============================================================================

-- Public can view images belonging to published gallery posts
CREATE POLICY "Public can view gallery images of published posts" ON public.gallery_images
    FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.gallery_posts
            WHERE gallery_posts.id = gallery_images.gallery_post_id
              AND gallery_posts.status = 'published'
        )
    );

CREATE POLICY "Admins have full access to gallery images" ON public.gallery_images
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 10. RLS POLICIES — Activity Log
-- ==============================================================================

CREATE POLICY "Admins can view activity log" ON public.activity_log
    FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert activity log" ON public.activity_log
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 11. STORAGE BUCKET — Gallery Images
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('gallery', 'gallery', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS for gallery bucket
CREATE POLICY "Public read access on gallery"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "Admin write access on gallery"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'gallery' AND public.is_admin())
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

-- ==============================================================================
-- 12. UPDATE COMMENTS CHECK to include gallery_post target type
-- ==============================================================================

ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_target_type_check;
ALTER TABLE public.comments ADD CONSTRAINT comments_target_type_check
  CHECK (target_type IN ('highlight', 'event', 'announcement', 'gallery_post'));

-- Update the public_comments view (recreate to reflect constraint change)
DROP VIEW IF EXISTS public.public_comments;
CREATE VIEW public.public_comments AS
SELECT
    id,
    target_type,
    target_id,
    author_name,
    content,
    created_at
FROM public.comments
WHERE status = 'approved';

GRANT SELECT ON public.public_comments TO anon, authenticated;
