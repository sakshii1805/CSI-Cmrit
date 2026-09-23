import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { requireAdmin } from '../lib/authGuard';
import { GalleryPost, GalleryImage } from '../types';
import { highlightsService } from './highlightsService';

const sortGalleryPosts = (a: GalleryPost, b: GalleryPost) => {
  if (a.is_pinned && !b.is_pinned) return -1;
  if (!a.is_pinned && b.is_pinned) return 1;
  const timeA = new Date(a.created_at || a.event_date || 0).getTime();
  const timeB = new Date(b.created_at || b.event_date || 0).getTime();
  return timeB - timeA;
};

export const galleryService = {
  /**
   * Public: Fetch all published gallery posts ordered by created_at desc
   */
  async getPublishedGalleryPosts(): Promise<{ data: GalleryPost[]; error?: string }> {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('gallery_posts')
          .select('*, gallery_images(id)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = (data || []).map((p: any) => ({
            ...p,
            is_pinned: Boolean(p.is_pinned),
            image_count: p.gallery_images?.length || 0,
            gallery_images: undefined,
          })) as GalleryPost[];
          mapped.sort(sortGalleryPosts);
          return { data: mapped };
        }
      }

      // Fallback & unified feed: convert highlightsService items to GalleryPosts
      const highlightsRes = await highlightsService.getPublishedHighlights();
      const mappedFromHighlights: GalleryPost[] = (highlightsRes.data || []).map((h) => ({
        id: h.id,
        slug: h.id,
        title: h.title,
        category: h.category || 'Community',
        cover_image: h.imageUrl || h.image_url || '',
        event_date: h.event_date || h.date,
        description: h.description || h.caption,
        is_pinned: Boolean(h.is_pinned),
        image_count: 1,
        images: [{
          id: `img-${h.id}`,
          gallery_post_id: h.id,
          image_url: h.imageUrl || h.image_url || '',
          caption: h.description || h.caption,
          display_order: 0,
          created_at: h.created_at || new Date().toISOString()
        }],
        status: 'published',
        created_at: h.created_at || new Date().toISOString(),
        updated_at: h.updated_at || h.created_at || new Date().toISOString()
      }));

      // Sort with pinned items first, then latest stack order
      mappedFromHighlights.sort(sortGalleryPosts);

      return { data: mappedFromHighlights };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Public: Fetch latest N published gallery posts (for homepage)
   */
  async getLatestGalleryPosts(limit: number = 6): Promise<{ data: GalleryPost[]; error?: string }> {
    const res = await this.getPublishedGalleryPosts();
    return { data: (res.data || []).slice(0, limit) };
  },

  /**
   * Public: Fetch single published gallery post by slug or id, with all images
   */
  async getGalleryPostBySlug(slug: string): Promise<{ data: GalleryPost | null; error?: string }> {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('gallery_posts')
          .select('*, gallery_images(*)')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .eq('status', 'published')
          .single();

        if (!error && data) {
          const images = ((data.gallery_images || []) as GalleryImage[]).sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
          );
          return {
            data: {
              ...data,
              images,
              image_count: images.length,
              gallery_images: undefined,
            } as GalleryPost,
          };
        }
      }

      // Check highlights
      const highlightsRes = await highlightsService.getPublishedHighlights();
      const match = (highlightsRes.data || []).find((h) => h.id === slug || h.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
      if (match) {
        return {
          data: {
            id: match.id,
            slug: match.id,
            title: match.title,
            category: match.category || 'Community',
            cover_image: match.imageUrl || match.image_url || '',
            event_date: match.event_date || match.date,
            description: match.description || match.caption,
            image_count: 1,
            images: [{
              id: `img-${match.id}`,
              gallery_post_id: match.id,
              image_url: match.imageUrl || match.image_url || '',
              caption: match.description || match.caption,
              display_order: 0,
              created_at: match.created_at || new Date().toISOString()
            }],
            status: 'published',
            created_at: match.created_at || new Date().toISOString(),
            updated_at: match.updated_at || match.created_at || new Date().toISOString()
          }
        };
      }

      return { data: null, error: 'Gallery post not found' };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: null, error: error.message };
    }
  },

  /**
   * Admin: List all gallery posts
   */
  async adminListGalleryPosts(): Promise<{ data: GalleryPost[]; error?: string }> {
    return this.getPublishedGalleryPosts();
  },

  /**
   * Admin: Create a gallery post
   */
  async createGalleryPost(
    post: Omit<GalleryPost, 'id' | 'created_at' | 'updated_at'>,
    images: { image_url: string; caption?: string }[]
  ): Promise<{ data?: GalleryPost; error?: string }> {
    try {
      await requireAdmin();
      // Also create highlight for unified experience
      await highlightsService.createHighlight({
        title: post.title,
        category: post.category as any,
        event_date: post.event_date || new Date().toISOString().split('T')[0],
        imageUrl: post.cover_image || images[0]?.image_url,
        description: post.description || '',
        is_published: post.status === 'published'
      });

      if (isSupabaseConfigured) {
        const { data: userData } = await supabase.auth.getUser();
        const postPayload = {
          slug: post.slug,
          title: post.title,
          category: post.category,
          event_date: post.event_date || null,
          cover_image: post.cover_image,
          description: post.description || null,
          status: post.status || 'published',
          created_by: userData?.user?.id || null,
        };

        const { data: newPost, error: postError } = await supabase
          .from('gallery_posts')
          .insert([postPayload])
          .select()
          .single();

        if (postError) return { error: postError.message };

        if (images && images.length > 0) {
          const imageRows = images.map((img, idx) => ({
            gallery_post_id: newPost.id,
            image_url: img.image_url,
            caption: img.caption || null,
            display_order: idx,
          }));

          await supabase.from('gallery_images').insert(imageRows);
        }

        return { data: newPost as GalleryPost };
      }

      const dummyPost: GalleryPost = {
        id: `gp-${Date.now()}`,
        slug: post.slug,
        title: post.title,
        category: post.category,
        cover_image: post.cover_image,
        description: post.description,
        status: post.status,
        image_count: images.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: dummyPost };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Delete gallery post
   */
  async deleteGalleryPost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await requireAdmin();
      await highlightsService.deleteHighlight(id);
      if (isSupabaseConfigured) {
        await supabase.from('gallery_posts').delete().eq('id', id);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unauthorized' };
    }
  },

  /**
   * Admin: Toggle Pin to Top (Authority for Admins only)
   */
  async togglePinGalleryPost(id: string): Promise<{ success: boolean; is_pinned: boolean; error?: string }> {
    try {
      await requireAdmin();
    } catch (authErr: any) {
      return { success: false, is_pinned: false, error: authErr.message || 'Unauthorized: Only admins can pin posts' };
    }

    const res = await highlightsService.togglePinHighlight(id);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_posts').update({ is_pinned: res.is_pinned } as any).or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase togglePinGalleryPost error:', err);
      }
    }

    return res;
  }
};
