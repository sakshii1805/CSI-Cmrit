import { supabase } from '../lib/supabaseClient';
import { SihItem } from '../types';

export const sihService = {
  /**
   * Public: Fetch all published SIH items
   */
  async getPublishedSihItems(): Promise<{ data: SihItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('sih_items')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as SihItem[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: List all SIH items
   */
  async adminListSihItems(): Promise<{ data: SihItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('sih_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as SihItem[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Create SIH item
   */
  async createSihItem(item: Omit<SihItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: SihItem; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('sih_items')
        .insert([item])
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as SihItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Update SIH item
   */
  async updateSihItem(id: string, updates: Partial<SihItem>): Promise<{ data?: SihItem; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('sih_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as SihItem };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message };
    }
  },

  /**
   * Admin: Delete SIH item
   */
  async deleteSihItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('sih_items')
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
