import { supabase } from '../lib/supabaseClient';
import { AnnouncementItem } from '../types';

export const announcementsService = {
  /**
   * Public: Fetch all published announcements ordered by published_at
   */
  async getPublishedAnnouncements(): Promise<{ data: AnnouncementItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const mapped = (data || []).map((a) => ({
        ...a,
        date: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        author: 'CSI CMRIT Secretariat',
        tags: [a.category],
      })) as AnnouncementItem[];

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Public: Fetch single published announcement by slug
   */
  async getAnnouncementBySlug(slug: string): Promise<{ data: AnnouncementItem | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return { data: null, error: error?.message || 'Announcement not found' };
      }

      const mapped = {
        ...data,
        date: data.published_at ? new Date(data.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        author: 'CSI CMRIT Secretariat',
        tags: [data.category],
      } as AnnouncementItem;

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: null, error: error.message };
    }
  },

  /**
   * Admin: List all announcements (drafts and published)
   */
  async adminListAnnouncements(): Promise<{ data: AnnouncementItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: (data || []) as AnnouncementItem[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Create new announcement
   */
  async createAnnouncement(announcement: Omit<AnnouncementItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: AnnouncementItem; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        ...announcement,
        created_by: userData?.user?.id || null,
        published_at: announcement.status === 'published' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert([payload])
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as AnnouncementItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Update announcement
   */
  async updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<{ data?: AnnouncementItem; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as AnnouncementItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Toggle publish
   */
  async toggleAnnouncementPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updates: Record<string, any> = { status: newStatus };
    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  /**
   * Admin: Delete announcement
   */
  async deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  }
};
