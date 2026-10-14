/**
 * CSI CMRIT Authorized Administrators Authentication Service
 * Manages the 5 authorized administrator accounts (format: username@cmritonline.ac.in)
 * and their password modification lifecycle.
 */

import { validatePasswordStrict, evaluatePasswordSecurity, PasswordValidationResult } from '../lib/passwordSecurity';

export interface AuthorizedAdminAccount {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  designation: string;
  department: string;
  phone: string;
  bio: string;
  created_at: string;
  password_updated_at?: string;
}

const STORAGE_KEY = 'csi_authorized_admin_accounts';

// Initial 5 authorized administrator accounts allocated to the chapter
export const DEFAULT_AUTHORIZED_ACCOUNTS: AuthorizedAdminAccount[] = [
  {
    id: 'admin-01',
    email: 'csi@cmritonline.ac.in',
    password: 'admin123',
    full_name: 'Chapter Executive',
    role: 'super_admin',
    designation: 'CSI Chapter Lead',
    department: 'Department of Computer Science & Engineering',
    phone: '+91 80 2852 4466',
    bio: 'Primary institutional account for CSI CMRIT chapter management and administration.',
    created_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'admin-02',
    email: 'admin@cmritonline.ac.in',
    password: 'admin123',
    full_name: 'Administrator',
    role: 'super_admin',
    designation: 'Student Administrator',
    department: 'Department of Computer Science & Engineering',
    phone: '+91 80 2852 4466',
    bio: 'Administrative console access for event circulars and portal supervision.',
    created_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'admin-03',
    email: 'akshitha@cmritonline.ac.in',
    password: 'admin123',
    full_name: 'Akshitha B',
    role: 'admin',
    designation: 'Chapter President',
    department: 'Department of Computer Science & Engineering',
    phone: '+91 95734 69911',
    bio: 'President, CSI CMRIT Student Chapter. Overseeing chapter initiatives and student council.',
    created_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'admin-04',
    email: 'sumeet@cmritonline.ac.in',
    password: 'admin123',
    full_name: 'Medi Sumeet',
    role: 'admin',
    designation: 'Vice President',
    department: 'Department of Computer Science & Engineering',
    phone: '+91 80748 29165',
    bio: 'Vice President, CSI CMRIT Student Chapter. Coordinating hackathons and workshops.',
    created_at: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'admin-05',
    email: 'sakshi@cmritonline.ac.in',
    password: 'admin123',
    full_name: 'Sakshi Mala',
    role: 'admin',
    designation: 'Technical Lead',
    department: 'Department of Computer Science & Engineering',
    phone: '+91 80 2852 4466',
    bio: 'Technical Lead, CSI CMRIT Student Chapter. Managing chapter web portal, SIH cell, and development.',
    created_at: '2024-01-15T00:00:00.000Z'
  }
];

export const adminAuthService = {
  /**
   * Validates whether an email strictly adheres to the format: username@cmritonline.ac.in
   */
  isValidCmritEmail(email: string): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    const regex = /^[a-zA-Z0-9._%+-]+@cmritonline\.ac\.in$/;
    return regex.test(clean);
  },

  isValidEmailFormat(email: string): boolean {
    return this.isValidCmritEmail(email);
  },

  /**
   * Retrieves all 5 authorized accounts from localStorage, initializing if not present.
   */
  getAccounts(): AuthorizedAdminAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[AdminAuth] Error reading authorized accounts, loading defaults:', e);
    }
    // Save defaults
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AUTHORIZED_ACCOUNTS));
    } catch {}
    return DEFAULT_AUTHORIZED_ACCOUNTS;
  },

  /**
   * Saves updated accounts to localStorage
   */
  saveAccounts(accounts: AuthorizedAdminAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('[AdminAuth] Error saving authorized accounts:', e);
    }
  },

  /**
   * Finds an account by email
   */
  getAccountByEmail(email: string): AuthorizedAdminAccount | undefined {
    const clean = email.trim().toLowerCase();
    const accounts = this.getAccounts();
    return accounts.find(a => a.email.toLowerCase() === clean);
  },

  /**
   * Checks if an email is in the authorized administrators list
   */
  isAuthorizedEmail(email: string): boolean {
    return !!this.getAccountByEmail(email);
  },

  /**
   * Authenticates an administrator:
   * 1. Validates strict email format (username@cmritonline.ac.in)
   * 2. Checks if email is one of the 5 authorized accounts
   * 3. Checks if password matches that specific account's current password
   */
  verifyCredentials(
    email: string,
    password: string
  ): { success: boolean; account?: AuthorizedAdminAccount; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (!this.isValidCmritEmail(cleanEmail)) {
      return {
        success: false,
        error: 'Access restricted: Email must strictly be in the institutional format username@cmritonline.ac.in.'
      };
    }

    const account = this.getAccountByEmail(cleanEmail);
    if (!account) {
      return {
        success: false,
        error: 'Access denied: This email is not registered as one of the 5 authorized administrators.'
      };
    }

    if (account.password !== cleanPass) {
      return {
        success: false,
        error: 'Invalid password. Please check your credentials and try again.'
      };
    }

    return { success: true, account };
  },

  /**
   * Modifies an administrator's password.
   * Enforces institutional security rules: min 8 chars, uppercase, lowercase, number, special char.
   * Can optionally verify the current password before changing.
   */
  changePassword(
    email: string,
    newPassword: string,
    currentPassword?: string
  ): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.email.toLowerCase() === cleanEmail);

    if (index === -1) {
      return { success: false, error: 'Administrator account not found.' };
    }

    const cleanPass = (newPassword || '').trim();
    const validation = validatePasswordStrict(cleanPass);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    if (currentPassword !== undefined && currentPassword !== accounts[index].password) {
      return { success: false, error: 'Current password does not match.' };
    }

    accounts[index].password = cleanPass;
    accounts[index].password_updated_at = new Date().toISOString();
    this.saveAccounts(accounts);

    return { success: true };
  },

  /**
   * Evaluates password security against institutional standards
   */
  evaluatePassword(password: string): PasswordValidationResult {
    return evaluatePasswordSecurity(password);
  },

  /**
   * Updates an administrator's profile fields
   */
  updateProfile(
    email: string,
    updates: Partial<Omit<AuthorizedAdminAccount, 'id' | 'email' | 'password'>>
  ): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.email.toLowerCase() === cleanEmail);

    if (index === -1) {
      return { success: false, error: 'Administrator account not found.' };
    }

    accounts[index] = {
      ...accounts[index],
      ...updates
    };
    this.saveAccounts(accounts);

    return { success: true };
  },

  /**
   * Updates an authorized email address (must remain username@cmritonline.ac.in)
   */
  updateEmail(oldEmail: string, newEmail: string): { success: boolean; error?: string } {
    const cleanOld = oldEmail.trim().toLowerCase();
    const cleanNew = newEmail.trim().toLowerCase();

    if (!this.isValidCmritEmail(cleanNew)) {
      return {
        success: false,
        error: 'New email must strictly match username@cmritonline.ac.in.'
      };
    }

    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.email.toLowerCase() === cleanOld);
    if (index === -1) {
      return { success: false, error: 'Original administrator account not found.' };
    }

    // Check collision
    const existing = accounts.find((a, i) => i !== index && a.email.toLowerCase() === cleanNew);
    if (existing) {
      return { success: false, error: 'This email is already in use by another administrator.' };
    }

    accounts[index].email = cleanNew;
    this.saveAccounts(accounts);

    return { success: true };
  }
};
