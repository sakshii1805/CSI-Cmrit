import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AnnouncementItem, ContentStatus } from '../types';
import { mockAnnouncements } from '../data/announcements';

const STORAGE_KEY = 'csi_published_announcements';
const DELETED_ANNOUNCEMENTS_KEY = 'csi_deleted_announcements';

// Purge any old demo/mock storage cache once on module evaluation
try {
  localStorage.removeItem('csi_announcements_data');
} catch { }

const getDeletedAnnouncementIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_ANNOUNCEMENTS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveDeletedAnnouncementId = (id: string) => {
  try {
    const set = getDeletedAnnouncementIds();
    set.add(id);
    localStorage.setItem(DELETED_ANNOUNCEMENTS_KEY, JSON.stringify(Array.from(set)));
  } catch { }
};

const getStoredAnnouncements = (): AnnouncementItem[] => {
  try {
    const deleted = getDeletedAnnouncementIds();
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed: AnnouncementItem[] = raw ? JSON.parse(raw) : [];

    // Purge any unauthorized dummy announcements and deleted items
    const forbiddenIds = new Set(['ann-02', 'ann-03', 'ann-04', 'ann-05', 'mock-ann-1', 'mock-ann-2', 'mock-ann-3']);
    parsed = parsed.filter(p => !forbiddenIds.has(p.id) && !deleted.has(p.id) && !p.title.includes('Membership Drive') && !p.title.includes('Call for Core Student Coordinators'));

    // Ensure baseline announcements are present ONLY if admin hasn't deleted them
    if (!parsed.some(p => p.id === 'ann-avishkar-2026') && !deleted.has('ann-avishkar-2026') && mockAnnouncements.length > 0) {
      parsed.push(mockAnnouncements[0]);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch { }

    return parsed;
  } catch {
    const deleted = getDeletedAnnouncementIds();
    return mockAnnouncements.filter(m => !deleted.has(m.id));
  }
};

const saveStoredAnnouncements = (items: AnnouncementItem[]) => {
  try {
    const deleted = getDeletedAnnouncementIds();
    const clean = items.filter(a => !deleted.has(a.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'announcement' } }));
  } catch (err) {
    console.warn('Failed to save announcements to localStorage:', err);
  }
};

