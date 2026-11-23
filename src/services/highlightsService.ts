import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { requireAdmin } from '../lib/authGuard';
import { matchIdOrSlug, notifyContentUpdated, isUuid } from '../lib/dbHelpers';
import { ChapterHighlightItem } from '../types';

const NOT_CONFIGURED = 'Website is not connected to the database.';

const sortByLatest = (a: ChapterHighlightItem, b: ChapterHighlightItem) => {
  if (a.is_pinned && !b.is_pinned) return -1;
  if (!a.is_pinned && b.is_pinned) return 1;
  const timeA = new Date(a.created_at || a.event_date || a.date || 0).getTime();
  const timeB = new Date(b.created_at || b.event_date || b.date || 0).getTime();
  return timeB - timeA;
};

/** Map DB columns to frontend display properties */
const mapHighlight = (h: any): ChapterHighlightItem => {
  const imagesList = Array.isArray(h.images) && h.images.length > 0
    ? h.images
    : [h.image_url || h.imageUrl].filter(Boolean);

  return {
    ...h,
    imageUrl: h.image_url || h.imageUrl || imagesList[0] || '',
    image_url: h.image_url || h.imageUrl || imagesList[0] || '',
    images: imagesList,
    date: h.event_date || h.date || 'Chapter Activity',
    event_date: h.event_date || h.date || new Date().toISOString().split('T')[0],
    description: h.caption || h.description || h.title,
    caption: h.caption || h.description || h.title,
    is_published: h.status ? h.status === 'published' : (h.is_published !== false),
    status: h.status || (h.is_published !== false ? 'published' : 'draft'),
    is_pinned: Boolean(h.is_pinned)
  };
};

export const highlightsService = {
  async getPublishedHighlights(): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    if (!isSupabaseConfigured) return { data: [], error: NOT_CONFIGURED };
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[CSI] highlights query failed:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data || []).map(mapHighlight).sort(sortByLatest) };
  },

  async getLatestHighlights(limit: number = 6): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    const res = await this.getPublishedHighlights();
    return { data: (res.data || []).slice(0, limit), error: res.error };
  },

  async adminListHighlights(): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    if (!isSupabaseConfigured) return { data: [], error: NOT_CONFIGURED };
    const { data, error } = await supabase.from('highlights').select('*').order('created_at', { ascending: false });
    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(mapHighlight).sort(sortByLatest) };
  },

  async createHighlight(item: any): Promise<{ data?: ChapterHighlightItem; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { error: e.message }; }

    const imagesList: string[] = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.imageUrl || item.image_url].filter(Boolean);
    const published = item.is_published !== false && item.status !== 'draft';

    const { data, error } = await supabase
      .from('highlights')
      .insert([{
        title: item.title || 'Chapter Highlight',
        category: item.category || 'Events',
        event_date: item.date || item.event_date || new Date().toISOString().split('T')[0],
        caption: item.caption || item.description || item.title || null,
        image_url: imagesList[0] || '',
        status: published ? 'published' : 'draft',
      }])
      .select()
      .single();
    if (error) {
      console.error('[CSI] highlight insert failed:', error);
      return { error: error.message };
    }
    notifyContentUpdated('highlight');
    return { data: mapHighlight({ ...data, images: imagesList }) };
  },

  async updateHighlight(id: string, updates: any): Promise<{ data?: ChapterHighlightItem; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { error: e.message }; }

    const payload: any = {};
    if (updates.title) payload.title = updates.title;
    if (updates.category) payload.category = updates.category;
    const img = updates.imageUrl || updates.image_url || (Array.isArray(updates.images) ? updates.images[0] : undefined);
    if (img) payload.image_url = img;
    if (updates.caption || updates.description) payload.caption = updates.caption || updates.description;
    if (updates.date || updates.event_date) payload.event_date = updates.date || updates.event_date;
    if (updates.is_pinned !== undefined) payload.is_pinned = updates.is_pinned;
    if (updates.status) payload.status = updates.status;
    else if (updates.is_published !== undefined) payload.status = updates.is_published ? 'published' : 'draft';

    const { data, error } = await supabase.from('highlights').update(payload).eq('id', id).select().maybeSingle();
    if (error) return { error: error.message };
    if (!data) return { error: 'Update was blocked or the highlight no longer exists.' };
    notifyContentUpdated('highlight');
    return { data: mapHighlight({ ...data, images: updates.images }) };
  },

  async updateHighlightStatus(id: string, newStatus: string): Promise<{ success: boolean; error?: string }> {
    const res = await this.updateHighlight(id, { status: newStatus, is_published: newStatus === 'published' });
    return res.error ? { success: false, error: res.error } : { success: true };
  },

  async toggleHighlightPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    return this.updateHighlightStatus(id, currentStatus === 'published' ? 'draft' : 'published');
  },

  async togglePinHighlight(id: string): Promise<{ success: boolean; is_pinned: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, is_pinned: false, error: e.message }; }
    const { data: row, error: readErr } = await supabase.from('highlights').select('id,is_pinned').eq('id', id).maybeSingle();
    if (readErr || !row) return { success: false, is_pinned: false, error: readErr?.message || 'Highlight not found.' };
    const next = !(row as any).is_pinned;
    const { error } = await supabase.from('highlights').update({ is_pinned: next } as any).eq('id', id);
    if (error) return { success: false, is_pinned: !next, error: error.message };
    notifyContentUpdated('highlight');
    return { success: true, is_pinned: next };
  },

  /** Kept for galleryService compatibility. Deletions now happen in the database, so nothing is hidden locally. */
  getDeletedHighlightIds(): Set<string> {
    return new Set();
  },

  async deleteHighlight(id: string): Promise<{ success: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, error: e.message }; }

    if (isUuid(id)) {
      const { data, error } = await supabase.from('highlights').delete().eq('id', id).select('id');
      if (error) return { success: false, error: error.message };
      if (data && data.length > 0) {
        notifyContentUpdated('highlight');
        return { success: true };
      }
    }
    // The id may belong to a gallery post instead of a highlight
    const { data: gp, error: gpErr } = await matchIdOrSlug(supabase.from('gallery_posts').delete(), id).select('id');
    if (gpErr) return { success: false, error: gpErr.message };
    if (!gp || gp.length === 0) return { success: false, error: 'Nothing was deleted. It may already be gone, or the database blocked it.' };
    notifyContentUpdated('highlight');
    return { success: true };
  }
};
