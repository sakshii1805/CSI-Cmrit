import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { EventItem } from '../types';
import { mockEvents } from '../data/events';

const STORAGE_KEY = 'csi_published_events';
const DELETED_EVENTS_KEY = 'csi_deleted_events';

// Purge any old demo/mock storage cache once on module evaluation
try {
  localStorage.removeItem('csi_events_data');
} catch { }

const getDeletedEventIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_EVENTS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveDeletedEventId = (id: string) => {
  try {
    const set = getDeletedEventIds();
    set.add(id);
    localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(Array.from(set)));
  } catch { }
};

const getStoredEvents = (): EventItem[] => {
  try {
    const deleted = getDeletedEventIds();
    if (deleted.has('avishkaar-2026')) {
      deleted.delete('avishkaar-2026');
      try {
        localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(Array.from(deleted)));
      } catch { }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed: EventItem[] = raw ? JSON.parse(raw) : [];

    // Purge any dummy mock event IDs from previous tests and deleted items
    const forbiddenIds = new Set(['evt-01', 'evt-02', 'evt-03', 'mock-evt-1', 'mock-evt-2']);
    parsed = parsed.filter(e => !forbiddenIds.has(e.id) && !deleted.has(e.id));

    // Ensure baseline Hackathon event (avishkaar-2026) is always present with complete info
    const avishkaarIndex = parsed.findIndex(e => e.id === 'avishkaar-2026' || e.slug === 'avishkaar-2026');
    if (avishkaarIndex >= 0) {
      parsed[avishkaarIndex] = {
        ...mockEvents[0],
        ...parsed[avishkaarIndex],
        title: mockEvents[0].title,
        shortDescription: mockEvents[0].shortDescription || parsed[avishkaarIndex].shortDescription,
        image: mockEvents[0].image,
        is_published: true,
        status: 'published'
      };
    } else if (mockEvents.length > 0) {
      parsed.unshift(mockEvents[0]);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch { }

    return parsed;
  } catch {
    return mockEvents;
  }
};

const saveStoredEvents = (items: EventItem[]) => {
  try {
    const deleted = getDeletedEventIds();
    const clean = items.filter(e => !deleted.has(e.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'event' } }));
  } catch (err) {
    console.warn('Failed to save events to localStorage:', err);
  }
};

