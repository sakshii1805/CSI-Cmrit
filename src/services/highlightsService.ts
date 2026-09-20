import { supabase } from '../lib/supabaseClient';
import { ChapterHighlightItem } from '../types';

export const highlightsService = {
  /**
   * Public: Fetch published chapter highlights
   */
  async getPublishedHighlights(): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const mapped = (data || []).map((h) => ({
        ...h,
        imageUrl: h.image_url,
        date: h.event_date || 'Chapter Activity',
        description: h.caption || h.title,
      })) as ChapterHighlightItem[];

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: List all highlights
   */
  async adminListHighlights(): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const mapped = (data || []).map((h) => ({
        ...h,
        imageUrl: h.image_url,
        date: h.event_date || 'Chapter Activity',
        description: h.caption || h.title,
      })) as ChapterHighlightItem[];

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Create single or multiple highlights
   */
  async createHighlight(item: Omit<ChapterHighlightItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: ChapterHighlightItem; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('highlights')
        .insert([{
          title: item.title,
          category: item.category,
          event_date: item.event_date || null,
          caption: item.caption || item.description || null,
          image_url: item.image_url || item.imageUrl,
          status: item.status || 'published',
        }])
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as ChapterHighlightItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Update highlight
   */
  async updateHighlight(id: string, updates: Partial<ChapterHighlightItem>): Promise<{ data?: ChapterHighlightItem; error?: string }> {
    try {
      const payload: any = { ...updates };
      if (updates.imageUrl) payload.image_url = updates.imageUrl;
      if (updates.description) payload.caption = updates.description;
      const { data, error } = await supabase
        .from('highlights')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as ChapterHighlightItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Toggle publish
   */
  async toggleHighlightPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('highlights')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  /**
   * Admin: Delete highlight
   */
  async deleteHighlight(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('highlights')
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
