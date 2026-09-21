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

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  id: 'admin-cmrit-01',
  full_name: 'Student Admin',
  email: 'admin@cmritonline.ac.in',
  role: 'super_admin',
  avatar_url: '', // Default clean: No profile picture (initials monogram)
  designation: 'Student Coordinator',
  department: 'Department of Computer Science & Engineering',
  phone: '+91 80 2852 4466',
  bio: 'Student coordinator for CSI CMRIT chapter. Managing chapter events, workshops, hackathons, and technical community activities.',
  created_at: '2024-01-15T00:00:00.000Z'
};

export const getSavedProfile = (): AdminProfile => {
  try {
    const saved = localStorage.getItem('csi_admin_profile_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      let changed = false;
      // Only fix empty names or known dummy placeholders
      if (
        !parsed.full_name ||
        parsed.full_name === 'CMRIT CSI Administrator' ||
        parsed.full_name === 'Prof. Rajesh Sharma'
      ) {
        parsed.full_name = 'Student Admin';
        changed = true;
      }
      // If the avatar was any stock/unsplash photo, clear it to empty so it defaults to no profile picture
      if (parsed.avatar_url && (parsed.avatar_url.includes('unsplash') || parsed.avatar_url.includes('photo-'))) {
        parsed.avatar_url = '';
        changed = true;
      }
      if (
        !parsed.designation ||
        parsed.designation === 'Lead Faculty Coordinator / Chapter Lead'
      ) {
        parsed.designation = 'Student Coordinator';
        changed = true;
      }
      const merged = { ...DEFAULT_ADMIN_PROFILE, ...parsed };
      if (changed) {
        try {
          localStorage.setItem('csi_admin_profile_data', JSON.stringify(merged));
        } catch {}
      }
      return merged;
    }
  } catch {}
  return DEFAULT_ADMIN_PROFILE;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch admin profile from public.admins table if Supabase is active
  const fetchAdminProfile = async (userId: string): Promise<AdminProfile | null> => {
    try {
      if (!isSupabaseConfigured) return null;
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data as AdminProfile;
    } catch (err) {
      console.error('[Auth] Error fetching admin profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user && isSupabaseConfigured) {
      const profile = await fetchAdminProfile(user.id);
      if (profile) {
        setAdminProfile(profile);
        return;
      }
    }
    setAdminProfile(getSavedProfile());
  };

  const updateProfile = async (updates: Partial<AdminProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      const current = adminProfile || getSavedProfile();
      const updated: AdminProfile = {
        ...current,
        ...updates,
        updated_at: new Date().toISOString()
      };

      setAdminProfile(updated);
      try {
        localStorage.setItem('csi_admin_profile_data', JSON.stringify(updated));
        const sessionData = localStorage.getItem('csi_dev_admin_session');
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          parsed.profile = updated;
          if (updates.full_name) {
            parsed.user.user_metadata = { ...(parsed.user.user_metadata || {}), full_name: updates.full_name };
          }
          localStorage.setItem('csi_dev_admin_session', JSON.stringify(parsed));
        }
      } catch {}

      if (isSupabaseConfigured && user?.id) {
        try {
          await supabase
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
        } catch (e) {
          console.warn('[Auth] Supabase profile sync warning:', e);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile' };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const saved = localStorage.getItem('csi_dev_admin_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const savedProfile = getSavedProfile();
            // Strictly check that the session belongs to admin@cmritonline.ac.in
            if (parsed.user?.email?.toLowerCase() === 'admin@cmritonline.ac.in') {
              let cleanFullName = savedProfile.full_name || parsed.profile?.full_name || 'Student Admin';
              if (cleanFullName === 'CMRIT CSI Administrator' || cleanFullName === 'Prof. Rajesh Sharma') {
                cleanFullName = 'Student Admin';
              }
              let cleanAvatar = parsed.profile?.avatar_url ?? savedProfile.avatar_url ?? '';
              if (cleanAvatar && (cleanAvatar.includes('unsplash') || cleanAvatar.includes('photo-'))) {
                cleanAvatar = '';
              }
              const cleanProfile = {
                ...savedProfile,
                ...parsed.profile,
                full_name: cleanFullName,
                avatar_url: cleanAvatar
              };
              if (parsed.user.user_metadata) {
                parsed.user.user_metadata.full_name = cleanFullName;
                parsed.user.user_metadata.avatar_url = cleanAvatar;
              }
              setUser(parsed.user);
              setAdminProfile(cleanProfile);
              setSession({ user: parsed.user } as any);
            } else {
              localStorage.removeItem('csi_dev_admin_session');
            }
          } catch {
            localStorage.removeItem('csi_dev_admin_session');
          }
        }

        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && session.user.email?.toLowerCase() === 'admin@cmritonline.ac.in') {
            setSession(session);
            setUser(session.user);
            const profile = await fetchAdminProfile(session.user.id);
            setAdminProfile(profile || getSavedProfile());
          }
        }
      } catch (err) {
        console.error('[Auth] Error during auth init:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    if (!isSupabaseConfigured) return;

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user && newSession.user.email?.toLowerCase() === 'admin@cmritonline.ac.in') {
        setSession(newSession);
        setUser(newSession.user);
        const profile = await fetchAdminProfile(newSession.user.id);
        setAdminProfile(profile || getSavedProfile());
      } else if (!newSession) {
        // If not logged in via dev session either
        const saved = localStorage.getItem('csi_dev_admin_session');
        if (!saved) {
          setUser(null);
          setSession(null);
          setAdminProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Secure Sign In - STRICTLY enforces only admin@cmritonline.ac.in and admin123
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // RULE ENFORCEMENT: Only admin@cmritonline.ac.in with admin123 is allowed
      if (cleanEmail !== 'admin@cmritonline.ac.in' || cleanPassword !== 'admin123') {
        return {
          success: false,
          error: 'Access denied: Invalid credentials. Only the authorized administrator account (admin@cmritonline.ac.in) is permitted.'
        };
      }

      const currentProfile = getSavedProfile();
      const authorizedUser: any = {
        id: currentProfile.id || 'admin-cmrit-01',
        email: 'admin@cmritonline.ac.in',
        app_metadata: { role: 'super_admin' },
        user_metadata: {
          full_name: currentProfile.full_name,
          avatar_url: currentProfile.avatar_url
        },
        aud: 'authenticated',
        created_at: currentProfile.created_at || '2024-01-15T00:00:00.000Z'
      };

      const authorizedSession: any = {
        access_token: 'auth-csi-cmrit-admin-token',
        token_type: 'bearer',
        expires_in: 86400,
        refresh_token: 'auth-refresh-token',
        user: authorizedUser
      };

      // If Supabase is configured, attempt auth or fallback gracefully
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

          if (!error && data?.user) {
            const profile = await fetchAdminProfile(data.user.id);
            const finalProfile = profile ? { ...currentProfile, ...profile } : currentProfile;
            setUser(data.user);
            setSession(data.session);
            setAdminProfile(finalProfile);
            try {
              localStorage.setItem('csi_dev_admin_session', JSON.stringify({ user: data.user, profile: finalProfile }));
              localStorage.setItem('csi_admin_profile_data', JSON.stringify(finalProfile));
            } catch {}
            return { success: true };
          }
        } catch (supabaseErr) {
          console.warn('[Auth] Supabase sign-in bypassed in favor of single authorized credential:', supabaseErr);
        }
      }

      // Persist authorized session
      try {
        localStorage.setItem('csi_dev_admin_session', JSON.stringify({ user: authorizedUser, profile: currentProfile }));
        localStorage.setItem('csi_admin_profile_data', JSON.stringify(currentProfile));
      } catch {}

      setUser(authorizedUser);
      setSession(authorizedSession);
      setAdminProfile(currentProfile);
      return { success: true };
    } catch (err: unknown) {
      const authErr = err as AuthError;
      return { success: false, error: authErr.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      localStorage.removeItem('csi_dev_admin_session');
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setAdminProfile(null);
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