const mapAnnouncement = (a: any): AnnouncementItem => ({
  ...a,
  date: a.date || (a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
  author: a.author || 'CSI CMRIT Secretariat',
  tags: a.tags && a.tags.length > 0 ? a.tags : [a.category || 'General'],
  priority: a.priority || (a.isUrgent ? 'high' : 'medium'),
  is_published: a.status ? a.status === 'published' : (a.is_published !== false),
  status: a.status || (a.is_published !== false ? 'published' : 'draft')
});

export const announcementsService = {
  /**
   * Public: Fetch all published announcements (empty until admin posts announcements)
   */
  async getPublishedAnnouncements(): Promise<{ data: AnnouncementItem[]; error?: string }> {
    try {
      const deleted = getDeletedAnnouncementIds();
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapAnnouncement).filter(a => !deleted.has(a.id) && (!a.slug || !deleted.has(a.slug)));
          const local = getStoredAnnouncements().filter(a => a.is_published !== false && a.status !== 'draft');
          const remoteIds = new Set(mapped.map(m => m.id));
          const localOnly = local.filter(l => !remoteIds.has(l.id));
          return { data: [...localOnly, ...mapped] };
        }
      }

      const local = getStoredAnnouncements().filter(a => a.is_published !== false && a.status !== 'draft');
      return { data: local };
    } catch (err: unknown) {
      const local = getStoredAnnouncements().filter(a => a.is_published !== false && a.status !== 'draft');
      return { data: local };
    }
  },

  /**
   * Public: Fetch latest N published announcements (for homepage)
   */
  async getLatestAnnouncements(limit: number = 5): Promise<{ data: AnnouncementItem[]; error?: string }> {
    const res = await this.getPublishedAnnouncements();
    return { data: (res.data || []).slice(0, limit) };
  },

  /**
   * Public: Fetch single published announcement by slug or id
   */
  async getAnnouncementBySlug(slug: string): Promise<{ data: AnnouncementItem | null; error?: string }> {
    try {
      const deleted = getDeletedAnnouncementIds();
      if (deleted.has(slug)) return { data: null, error: 'Announcement has been deleted' };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .eq('status', 'published')
          .single();

        if (!error && data) {
          const mapped = mapAnnouncement(data);
          if (deleted.has(mapped.id) || (mapped.slug && deleted.has(mapped.slug))) {
            return { data: null, error: 'Announcement has been deleted' };
          }
          return { data: mapped };
        }
      }

      const all = getStoredAnnouncements();
      const match = all.find(a => a.slug === slug || a.id === slug);
      if (match) return { data: match };

      return { data: null, error: 'Announcement not found' };
    } catch (err: unknown) {
      const all = getStoredAnnouncements();
      const match = all.find(a => a.slug === slug || a.id === slug);
      return { data: match || null };
    }
  },

  /**
   * Admin: List all announcements (drafts and published)
   */
  async adminListAnnouncements(): Promise<{ data: AnnouncementItem[]; error?: string }> {
    try {
      const deleted = getDeletedAnnouncementIds();
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapAnnouncement).filter(a => !deleted.has(a.id) && (!a.slug || !deleted.has(a.slug)));
          const local = getStoredAnnouncements();
          const remoteIds = new Set(mapped.map(m => m.id));
          const localOnly = local.filter(l => !remoteIds.has(l.id));
          return { data: [...localOnly, ...mapped] };
        }
      }

      return { data: getStoredAnnouncements() };
    } catch (err: unknown) {
      return { data: getStoredAnnouncements() };
    }
  },

  /**
   * Admin: Create new announcement
   */
  async createAnnouncement(announcement: any): Promise<{ data?: AnnouncementItem; error?: string }> {
    const title = announcement.title || 'Untitled Announcement';
    const slug = announcement.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('ann-' + Date.now());
    const isPublished = announcement.is_published !== false && announcement.status !== 'draft';

    const newAnn: AnnouncementItem = {
      id: announcement.id || `ann-${Date.now()}`,
      slug,
      title,
      category: announcement.category || 'General',
      summary: announcement.summary || '',
      content: Array.isArray(announcement.content)
        ? announcement.content
        : (announcement.content ? [announcement.content] : []),
      author: announcement.author || 'CSI CMRIT Core Team',
      tags: Array.isArray(announcement.tags) ? announcement.tags : [announcement.category || 'General'],
      priority: announcement.isUrgent || announcement.priority === 'high' ? 'high' : 'medium',
      isUrgent: !!(announcement.isUrgent || announcement.priority === 'high'),
      is_published: isPublished,
      status: (isPublished ? 'published' : 'draft') as ContentStatus,
      date: announcement.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      published_at: isPublished ? (announcement.published_at || new Date().toISOString()) : null,
      created_at: new Date().toISOString()
    };

    // 1. Immediately persist locally
    const current = getStoredAnnouncements();
    saveStoredAnnouncements([newAnn, ...current]);

    // 2. Sync with Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const payload = {
          slug: newAnn.slug,
          title: newAnn.title,
          category: newAnn.category,
          summary: newAnn.summary,
          content: newAnn.content,
          status: newAnn.status,
          created_by: userData?.user?.id || null,
          published_at: newAnn.published_at,
        };

        const { data, error } = await supabase
          .from('announcements')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          return { data: mapAnnouncement(data) };
        }
      } catch (err) {
        console.warn('Supabase announcement insert error:', err);
      }
    }

    return { data: newAnn };
  },

  /**
   * Admin: Update announcement
   */
  async updateAnnouncement(id: string, updates: any): Promise<{ data?: AnnouncementItem; error?: string }> {
    const current = getStoredAnnouncements();
    const updated = current.map(a => {
      if (a.id === id || a.slug === id) {
        const next = { ...a, ...updates };
        if (updates.is_published !== undefined) {
          next.status = updates.is_published ? 'published' : 'draft';
        }
        if (updates.isUrgent !== undefined) {
          next.priority = updates.isUrgent ? 'high' : 'medium';
        }
        return next;
      }
      return a;
    });
    saveStoredAnnouncements(updated);

    if (isSupabaseConfigured) {
      try {
        const payload: any = { ...updates };
        if (updates.is_published !== undefined) {
          payload.status = updates.is_published ? 'published' : 'draft';
          if (updates.is_published && !payload.published_at) {
            payload.published_at = new Date().toISOString();
          }
        }
        await supabase.from('announcements').update(payload).or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase announcement update error:', err);
      }
    }

    const item = updated.find(a => a.id === id || a.slug === id);
    return { data: item };
  },

  /**
   * Admin: Toggle publish
   */
  async toggleAnnouncementPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const current = getStoredAnnouncements();
    const updated: AnnouncementItem[] = current.map(a => {
      if (a.id === id || a.slug === id) {
        return {
          ...a,
          status: newStatus as any,
          is_published: newStatus === 'published',
          published_at: newStatus === 'published' ? (a.published_at || new Date().toISOString()) : a.published_at
        };
      }
      return a;
    });
    saveStoredAnnouncements(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('announcements')
          .update({
            status: newStatus,
            published_at: newStatus === 'published' ? new Date().toISOString() : null
          })
          .or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase toggleAnnouncementPublish error:', err);
      }
    }

    return { success: true };
  },

  /**
   * Admin: Delete announcement permanently
   */
  async deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
    saveDeletedAnnouncementId(id);
    const current = getStoredAnnouncements();
    saveStoredAnnouncements(current.filter(a => a.id !== id && a.slug !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('announcements').delete().or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase deleteAnnouncement error:', err);
      }
    }

    return { success: true };
  }
};
