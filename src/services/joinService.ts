import { supabase } from '../lib/supabaseClient';
import { JoinApplication } from '../types';

export const joinService = {
  /**
   * Public: Submit a student membership join application
   */
  async submitApplication(data: {
    fullName: string;
    email: string;
    year: string;
    branch: string;
    phone: string;
    reason: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        full_name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        year: data.year,
        branch: data.branch,
        phone: data.phone.trim(),
        reason: data.reason.trim(),
        status: 'pending',
      };

      const { error } = await supabase
        .from('join_applications')
        .insert([payload]);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: List all student applications
   */
  async adminListApplications(): Promise<{ data: JoinApplication[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('join_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };

      const mapped = (data || []).map((app) => ({
        ...app,
        fullName: app.full_name,
        submittedAt: app.created_at,
        interests: [app.branch, app.year],
      })) as JoinApplication[];

      return { data: mapped };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Update application status ('pending' | 'approved' | 'rejected')
   */
  async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('join_applications')
        .update({ status })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: Delete application
   */
  async deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('join_applications')
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
