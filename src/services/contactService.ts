import { supabase } from '../lib/supabaseClient';
import { requireAdmin } from '../lib/authGuard';
import { ContactMessage } from '../types';

export const contactService = {
  /**
   * Public: Submit contact message
   */
  async submitMessage(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
      };

      const { error } = await supabase
        .from('contact_messages')
        .insert([payload]);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: List all contact inquiries
   */
  async adminListMessages(): Promise<{ data: ContactMessage[]; error?: string }> {
    try {
      await requireAdmin();
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as ContactMessage[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Mark message as read / unread
   */
  async markMessageRead(id: string, isRead: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      await requireAdmin();
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: Delete contact message
   */
  async deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await requireAdmin();
      const { error } = await supabase
        .from('contact_messages')
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
