import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { requireAdmin } from '../lib/authGuard';
import { ChapterHighlightItem } from '../types';
import { mockGallery } from '../data/gallery';

const STORAGE_KEY = 'csi_published_highlights';
const DELETED_HIGHLIGHTS_KEY = 'csi_deleted_highlights';

// Purge any old demo/mock storage cache once on module evaluation
try {
  localStorage.removeItem('csi_highlights_data');
} catch { }

const getDeletedHighlightIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_HIGHLIGHTS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveDeletedHighlightId = (id: string) => {
  try {
    const set = getDeletedHighlightIds();
    set.add(id);
    localStorage.setItem(DELETED_HIGHLIGHTS_KEY, JSON.stringify(Array.from(set)));
  } catch { }
};

const getStoredHighlights = (): ChapterHighlightItem[] => {
  try {
    const deleted = getDeletedHighlightIds();
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: ChapterHighlightItem[] = raw ? JSON.parse(raw) : [];
    const filtered = parsed.filter(p => !deleted.has(p.id));
    const ids = new Set(filtered.map(p => p.id));

    // Only populate baseline items that haven't been deleted by admin
    for (const m of mockGallery) {
      if (!ids.has(m.id) && !deleted.has(m.id)) {
        filtered.push(m as any);
      }
    }
    return filtered;
  } catch {
    const deleted = getDeletedHighlightIds();
    return (mockGallery as any[]).filter(m => !deleted.has(m.id));
  }
};

const saveStoredHighlights = (items: ChapterHighlightItem[]) => {
  try {
    const deleted = getDeletedHighlightIds();
    const clean = items.filter(h => !deleted.has(h.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'highlight' } }));
  } catch (err) {
    console.warn('Failed to save highlights to localStorage:', err);
  }
};

/** Map DB columns to frontend display properties */
const mapHighlight = (h: any): ChapterHighlightItem => ({
  ...h,
  imageUrl: h.image_url || h.imageUrl,
  image_url: h.image_url || h.imageUrl,
  date: h.event_date || h.date || 'Chapter Activity',
  event_date: h.event_date || h.date || new Date().toISOString().split('T')[0],
  description: h.caption || h.description || h.title,
  caption: h.caption || h.description || h.title,
  is_published: h.status ? h.status === 'published' : (h.is_published !== false),
  status: h.status || (h.is_published !== false ? 'published' : 'draft')
});

