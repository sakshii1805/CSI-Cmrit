import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseAnonKey !== 'placeholder-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    '[CSI CMRIT] Supabase credentials are not yet set in .env. ' +
    'Running in local dev preview mode until real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are added.'
  );
}

// Ensure client initializes without hard crash even if credentials are not yet set
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);
