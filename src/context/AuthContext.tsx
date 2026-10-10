import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AdminProfile } from '../types';
import { adminAuthService } from '../services/adminAuthService';

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
  id: 'admin-01',
  full_name: 'Chapter Executive',
  email: 'csi@cmritonline.ac.in',
  role: 'super_admin',
  avatar_url: '', // Default clean: No profile picture (initials monogram)
  designation: 'CSI Chapter Lead',
  department: 'Department of Computer Science & Engineering',
  phone: '+91 80 2852 4466',
  bio: 'Authorized administrator for CSI CMRIT chapter. Managing chapter events, workshops, hackathons, and technical community activities.',
  created_at: '2024-01-15T00:00:00.000Z'
};

export const getSavedProfile = (email?: string): AdminProfile => {
  const cleanEmail = email?.trim().toLowerCase();
  if (cleanEmail) {
    const account = adminAuthService.getAccountByEmail(cleanEmail);
    if (account) {
      return {
        id: account.id,
        full_name: account.full_name,
        email: account.email,
        role: account.role,
        avatar_url: '',
        designation: account.designation,
        department: account.department,
        phone: account.phone,
        bio: account.bio,
        created_at: account.created_at
      };
    }
  }
  try {
    const saved = localStorage.getItem('csi_admin_profile_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.email && adminAuthService.isAuthorizedEmail(parsed.email)) {
        const acc = adminAuthService.getAccountByEmail(parsed.email);
        return {
          ...DEFAULT_ADMIN_PROFILE,
          ...acc,
          ...parsed
        };
      }
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

      if (user?.email) {
        adminAuthService.updateProfile(user.email, {
          full_name: updated.full_name,
          designation: updated.designation,
          department: updated.department,
          phone: updated.phone,
          bio: updated.bio
        });
      }

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
            const savedEmail = parsed.user?.email?.toLowerCase();
            if (savedEmail && adminAuthService.isValidCmritEmail(savedEmail) && adminAuthService.isAuthorizedEmail(savedEmail)) {
              const account = adminAuthService.getAccountByEmail(savedEmail);
              const cleanProfile: AdminProfile = {
                id: account?.id || parsed.user.id || 'admin-01',
                email: savedEmail,
                full_name: parsed.profile?.full_name || account?.full_name || 'Administrator',
                role: account?.role || 'admin',
                avatar_url: parsed.profile?.avatar_url || '',
                designation: parsed.profile?.designation || account?.designation || 'Student Coordinator',
                department: parsed.profile?.department || account?.department || 'Department of Computer Science & Engineering',
                phone: parsed.profile?.phone || account?.phone || '+91 80 2852 4466',
                bio: parsed.profile?.bio || account?.bio || 'Authorized administrator for CSI CMRIT chapter.',
                created_at: account?.created_at || '2024-01-15T00:00:00.000Z'
              };
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
          if (session?.user && session.user.email && adminAuthService.isAuthorizedEmail(session.user.email)) {
            setSession(session);
            setUser(session.user);
            const profile = await fetchAdminProfile(session.user.id);
            setAdminProfile(profile || getSavedProfile(session.user.email));
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
      if (newSession?.user && newSession.user.email && adminAuthService.isAuthorizedEmail(newSession.user.email)) {
        setSession(newSession);
        setUser(newSession.user);
        const profile = await fetchAdminProfile(newSession.user.id);
        setAdminProfile(profile || getSavedProfile(newSession.user.email));
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

  // Secure Sign In - verifies strictly against 5 authorized administrator accounts (@cmritonline.ac.in)
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const verifyRes = adminAuthService.verifyCredentials(cleanEmail, cleanPassword);
      if (!verifyRes.success || !verifyRes.account) {
        return {
          success: false,
          error: verifyRes.error || 'Access denied: Invalid credentials.'
        };
      }

      const account = verifyRes.account;
      const currentProfile: AdminProfile = {
        id: account.id,
        full_name: account.full_name,
        email: account.email,
        role: account.role,
        avatar_url: '',
        designation: account.designation,
        department: account.department,
        phone: account.phone,
        bio: account.bio,
        created_at: account.created_at
      };

      const authorizedUser: any = {
        id: account.id,
        email: account.email,
        app_metadata: { role: account.role },
        user_metadata: {
          full_name: account.full_name,
          avatar_url: ''
        },
        aud: 'authenticated',
        created_at: account.created_at
      };

      const authorizedSession: any = {
        access_token: 'auth-csi-cmrit-admin-token-' + account.id,
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
          console.warn('[Auth] Supabase sign-in bypassed in favor of local authorized credential:', supabaseErr);
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