export const highlightsService = {
  /**
   * Public: Fetch published chapter highlights (empty until admin uploads photos)
   */
  async getPublishedHighlights(): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    try {
      const deleted = getDeletedHighlightIds();
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('highlights')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapHighlight).filter(h => !deleted.has(h.id));
          const local = getStoredHighlights().filter(h => h.is_published !== false && h.status !== 'draft');
          const remoteIds = new Set(mapped.map(m => m.id));
          const localOnly = local.filter(l => !remoteIds.has(l.id));
          return { data: [...localOnly, ...mapped] };
        }
      }

      // Return only what administrator has posted (and not deleted)
      const local = getStoredHighlights().filter(h => h.is_published !== false && h.status !== 'draft');
      return { data: local };
    } catch (err: unknown) {
      const local = getStoredHighlights().filter(h => h.is_published !== false && h.status !== 'draft');
      return { data: local };
    }
  },

  /**
   * Public: Fetch latest N published highlights (for homepage Instagram feed)
   */
  async getLatestHighlights(limit: number = 6): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    const res = await this.getPublishedHighlights();
    return { data: (res.data || []).slice(0, limit) };
  },

  /**
   * Admin: List all highlights
   */
  async adminListHighlights(): Promise<{ data: ChapterHighlightItem[]; error?: string }> {
    try {
      const deleted = getDeletedHighlightIds();
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('highlights')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapHighlight).filter(h => !deleted.has(h.id));
          const local = getStoredHighlights();
          const remoteIds = new Set(mapped.map(m => m.id));
          const localOnly = local.filter(l => !remoteIds.has(l.id));
          return { data: [...localOnly, ...mapped] };
        }
      }

      return { data: getStoredHighlights() };
    } catch (err: unknown) {
      return { data: getStoredHighlights() };
    }
  },

  /**
   * Admin: Create single or multiple highlights
   */
  async createHighlight(item: any): Promise<{ data?: ChapterHighlightItem; error?: string }> {
    try {
      await requireAdmin();
    } catch (authErr: any) {
      return { error: authErr.message || 'Unauthorized' };
    }
    const newItem: ChapterHighlightItem = {
      id: item.id || `hl-${Date.now()}`,
      title: item.title || 'Chapter Highlight',
      category: item.category || 'Events',
      event_date: item.date || item.event_date || new Date().toISOString().split('T')[0],
      date: item.date || item.event_date || new Date().toISOString().split('T')[0],
      caption: item.caption || item.description || item.title || '',
      description: item.caption || item.description || item.title || '',
      image_url: item.imageUrl || item.image_url || '',
      imageUrl: item.imageUrl || item.image_url || '',
      status: item.is_published !== false && item.status !== 'draft' ? 'published' : 'draft',
      is_published: item.is_published !== false && item.status !== 'draft',
      created_at: new Date().toISOString()
    };

    // 1. Immediately persist to clean production store
    const current = getStoredHighlights();
    saveStoredHighlights([newItem, ...current]);

    // 2. Sync to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('highlights')
          .insert([{
            title: newItem.title,
            category: newItem.category,
            event_date: newItem.event_date || null,
            caption: newItem.caption || null,
            image_url: newItem.image_url,
            status: newItem.status,
          }])
          .select()
          .single();

        if (!error && data) {
          return { data: mapHighlight(data) };
        }
      } catch (err) {
        console.warn('Supabase highlight insert error:', err);
      }
    }

    return { data: newItem };
  },

  /**
   * Admin: Update highlight
   */
  async updateHighlight(id: string, updates: any): Promise<{ data?: ChapterHighlightItem; error?: string }> {
    try {
      await requireAdmin();
    } catch (authErr: any) {
      return { error: authErr.message || 'Unauthorized' };
    }
    const current = getStoredHighlights();
    const updated = current.map(h => {
      if (h.id === id) {
        const next = { ...h, ...updates };
        if (updates.imageUrl) next.image_url = updates.imageUrl;
        if (updates.image_url) next.imageUrl = updates.image_url;
        if (updates.date) next.event_date = updates.date;
        if (updates.event_date) next.date = updates.event_date;
        if (updates.description) next.caption = updates.description;
        if (updates.caption) next.description = updates.caption;
        if (updates.is_published !== undefined) {
          next.status = updates.is_published ? 'published' : 'draft';
        }
        return next;
      }
      return h;
    });
    saveStoredHighlights(updated);

    if (isSupabaseConfigured) {
      try {
        const payload: any = {};
        if (updates.title) payload.title = updates.title;
        if (updates.category) payload.category = updates.category;
        if (updates.imageUrl || updates.image_url) payload.image_url = updates.imageUrl || updates.image_url;
        if (updates.caption || updates.description) payload.caption = updates.caption || updates.description;
        if (updates.date || updates.event_date) payload.event_date = updates.date || updates.event_date;
        if (updates.status) payload.status = updates.status;
        else if (updates.is_published !== undefined) payload.status = updates.is_published ? 'published' : 'draft';

        await supabase.from('highlights').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase highlight update error:', err);
      }
    }

    const item = updated.find(h => h.id === id);
    return { data: item };
  },

  /**
   * Admin: Update highlight status
   */
  async updateHighlightStatus(id: string, newStatus: string): Promise<{ success: boolean; error?: string }> {
    return this.updateHighlight(id, {
      status: newStatus,
      is_published: newStatus === 'published'
    }).then(() => ({ success: true }));
  },

  /**
   * Admin: Toggle publish
   */
  async toggleHighlightPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    return this.updateHighlightStatus(id, newStatus);
  },

  /**
   * Admin: Delete highlight permanently
   */
  async deleteHighlight(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await requireAdmin();
    } catch (authErr: any) {
      return { success: false, error: authErr.message || 'Unauthorized' };
    }
    saveDeletedHighlightId(id);
    const current = getStoredHighlights();
    saveStoredHighlights(current.filter(h => h.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('highlights').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase highlight delete error:', err);
      }
    }

    return { success: true };
  }
};
