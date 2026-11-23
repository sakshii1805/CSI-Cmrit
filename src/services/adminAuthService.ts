/**
 * Email-format helpers for the admin login UI.
 * Real authentication is done by Supabase Auth (see AuthContext.signIn) and
 * authorization by the `admins` table / is_admin() in the database.
 * No passwords or account lists are stored in the frontend.
 */

export const adminAuthService = {
  /** Validates the institutional format username@cmritonline.ac.in */
  isValidCmritEmail(email: string): boolean {
    if (!email) return false;
    return /^[a-zA-Z0-9._%+-]+@cmritonline\.ac\.in$/.test(email.trim().toLowerCase());
  },

  isValidEmailFormat(email: string): boolean {
    return this.isValidCmritEmail(email);
  },

  /** Format check only; the database decides who is really an admin. */
  isAuthorizedEmail(email: string): boolean {
    return this.isValidCmritEmail(email);
  }
};

// Kept so existing imports of this type keep compiling.
export interface AuthorizedAdminAccount {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  designation: string;
  department: string;
  phone: string;
  bio: string;
  created_at: string;
}
