import { supabase } from '../lib/supabaseClient';
import { EventItem } from '../types';

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

      if (error) {
        return { data: [], error: error.message };
      }

      // Map Supabase DB columns to frontend display properties
      const mapped = (data || []).map((e) => ({
        ...e,
        date: e.event_date,
        time: e.event_time,
        image: e.image_url,
        shortDescription: e.description?.slice(0, 140) + '...',
        registrationOpen: e.registration_link ? true : false,
      })) as EventItem[];

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
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
        return { data: null, error: error?.message || 'Event not found' };
      }

      const mapped = {
        ...data,
        date: data.event_date,
        time: data.event_time,
        image: data.image_url,
        shortDescription: data.description?.slice(0, 140) + '...',
        registrationOpen: data.registration_link ? true : false,
      } as EventItem;

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: null, error: error.message };
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
