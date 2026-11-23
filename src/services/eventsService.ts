import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { requireAdmin } from '../lib/authGuard';
import { matchIdOrSlug, notifyContentUpdated, slugify, uniqueSlug } from '../lib/dbHelpers';
import { EventItem } from '../types';
import { mockEvents } from '../data/events';

// The Avishkaar post lives in the database; these rich display-only extras
// (poster gallery, speaker, rules) are merged in because the table has no columns for them.
const AVISHKAAR_EXTRAS = mockEvents.find(m => m.slug === 'avishkaar-2026');

const NOT_CONFIGURED = 'Website is not connected to the database.';

/** Normalize DB row to frontend EventItem */
const mapEvent = (e: any): EventItem => {
  if (e.slug === 'avishkaar-2026' && AVISHKAAR_EXTRAS) {
    e = {
      ...e,
      galleryImages: e.galleryImages?.length ? e.galleryImages : AVISHKAAR_EXTRAS.galleryImages,
      expectations: e.expectations || AVISHKAAR_EXTRAS.expectations,
      speaker: e.speaker || AVISHKAAR_EXTRAS.speaker,
      mode: e.mode || AVISHKAAR_EXTRAS.mode,
      shortDescription: e.shortDescription || AVISHKAAR_EXTRAS.shortDescription,
      highlights: e.highlights?.length ? e.highlights : AVISHKAAR_EXTRAS.highlights,
      image: e.image || e.image_url || AVISHKAAR_EXTRAS.image,
    };
  }
  const galleryImages = Array.isArray(e.galleryImages) && e.galleryImages.length > 0
    ? e.galleryImages
    : (e.image || e.image_url ? [e.image || e.image_url] : []);
  const primaryImage = e.image || e.image_url || galleryImages[0] || '';

  return {
    ...e,
    date: e.date || (e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBA'),
    event_date: e.event_date || e.date || new Date().toISOString().split('T')[0],
    time: e.event_time || e.time || 'Time TBA',
    event_time: e.event_time || e.time || 'Time TBA',
    venue: e.venue || e.location || 'CMRIT Campus, Bengaluru',
    location: e.venue || e.location || 'CMRIT Campus, Bengaluru',
    image: primaryImage,
    image_url: primaryImage,
    galleryImages,
    is_published: e.status ? e.status === 'published' : (e.is_published !== false),
    status: e.status || (e.is_published !== false ? 'published' : 'draft'),
    is_pinned: Boolean(e.is_pinned),
    registrationOpen: e.registrationOpen ?? (e.status === 'published' || e.is_published !== false),
    shortDescription: e.shortDescription || e.description?.slice(0, 180) + (e.description && e.description.length > 180 ? '...' : '')
  };
};

const sortEvents = (a: EventItem, b: EventItem) => {
  if (a.is_pinned && !b.is_pinned) return -1;
  if (!a.is_pinned && b.is_pinned) return 1;
  const timeA = new Date(a.event_date || a.date || a.created_at || 0).getTime();
  const timeB = new Date(b.event_date || b.date || b.created_at || 0).getTime();
  return timeB - timeA;
};

export const eventsService = {
  async getPublishedEvents(): Promise<{ data: EventItem[]; error?: string }> {
    if (!isSupabaseConfigured) return { data: [], error: NOT_CONFIGURED };
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('event_date', { ascending: false });
    if (error) {
      console.warn('[CSI] events query failed:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data || []).map(mapEvent).sort(sortEvents) };
  },

  async getLatestEvents(limit: number = 4): Promise<{ data: EventItem[]; error?: string }> {
    const res = await this.getPublishedEvents();
    return { data: (res.data || []).slice(0, limit), error: res.error };
  },

  async getUpcomingEvents(): Promise<{ data: EventItem[]; error?: string }> {
    const today = new Date().toISOString().split('T')[0];
    const res = await this.getPublishedEvents();
    return { data: (res.data || []).filter(e => (e.event_date || e.date || '') >= today) };
  },

  async getPastEvents(): Promise<{ data: EventItem[]; error?: string }> {
    const today = new Date().toISOString().split('T')[0];
    const res = await this.getPublishedEvents();
    return { data: (res.data || []).filter(e => (e.event_date || e.date || '') < today) };
  },

  async getEventBySlug(slug: string): Promise<{ data: EventItem | null; error?: string }> {
    if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };
    const { data, error } = await matchIdOrSlug(
      supabase.from('events').select('*').eq('status', 'published'),
      slug
    ).maybeSingle();
    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: 'Event not found' };
    return { data: mapEvent(data) };
  },

  async adminListEvents(): Promise<{ data: EventItem[]; error?: string }> {
    if (!isSupabaseConfigured) return { data: [], error: NOT_CONFIGURED };
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) return { data: [], error: error.message };
    return { data: (data || []).map(mapEvent) };
  },

  async createEvent(event: any): Promise<{ data?: EventItem; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { error: e.message }; }

    const title = event.title || 'Untitled Event';
    const isPublished = event.is_published !== false && event.status !== 'draft';
    const image = event.image || event.image_url || '';
    const { data: userData } = await supabase.auth.getUser();

    const payload: any = {
      slug: event.slug || uniqueSlug(slugify(title, 'event')),
      title,
      category: event.category || 'Workshop',
      event_date: event.date || event.event_date || new Date().toISOString().split('T')[0],
      event_time: event.time || event.event_time || '10:00 AM - 1:00 PM',
      venue: event.location || event.venue || 'CMRIT Campus, Bengaluru',
      description: event.description || '',
      image_url: image || null,
      organizer: event.organizer || 'CSI CMRIT',
      status: isPublished ? 'published' : 'draft',
      created_by: userData?.user?.id || null,
    };

    const { data, error } = await supabase.from('events').insert([payload]).select().single();
    if (error) {
      console.error('[CSI] event insert failed:', error);
      return { error: error.message };
    }
    notifyContentUpdated('event');
    return { data: mapEvent({ ...data, galleryImages: event.galleryImages }) };
  },

  async updateEvent(id: string, updates: any): Promise<{ data?: EventItem; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { error: e.message }; }

    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.organizer !== undefined) payload.organizer = updates.organizer;
    if (updates.date || updates.event_date) payload.event_date = updates.date || updates.event_date;
    if (updates.time || updates.event_time) payload.event_time = updates.time || updates.event_time;
    if (updates.location || updates.venue) payload.venue = updates.location || updates.venue;
    if (updates.image || updates.image_url) payload.image_url = updates.image || updates.image_url;
    if (updates.is_pinned !== undefined) payload.is_pinned = updates.is_pinned;
    if (updates.status !== undefined || updates.is_published !== undefined) {
      const published = updates.status ? updates.status === 'published' : !!updates.is_published;
      payload.status = published ? 'published' : 'draft';
    }

    const { data, error } = await matchIdOrSlug(supabase.from('events').update(payload), id).select().maybeSingle();
    if (error) return { error: error.message };
    if (!data) return { error: 'Update was blocked or the event no longer exists.' };
    notifyContentUpdated('event');
    return { data: mapEvent(data) };
  },

  async toggleEventPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, error: e.message }; }
    const next = currentStatus === 'published' ? 'draft' : 'published';
    const { data, error } = await matchIdOrSlug(supabase.from('events').update({ status: next }), id).select('id');
    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: false, error: 'Update was blocked by the database.' };
    notifyContentUpdated('event');
    return { success: true };
  },

  async togglePinEvent(id: string): Promise<{ success: boolean; is_pinned: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, is_pinned: false, error: e.message }; }
    const { data: row, error: readErr } = await matchIdOrSlug(supabase.from('events').select('id,is_pinned'), id).maybeSingle();
    if (readErr || !row) return { success: false, is_pinned: false, error: readErr?.message || 'Event not found.' };
    const next = !(row as any).is_pinned;
    const { error } = await supabase.from('events').update({ is_pinned: next } as any).eq('id', row.id);
    if (error) return { success: false, is_pinned: !next, error: error.message };
    notifyContentUpdated('event');
    return { success: true, is_pinned: next };
  },

  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try { await requireAdmin(); } catch (e: any) { return { success: false, error: e.message }; }
    const { data, error } = await matchIdOrSlug(supabase.from('events').delete(), id).select('id');
    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: false, error: 'Nothing was deleted. The event may already be gone, or the database blocked it.' };
    notifyContentUpdated('event');
    return { success: true };
  }
};
