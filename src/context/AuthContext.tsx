import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AdminProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  adminProfile: AdminProfile | null;
  profile: AdminProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<AdminProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const NOT_ADMIN_MSG = 'This account is signed in but is not registered as an administrator.';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // The admins table is the single source of truth for who is an admin.
  const fetchAdminProfile = async (userId: string): Promise<AdminProfile | null> => {
    try {
      if (!isSupabaseConfigured) return null;
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error || !data) return null;
      return data as AdminProfile;
    } catch (err) {
      console.error('[Auth] Error fetching admin profile:', err);
      return null;
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setAdminProfile(null);
  };

  const applySession = async (newSession: Session | null) => {
    if (!newSession?.user) {
      clearAuthState();
      return;
    }
    const profile = await fetchAdminProfile(newSession.user.id);
    if (profile) {
      setSession(newSession);
      setUser(newSession.user);
      setAdminProfile(profile);
    } else {
      // Logged in to Supabase but not an admin: treat as a normal visitor.
      clearAuthState();
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchAdminProfile(user.id);
      if (profile) setAdminProfile(profile);
    }
  };

  const updateProfile = async (updates: Partial<AdminProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user?.id || !adminProfile) return { success: false, error: 'Not signed in.' };
      const updated: AdminProfile = { ...adminProfile, ...updates, updated_at: new Date().toISOString() };

      const { error } = await supabase
        .from('admins')
        .update({
          full_name: updated.full_name,
          avatar_url: updated.avatar_url,
          phone: updated.phone,
          designation: updated.designation,
          department: updated.department,
          bio: updated.bio,
          updated_at: updated.updated_at
        })
        .eq('id', user.id);

      if (error) return { success: false, error: error.message };
      setAdminProfile(updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile' };
    }
  };

  useEffect(() => {
    // Remove leftovers of the old fake/local login so they can never grant access.
    try {
      ['csi_dev_admin_session', 'csi_authorized_admin_accounts', 'csi_admin_profile_data',
       'csi_published_announcements', 'csi_published_events', 'csi_published_highlights',
       'csi_deleted_announcements', 'csi_deleted_events', 'csi_deleted_highlights']
        .forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (active) await applySession(session);
    }).catch(err => console.error('[Auth] Error during auth init:', err))
      .finally(() => { if (active) setIsLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Defer to avoid deadlocks inside the auth callback.
      setTimeout(() => { if (active) applySession(newSession); }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Real Supabase sign-in. No local passwords, no fake sessions.
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      if (!isSupabaseConfigured) {
        return { success: false, error: 'Website is not connected to the database. Please contact the site owner.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error || !data?.user) {
        return { success: false, error: error?.message === 'Invalid login credentials'
          ? 'Invalid email or password.'
          : (error?.message || 'Sign in failed.') };
      }

      const profile = await fetchAdminProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        clearAuthState();
        return { success: false, error: NOT_ADMIN_MSG };
      }

      setSession(data.session);
      setUser(data.user);
      setAdminProfile(profile);
      return { success: true };
    } catch (err: unknown) {
      const authErr = err as AuthError;
      return { success: false, error: authErr.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured) await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    } finally {
      clearAuthState();
    }
  };

  const isAdmin = !!adminProfile;
  const isSuperAdmin = adminProfile?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        adminProfile,
        profile: adminProfile,
        isAdmin,
        isSuperAdmin,
        isLoading,
        loading: isLoading,
        isAuthenticated: !!session && isAdmin,
        signIn,
        signOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
