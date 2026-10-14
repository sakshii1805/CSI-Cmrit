import React, { useState } from 'react';
import { X, Key, Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../common/Toast';
import { adminAuthService } from '../../../services/adminAuthService';
import { adminService } from '../../../services/adminService';
import { validatePasswordStrict, evaluatePasswordSecurity } from '../../../lib/passwordSecurity';
import { PasswordStrengthIndicator } from '../../common/PasswordStrengthIndicator';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetEmail = user?.email || profile?.email || 'csi@cmritonline.ac.in';

  const pwdSecurity = evaluatePasswordSecurity(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanNewPass = newPassword.trim();
    const cleanConfirmPass = confirmPassword.trim();

    if (!cleanNewPass) {
      setErrorMessage('Please enter a new password.');
      showToast('Please enter a new password.', 'error');
      return;
    }

    const validation = validatePasswordStrict(cleanNewPass);
    if (!validation.isValid) {
      const msg = validation.error || 'Password does not meet security requirements.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    if (cleanNewPass !== cleanConfirmPass) {
      const msg = 'New password and confirm password do not match.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      setLoading(true);

      // 1. Direct update in adminAuthService persistent registry
      const authRes = adminAuthService.changePassword(targetEmail, cleanNewPass);
      if (!authRes.success) {
        setErrorMessage(authRes.error || 'Failed to update password.');
        showToast(authRes.error || 'Failed to update password.', 'error');
        return;
      }

      // 2. Also forward through adminService to keep any supabase integration in sync
      try {
        await adminService.changePassword(cleanNewPass, targetEmail);
      } catch (err) {
        console.warn('Backend sync noted:', err);
      }

      showToast('Password changed successfully! Please use this new password on your next sign-in.', 'success');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Error changing password. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    onClose();
  };

  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                Change Password
              </h2>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-[220px]">
                {targetEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <span className="shrink-0 font-bold text-rose-400 mt-0.5">&bull;</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>New Password *</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter new password (min. 8 characters)"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Real-time Password Security Meter & Criteria Checklist */}
            <PasswordStrengthIndicator
              password={newPassword}
              confirmPassword={confirmPassword}
              isDarkMode={true}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confirm Password *</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Re-enter new password to confirm"
                className={`w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  confirmPassword && newPassword && newPassword !== confirmPassword
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                    : passwordsMatch
                    ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/30'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Info Pill */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-400 leading-relaxed">
            Changing this will update your access password for this institutional account. You will use this new password next time you sign in.
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || !passwordsMatch || !pwdSecurity.isValid}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md shadow-blue-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
