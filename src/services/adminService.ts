import { supabase } from '../lib/supabaseClient';
import { AdminProfile } from '../types';

export interface AdminStats {
  totalEvents: number;
  publishedEvents: number;
  totalAnnouncements: number;
  publishedAnnouncements: number;
  galleryImages: number;
  totalApplications: number;
  pendingApplications: number;
  pendingComments: number;
  totalComments: number;
  unreadMessages: number;
  blockedEmailsCount: number;
}

export const adminService = {
  /**
   * Aggregate real counts across all database tables for the Admin Dashboard
   */
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const [
        eventsRes,
        pubEventsRes,
        announcementsRes,
        pubAnnouncementsRes,
        highlightsRes,
        appsRes,
        pendingAppsRes,
        pendingCommentsRes,
        commentsRes,
        messagesRes,
        blockedRes
      ] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
        supabase.from('announcements').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('highlights').select('id', { count: 'exact', head: true }),
        supabase.from('join_applications').select('id', { count: 'exact', head: true }),
        supabase.from('join_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('blocked_emails').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalEvents: eventsRes.count || 0,
        publishedEvents: pubEventsRes.count || 0,
        totalAnnouncements: announcementsRes.count || 0,
        publishedAnnouncements: pubAnnouncementsRes.count || 0,
        galleryImages: highlightsRes.count || 0,
        totalApplications: appsRes.count || 0,
        pendingApplications: pendingAppsRes.count || 0,
        pendingComments: pendingCommentsRes.count || 0,
        totalComments: commentsRes.count || 0,
        unreadMessages: messagesRes.count || 0,
        blockedEmailsCount: blockedRes.count || 0,
      };
    } catch (err) {
      console.error('[Admin] Error fetching stats:', err);
      return {
        totalEvents: 0,
        publishedEvents: 0,
        totalAnnouncements: 0,
        publishedAnnouncements: 0,
        galleryImages: 0,
        totalApplications: 0,
        pendingApplications: 0,
        pendingComments: 0,
        totalComments: 0,
        unreadMessages: 0,
        blockedEmailsCount: 0,
      };
    }
  },

  /**
   * Update administrator profile (full_name, avatar_url)
   */
  async updateAdminProfile(id: string, updates: { full_name?: string; avatar_url?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admins')
        .update(updates)
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Change the signed-in admin's password through Supabase Auth.
   * If currentPassword is given, it is verified first by re-authenticating.
   */
  async changePassword(newPassword: string, email?: string, currentPassword?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { success: false, error: 'You are not signed in.' };

      if (currentPassword) {
        const { error: verifyErr } = await supabase.auth.signInWithPassword({
          email: email || session.user.email || '',
          password: currentPassword
        });
        if (verifyErr) return { success: false, error: 'Current password is incorrect.' };
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  },

  /**
   * Super Admin: List all registered administrators
   */
  async listAdmins(): Promise<{ data: AdminProfile[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as AdminProfile[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  }
};
