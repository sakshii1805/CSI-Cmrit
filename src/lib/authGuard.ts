import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * True only when there is a REAL Supabase session AND the database says the
 * user is an admin (public.is_admin() checks the admins table).
 * Nothing stored in the browser can fake this.
 */
export const checkAdminAuthorization = async (): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured) return false;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    const { data, error } = await supabase.rpc('is_admin');
    return !error && data === true;
  } catch (err) {
    console.error('Authorization check failed:', err);
    return false;
  }
};

export const requireAdmin = async (): Promise<void> => {
  const ok = await checkAdminAuthorization();
  if (!ok) {
    throw new Error('Not signed in as an administrator. Please log in again.');
  }
};
