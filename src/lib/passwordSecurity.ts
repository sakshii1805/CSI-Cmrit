/**
 * Password Security & Validation Utilities
 * Enforces robust institutional credential policies:
 * - Minimum 8 characters
 * - At least one uppercase (capital) letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one numeric digit (0-9)
 * - At least one special character (!@#$%^&* etc.)
 */

export interface PasswordRequirement {
  id: 'minLength' | 'hasUppercase' | 'hasLowercase' | 'hasNumber' | 'hasSpecial';
  label: string;
  met: boolean;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 5
  strength: PasswordStrength;
  strengthLabel: string;
  strengthColor: string;
  requirements: PasswordRequirement[];
  errors: string[];
}

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;

export function evaluatePasswordSecurity(password: string): PasswordValidationResult {
  const pwd = password || '';

  const minLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = SPECIAL_CHAR_REGEX.test(pwd);

  const requirements: PasswordRequirement[] = [
    {
      id: 'minLength',
      label: 'Minimum 8 characters',
      met: minLength
    },
    {
      id: 'hasUppercase',
      label: 'At least one capital letter (A-Z)',
      met: hasUppercase
    },
    {
      id: 'hasLowercase',
      label: 'At least one lowercase letter (a-z)',
      met: hasLowercase
    },
    {
      id: 'hasNumber',
      label: 'At least one numeric digit (0-9)',
      met: hasNumber
    },
    {
      id: 'hasSpecial',
      label: 'At least one special character (!@#$%^&*)',
      met: hasSpecial
    }
  ];

  const metCount = requirements.filter(r => r.met).length;
  const isValid = requirements.every(r => r.met);

  let strength: PasswordStrength = 'weak';
  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-rose-500 text-rose-400';

  if (metCount === 0 || pwd.length === 0) {
    strength = 'weak';
    strengthLabel = 'Empty';
    strengthColor = 'bg-slate-700 text-slate-400';
  } else if (metCount <= 2) {
    strength = 'weak';
    strengthLabel = 'Weak';
    strengthColor = 'bg-rose-500 text-rose-400';
  } else if (metCount === 3) {
    strength = 'fair';
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500 text-amber-400';
  } else if (metCount === 4) {
    strength = 'good';
    strengthLabel = 'Good';
    strengthColor = 'bg-sky-500 text-sky-400';
  } else if (metCount === 5) {
    strength = 'strong';
    strengthLabel = pwd.length >= 12 ? 'Very Strong' : 'Strong';
    strengthColor = 'bg-emerald-500 text-emerald-400';
  }

  const errors: string[] = [];
  if (!minLength) errors.push('Password must be at least 8 characters long');
  if (!hasUppercase) errors.push('Password must contain at least one capital letter (A-Z)');
  if (!hasLowercase) errors.push('Password must contain at least one lowercase letter (a-z)');
  if (!hasNumber) errors.push('Password must contain at least one numeric digit (0-9)');
  if (!hasSpecial) errors.push('Password must contain at least one special character (!@#$%^&* etc.)');

  return {
    isValid,
    score: metCount,
    strength,
    strengthLabel,
    strengthColor,
    requirements,
    errors
  };
}

export function validatePasswordStrict(password: string): { isValid: boolean; error?: string } {
  const result = evaluatePasswordSecurity(password);
  if (!result.isValid) {
    return {
      isValid: false,
      error: `Password requirement: ${result.errors[0]}. (Requires min 8 chars, uppercase, lowercase, numeric digit, and special character).`
    };
  }
  return { isValid: true };
}
