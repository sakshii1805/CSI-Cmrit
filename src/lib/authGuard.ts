import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Validates whether the current runtime environment / browser session has admin authorization.
 * Checks both local storage authenticated admin session and active Supabase user.
 */
export const checkAdminAuthorization = async (): Promise<boolean> => {
  try {
    // 1. Check local session persistence
    const saved = localStorage.getItem('csi_dev_admin_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const email = parsed?.user?.email?.toLowerCase();
        if (email === 'admin@cmritonline.ac.in' || email === 'admin@cmritsi.in') {
          return true;
        }
      } catch {}
    }

    // 2. Check Supabase auth if configured
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email?.toLowerCase();
      if (email === 'admin@cmritonline.ac.in' || email === 'admin@cmritsi.in') {
        return true;
      }
    }
  } catch (err) {
    console.error('Authorization check failed:', err);
  }

  return false;
};

export const requireAdmin = async (): Promise<void> => {
  const isAuthorized = await checkAdminAuthorization();
  if (!isAuthorized) {
    throw new Error('Unauthorized: This action requires administrator privileges.');
  }
};
