import { supabase } from '../lib/supabaseClient';
import { ActivityLogItem } from '../types';

export const activityService = {
  /**
   * Admin: Log an activity action
   */
  async logActivity(
    action: string,
    targetType: string,
    targetId?: string,
    targetTitle?: string
  ): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();

      // Try to get admin name
      let adminName = 'Admin';
      if (userData?.user?.id) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('full_name')
          .eq('id', userData.user.id)
          .single();
        if (adminData?.full_name) {
          adminName = adminData.full_name;
        }
      }

      await supabase.from('activity_log').insert([{
        admin_id: userData?.user?.id || null,
        admin_name: adminName,
        action,
        target_type: targetType,
        target_id: targetId || null,
        target_title: targetTitle || null,
      }]);
    } catch (err) {
      // Silently fail — activity logging is non-critical
      console.warn('[Activity] Failed to log activity:', err);
    }
  },

  /**
   * Admin: Get recent activity entries for the dashboard
   */
  async getRecentActivity(limit: number = 15): Promise<{ data: ActivityLogItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as ActivityLogItem[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },
};