/** Normalize DB row to frontend EventItem */
const mapEvent = (e: any): EventItem => ({
  ...e,
  date: e.date || (e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBA'),
  event_date: e.event_date || e.date || new Date().toISOString().split('T')[0],
  time: e.event_time || e.time || 'Time TBA',
  event_time: e.event_time || e.time || 'Time TBA',
  venue: e.venue || e.location || 'CMRIT Campus, Bengaluru',
  location: e.venue || e.location || 'CMRIT Campus, Bengaluru',
  image: e.image_url || e.image || '',
  image_url: e.image_url || e.image || '',
  is_published: e.status ? e.status === 'published' : (e.is_published !== false),
  status: e.status || (e.is_published !== false ? 'published' : 'draft'),
  registrationOpen: e.registrationOpen ?? (e.status === 'published' || e.is_published !== false)
});

export const eventsService = {
  /**
   * Public: Fetch all published events (empty until admin creates events)
   */
  async getPublishedEvents(): Promise<{ data: EventItem[]; error?: string }> {
    try {
      const deleted = getDeletedEventIds();
      if (deleted.has('avishkaar-2026')) {
        deleted.delete('avishkaar-2026');
      }
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('event_date', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapEvent).filter(e => !deleted.has(e.id) && (!e.slug || !deleted.has(e.slug)));
          const local = getStoredEvents().filter(e => e.is_published !== false && e.status !== 'draft');
          const remoteIds = new Set(mapped.map(m => m.id));
          const localOnly = local.filter(l => !remoteIds.has(l.id));
          const combined = [...localOnly, ...mapped];
          return { data: combined.length > 0 ? combined : mockEvents };
        }
      }

      const local = getStoredEvents().filter(e => e.is_published !== false && e.status !== 'draft');
      return { data: local.length > 0 ? local : mockEvents };
    } catch (err: unknown) {
      const local = getStoredEvents().filter(e => e.is_published !== false && e.status !== 'draft');
      return { data: local.length > 0 ? local : mockEvents };
    }
  },

  /**
   * Public: Fetch latest N published events (for homepage)
   */
  async getLatestEvents(limit: number = 4): Promise<{ data: EventItem[]; error?: string }> {
    const res = await this.getPublishedEvents();
    return { data: (res.data || []).slice(0, limit) };
  },

  /**
   * Public: Fetch upcoming events
   */
  async getUpcomingEvents(): Promise<{ data: EventItem[]; error?: string }> {
    const today = new Date().toISOString().split('T')[0];
    const res = await this.getPublishedEvents();
    const upcoming = (res.data || []).filter(e => (e.event_date || e.date || '') >= today);
    return { data: upcoming };
  },

  /**
   * Public: Fetch past events
   */
  async getPastEvents(): Promise<{ data: EventItem[]; error?: string }> {
    const today = new Date().toISOString().split('T')[0];
    const res = await this.getPublishedEvents();
    const past = (res.data || []).filter(e => (e.event_date || e.date || '') < today);
    return { data: past };
  },

  /**
   * Public: Fetch single published event by slug or id
   */
  async getEventBySlug(slug: string): Promise<{ data: EventItem | null; error?: string }> {
    try {
      const deleted = getDeletedEventIds();
      if (deleted.has(slug)) return { data: null, error: 'Event has been deleted' };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .eq('status', 'published')
          .single();

        if (!error && data) {
          const mapped = mapEvent(data);
          if (deleted.has(mapped.id) || (mapped.slug && deleted.has(mapped.slug))) {
            return { data: null, error: 'Event has been deleted' };
          }
          return { data: mapped };
        }
      }

      const all = getStoredEvents();
      const match = all.find(e => e.slug === slug || e.id === slug);
      if (match) return { data: match };

      return { data: null, error: 'Event not found' };
    } catch (err: unknown) {
      const all = getStoredEvents();
      const match = all.find(e => e.slug === slug || e.id === slug);
      return { data: match || null };
    }
  },

  /**
   * Admin: List all events (all statuses)
   */
  async adminListEvents(): Promise<{ data: EventItem[]; error?: string }> {
    try {
      const deleted = getDeletedEventIds();
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapEvent).filter(e => !deleted.has(e.id) && (!e.slug || !deleted.has(e.slug)));
          const local = getStoredEvents();
          const remoteIds = new Set(mapped.map(m => m.id));
          const localOnly = local.filter(l => !remoteIds.has(l.id));
          return { data: [...localOnly, ...mapped] };
        }
      }

      return { data: getStoredEvents() };
    } catch (err: unknown) {
      return { data: getStoredEvents() };
    }
  },

  /**
   * Admin: Create new event
   */
  async createEvent(event: any): Promise<{ data?: EventItem; error?: string }> {
    const title = event.title || 'Untitled Event';
    const slug = event.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('event-' + Date.now());
    const isPublished = event.is_published !== false && event.status !== 'draft';

    const newEvent: EventItem = {
      id: event.id || `event-${Date.now()}`,
      slug,
      title,
      category: event.category || 'Workshop',
      event_date: event.date || event.event_date || new Date().toISOString().split('T')[0],
      date: event.date || event.event_date || new Date().toISOString().split('T')[0],
      event_time: event.time || event.event_time || '10:00 AM - 1:00 PM',
      time: event.time || event.event_time || '10:00 AM - 1:00 PM',
      venue: event.location || event.venue || 'CMRIT Campus, Bengaluru',
      location: event.location || event.venue || 'CMRIT Campus, Bengaluru',
      description: event.description || '',
      shortDescription: event.shortDescription || (event.description ? event.description.slice(0, 150) : ''),
      image: event.image || event.image_url || '',
      image_url: event.image || event.image_url || '',
      organizer: event.organizer || 'CSI CMRIT',
      highlights: Array.isArray(event.highlights) ? event.highlights : [],
      registrationOpen: event.registrationOpen !== false,
      is_published: isPublished,
      status: isPublished ? 'published' : 'draft',
      is_featured: !!event.is_featured,
      created_at: new Date().toISOString()
    };

    // 1. Immediately persist to clean production store
    const current = getStoredEvents();
    saveStoredEvents([newEvent, ...current]);

    // 2. Sync to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const payload = {
          slug: newEvent.slug,
          title: newEvent.title,
          category: newEvent.category,
          event_date: newEvent.event_date,
          event_time: newEvent.event_time,
          venue: newEvent.venue,
          description: newEvent.description,
          image_url: newEvent.image_url,
          organizer: newEvent.organizer,
          status: newEvent.status,
          created_by: userData?.user?.id || null,
        };

        const { data, error } = await supabase
          .from('events')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          return { data: mapEvent(data) };
        }
      } catch (err) {
        console.warn('Supabase event insert error:', err);
      }
    }

    return { data: newEvent };
  },

  /**
   * Admin: Update an event
   */
  async updateEvent(id: string, updates: any): Promise<{ data?: EventItem; error?: string }> {
    const current = getStoredEvents();
    const updated = current.map(e => {
      if (e.id === id || e.slug === id) {
        const next = { ...e, ...updates };
        if (updates.date) { next.event_date = updates.date; next.date = updates.date; }
        if (updates.time) { next.event_time = updates.time; next.time = updates.time; }
        if (updates.location) { next.venue = updates.location; next.location = updates.location; }
        if (updates.image) { next.image_url = updates.image; next.image = updates.image; }
        if (updates.is_published !== undefined) {
          next.status = updates.is_published ? 'published' : 'draft';
        }
        return next;
      }
      return e;
    });
    saveStoredEvents(updated);

    if (isSupabaseConfigured) {
      try {
        const payload: any = { ...updates };
        if (updates.date) payload.event_date = updates.date;
        if (updates.time) payload.event_time = updates.time;
        if (updates.location) payload.venue = updates.location;
        if (updates.image) payload.image_url = updates.image;
        if (updates.is_published !== undefined) {
          payload.status = updates.is_published ? 'published' : 'draft';
        }
        await supabase.from('events').update(payload).or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase event update error:', err);
      }
    }

    const item = updated.find(e => e.id === id || e.slug === id);
    return { data: item };
  },

  /**
   * Admin: Toggle publish
   */
  async toggleEventPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const current = getStoredEvents();
    const updated: EventItem[] = current.map(e => {
      if (e.id === id || e.slug === id) {
        return {
          ...e,
          status: newStatus as any,
          is_published: newStatus === 'published'
        };
      }
      return e;
    });
    saveStoredEvents(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('events').update({ status: newStatus }).or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase toggleEventPublish error:', err);
      }
    }

    return { success: true };
  },

  /**
   * Admin: Delete event permanently
   */
  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    saveDeletedEventId(id);
    const current = getStoredEvents();
    saveStoredEvents(current.filter(e => e.id !== id && e.slug !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('events').delete().or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase deleteEvent error:', err);
      }
    }

    return { success: true };
  }
};
