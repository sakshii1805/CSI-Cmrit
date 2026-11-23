import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { requireAdmin } from '../lib/authGuard';
import { matchIdOrSlug, notifyContentUpdated, slugify, uniqueSlug } from '../lib/dbHelpers';
import { AnnouncementItem, ContentStatus } from '../types';

const NOT_CONFIGURED = 'Website is not connected to the database.';

const mapAnnouncement = (a: any): AnnouncementItem => ({
  ...a,
  date: a.date || (a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
  author: a.author || 'CSI CMRIT Secretariat',
  tags: a.tags && a.tags.length > 0 ? a.tags : [a.category || 'General'],
  priority: a.priority || (a.isUrgent ? 'high' : 'medium'),
  is_published: a.status ? a.status === 'published' : (a.is_published !== false),
  status: a.status || (a.is_published !== false ? 'published' : 'draft'),
  is_pinned: Boolean(a.is_pinned)
});

const sortAnnouncements = (a: AnnouncementItem, b: AnnouncementItem) => {
  if (a.is_pinned && !b.is_pinned) return -1;
  if (!a.is_pinned && b.is_pinned) return 1;
  const timeA = new Date(a.published_at || a.created_at || a.date || 0).getTime();
  const timeB = new Date(b.published_at || b.created_at || b.date || 0).getTime();
  return timeB - timeA;
};

export const announcementsService = {
  /** Public: all published announcements (straight from the database) */
  async getPublishedAnnouncements(): Promise<{ data: AnnouncementItem[]; error?: string }> {
    if (!isSupabaseConfigured) return { data: [], error: NOT_CONFIGURED };
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) {
      console.warn('[CSI] announcements query failed:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data || []).map(mapAnnouncement).sort(sortAnnouncements) };
  },

  async getLatestAnnouncements(limit: number = 5): Promise<{ data: AnnouncementItem[]; error?: string }> {
    const res = await this.getPublishedAnnouncements();
    return { data: (res.data || []).slice(0, limit), error: res.error };
  },

  async getAnnouncementBySlug(slug: string): Promise<{ data: AnnouncementItem | null; error?: string }> {
    if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };
    const { data, error } = await matchIdOrSlug(
      supabase.from('announcements').select('*').eq('status', 'published'),
      slug
    ).maybeSingle();
    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: 'Announcement not found' };
    return { data: mapAnnouncement(data) };
  },

  /** Admin: list everything including drafts */
  async adminListAnnouncements(): Promise<{ data: AnnouncementItem[]; error?: string }> {
    if (!isSupabaseConfigured) return { data: [], error: NOT_CONFIGURED };
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(mapAnnouncement) };
  },

  async createAnnouncement(announcement: any): Promise<{ data?: AnnouncementItem; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { error: e.message }; }

    const title = announcement.title || 'Untitled Announcement';
    const isPublished = announcement.is_published !== false && announcement.status !== 'draft';
    const { data: userData } = await supabase.auth.getUser();

    const payload: any = {
      slug: announcement.slug || uniqueSlug(slugify(title, 'ann')),
      title,
      category: announcement.category || 'General',
      summary: announcement.summary || '',
      content: Array.isArray(announcement.content)
        ? announcement.content
        : (announcement.content ? [announcement.content] : []),
      priority: announcement.isUrgent || announcement.priority === 'high' ? 'high' : 'medium',
      status: isPublished ? 'published' : 'draft',
      created_by: userData?.user?.id || null,
      published_at: isPublished ? (announcement.published_at || new Date().toISOString()) : null,
    };
    if (announcement.image_url) payload.image_url = announcement.image_url;

    const { data, error } = await supabase.from('announcements').insert([payload]).select().single();
    if (error) {
      console.error('[CSI] announcement insert failed:', error);
      return { error: error.message };
    }
    notifyContentUpdated('announcement');
    return { data: mapAnnouncement(data) };
  },

  async updateAnnouncement(id: string, updates: any): Promise<{ data?: AnnouncementItem; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { error: e.message }; }

    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.summary !== undefined) payload.summary = updates.summary;
    if (updates.content !== undefined) {
      payload.content = Array.isArray(updates.content) ? updates.content : (updates.content ? [updates.content] : []);
    }
    if (updates.image_url !== undefined) payload.image_url = updates.image_url;
    if (updates.isUrgent !== undefined) payload.priority = updates.isUrgent ? 'high' : 'medium';
    else if (updates.priority !== undefined) payload.priority = updates.priority === 'high' ? 'high' : (updates.priority === 'low' ? 'low' : 'medium');
    if (updates.is_pinned !== undefined) payload.is_pinned = updates.is_pinned;
    if (updates.status !== undefined || updates.is_published !== undefined) {
      const published = updates.status ? updates.status === 'published' : !!updates.is_published;
      payload.status = published ? 'published' : 'draft';
      if (published) payload.published_at = updates.published_at || new Date().toISOString();
    }

    const { data, error } = await matchIdOrSlug(supabase.from('announcements').update(payload), id).select().maybeSingle();
    if (error) return { error: error.message };
    if (!data) return { error: 'Update was blocked or the announcement no longer exists.' };
    notifyContentUpdated('announcement');
    return { data: mapAnnouncement(data) };
  },

  async toggleAnnouncementPublish(id: string, currentStatus: ContentStatus): Promise<{ success: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, error: e.message }; }
    const publish = currentStatus !== 'published';
    const { data, error } = await matchIdOrSlug(
      supabase.from('announcements').update({
        status: publish ? 'published' : 'draft',
        published_at: publish ? new Date().toISOString() : null
      }),
      id
    ).select('id');
    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: false, error: 'Update was blocked by the database.' };
    notifyContentUpdated('announcement');
    return { success: true };
  },

  async togglePinAnnouncement(id: string): Promise<{ success: boolean; is_pinned: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, is_pinned: false, error: e.message }; }
    const { data: row, error: readErr } = await matchIdOrSlug(supabase.from('announcements').select('id,is_pinned'), id).maybeSingle();
    if (readErr || !row) return { success: false, is_pinned: false, error: readErr?.message || 'Announcement not found.' };
    const next = !(row as any).is_pinned;
    const { error } = await supabase.from('announcements').update({ is_pinned: next } as any).eq('id', row.id);
    if (error) return { success: false, is_pinned: !next, error: error.message };
    notifyContentUpdated('announcement');
    return { success: true, is_pinned: next };
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, error: e.message }; }
    const { data, error } = await matchIdOrSlug(supabase.from('announcements').delete(), id).select('id');
    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: false, error: 'Nothing was deleted. The post may already be gone, or the database blocked it.' };
    notifyContentUpdated('announcement');
    return { success: true };
  }
};
