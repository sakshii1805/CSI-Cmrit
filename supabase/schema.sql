-- ==============================================================================
-- CSI CMRIT DATABASE SCHEMA (Supabase PostgreSQL + RLS + Storage)
-- Computer Society of India — CMRIT Student Chapter
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLE DEFINITIONS
-- ==============================================================================

-- 1.1 Admins Table (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.2 Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Workshop', 'Hackathon', 'Competition', 'Technical Session', 'Other')),
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    organizer TEXT NOT NULL DEFAULT 'CSI CMRIT',
    highlights TEXT[] DEFAULT '{}',
    registration_link TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.3 Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    summary TEXT NOT NULL,
    content TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    attachment_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.4 Chapter Highlights (Visual Archives)
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Workshops', 'Hackathons', 'SIH', 'Competitions', 'Technical Sessions', 'Community', 'Other')),
    event_date DATE,
    caption TEXT,
    image_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.5 SIH Items (Teams, Projects, Achievements, Updates)
CREATE TABLE IF NOT EXISTS public.sih_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('team', 'project', 'update', 'achievement', 'problem_statement')),
    title TEXT NOT NULL,
    year TEXT NOT NULL DEFAULT '2026',
    description TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.6 Join Us Applications (Student Membership Inquiries)
CREATE TABLE IF NOT EXISTS public.join_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    year TEXT NOT NULL,
    branch TEXT NOT NULL,
    phone TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.7 Contact Inquiries Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.8 Blocked Emails (Spam and Abuse Prevention)
CREATE TABLE IF NOT EXISTS public.blocked_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    reason TEXT DEFAULT 'Spam or abusive submission',
    blocked_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 1.9 Comments Table (Includes Email for Admin Audit, Hidden from Public)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type TEXT NOT NULL CHECK (target_type IN ('highlight', 'event', 'announcement')),
    target_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    content TEXT NOT NULL CHECK (char_length(content) >= 3 AND char_length(content) <= 1000),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 2.1 Function: Check if current auth user is an active administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid()
  );
$$;

-- 2.2 Function: Check if current auth user is a super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- 2.3 Automated updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all updateable tables
DROP TRIGGER IF EXISTS tr_admins_updated_at ON public.admins;
CREATE TRIGGER tr_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_announcements_updated_at ON public.announcements;
CREATE TRIGGER tr_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_highlights_updated_at ON public.highlights;
CREATE TRIGGER tr_highlights_updated_at BEFORE UPDATE ON public.highlights FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_sih_items_updated_at ON public.sih_items;
CREATE TRIGGER tr_sih_items_updated_at BEFORE UPDATE ON public.sih_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_join_applications_updated_at ON public.join_applications;
CREATE TRIGGER tr_join_applications_updated_at BEFORE UPDATE ON public.join_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_comments_updated_at ON public.comments;
CREATE TRIGGER tr_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. PUBLIC COMMENTS VIEW (PRIVACY ENFORCEMENT)
-- Exposes ONLY approved comments and EXCLUDES the author_email column
-- ==============================================================================

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

-- Grant access on view to public/anon
GRANT SELECT ON public.public_comments TO anon, authenticated;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sih_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 4.1 Admins Table Policies
-- Any admin can view their own profile
CREATE POLICY "Admins can view own record" ON public.admins
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- Super admins can view all admins
CREATE POLICY "Super admins can view all admins" ON public.admins
    FOR SELECT TO authenticated
    USING (public.is_super_admin());

-- Admins can update their own profile (name, avatar)
CREATE POLICY "Admins can update own profile" ON public.admins
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only super admins can insert or delete admin records
CREATE POLICY "Super admins can insert admins" ON public.admins
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete admins" ON public.admins
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

-- 4.2 Events Policies
CREATE POLICY "Public can view published events" ON public.events
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Admins have full access to events" ON public.events
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.3 Announcements Policies
CREATE POLICY "Public can view published announcements" ON public.announcements
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Admins have full access to announcements" ON public.announcements
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.4 Highlights Policies
CREATE POLICY "Public can view published highlights" ON public.highlights
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Admins have full access to highlights" ON public.highlights
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.5 SIH Items Policies
CREATE POLICY "Public can view published SIH items" ON public.sih_items
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Admins have full access to SIH items" ON public.sih_items
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.6 Join Applications Policies
CREATE POLICY "Public can submit join application" ON public.join_applications
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        status = 'pending' AND
        char_length(full_name) >= 2 AND
        char_length(reason) >= 10
    );

CREATE POLICY "Admins have full access to join applications" ON public.join_applications
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.7 Contact Messages Policies
CREATE POLICY "Public can submit contact message" ON public.contact_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        char_length(name) >= 2 AND
        char_length(message) >= 5
    );

CREATE POLICY "Admins have full access to contact messages" ON public.contact_messages
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.8 Blocked Emails Policies
CREATE POLICY "Admins have full access to blocked emails" ON public.blocked_emails
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.9 Comments Policies
-- Public can submit comments only if status is pending and email is not blocked
CREATE POLICY "Public can submit comments" ON public.comments
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        status = 'pending' AND
        NOT EXISTS (
            SELECT 1 FROM public.blocked_emails
            WHERE blocked_emails.email = comments.author_email
        )
    );

-- Admins can view, approve, reject, or delete any comment
CREATE POLICY "Admins have full access to comments" ON public.comments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. STORAGE BUCKETS & POLICIES
-- ==============================================================================

-- Create public storage buckets (5MB limit, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('event-images', 'event-images', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('highlights', 'highlights', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('announcements', 'announcements', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Anyone can view images from public buckets
CREATE POLICY "Public read access on event-images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'event-images');

CREATE POLICY "Public read access on highlights"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'highlights');

CREATE POLICY "Public read access on announcements"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'announcements');

-- Storage RLS: Only admins can upload, update, and delete files
CREATE POLICY "Admin write access on event-images"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'event-images' AND public.is_admin())
WITH CHECK (bucket_id = 'event-images' AND public.is_admin());

CREATE POLICY "Admin write access on highlights"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'highlights' AND public.is_admin())
WITH CHECK (bucket_id = 'highlights' AND public.is_admin());

CREATE POLICY "Admin write access on announcements"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'announcements' AND public.is_admin())
WITH CHECK (bucket_id = 'announcements' AND public.is_admin());
