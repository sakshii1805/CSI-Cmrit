import { supabase } from '../lib/supabaseClient';
import { EventItem } from '../types';
import { mockEvents } from '../data/events';

export const eventsService = {
  /**
   * Public: Fetch all published events ordered by event_date
   */
  async getPublishedEvents(): Promise<{ data: EventItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });

      if (error || !data || data.length === 0) {
        return { data: mockEvents };
      }

      // Map Supabase DB columns to frontend display properties
      const mapped = (data || []).map((e) => ({
        ...e,
        date: e.event_date || e.date,
        time: e.event_time || e.time,
        image: e.image_url || e.image,
        shortDescription: e.shortDescription || e.description?.slice(0, 140) + '...',
        registrationOpen: e.registration_link ? true : (e.registrationOpen !== false),
      })) as EventItem[];

      return { data: mapped.length > 0 ? mapped : mockEvents };
    } catch {
      return { data: mockEvents };
    }
  },

  /**
   * Public: Fetch single published event by slug
   */
  async getEventBySlug(slug: string): Promise<{ data: EventItem | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        const fallback = mockEvents.find((e) => e.slug === slug || e.id === slug) || null;
        return { data: fallback };
      }

      const mapped = {
        ...data,
        date: data.event_date || data.date,
        time: data.event_time || data.time,
        image: data.image_url || data.image,
        shortDescription: data.shortDescription || data.description?.slice(0, 140) + '...',
        registrationOpen: data.registration_link ? true : (data.registrationOpen !== false),
      } as EventItem;

      return { data: mapped };
    } catch {
      const fallback = mockEvents.find((e) => e.slug === slug || e.id === slug) || null;
      return { data: fallback };
    }
  },

  /**
   * Admin: List all events (both drafts and published)
   */
  async adminListEvents(): Promise<{ data: EventItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: (data || []) as EventItem[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Create new event
   */
  async createEvent(event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: EventItem; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        ...event,
        created_by: userData?.user?.id || null,
      };

      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }
      return { data: data as EventItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Update an event
   */
  async updateEvent(id: string, updates: Partial<EventItem>): Promise<{ data?: EventItem; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }
      return { data: data as EventItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Toggle event status between draft and published
   */
  async toggleEventPublish(id: string, currentStatus: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('events')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  /**
   * Admin: Delete event
   */
  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
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
