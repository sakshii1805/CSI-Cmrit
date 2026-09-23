import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();
  const { signIn, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justFilled, setJustFilled] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Smooth entrance and exit animation state handling
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // If already authenticated as admin, close modal
  useEffect(() => {
    if (isOpen && isAuthenticated && isAdmin) {
      onClose();
    }
  }, [isOpen, isAuthenticated, isAdmin, onClose]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    const isValidAdmin =
      (cleanEmail === 'admin@cmritsi.in' || cleanEmail === 'admin@cmritonline.ac.in') &&
      cleanPass === 'admin123';

    if (!isValidAdmin) {
      const msg = 'Invalid credentials. Please verify your email and password.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await signIn(cleanEmail, cleanPass);

      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed.');
        showToast(res.error || 'Authentication failed.', 'error');
        return;
      }

      showToast('Signed in successfully. Admin mode active.', 'success');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAuthorizedCredentials = () => {
    setEmail('admin@cmritonline.ac.in');
    setPassword('admin123');
    setErrorMessage(null);
    setJustFilled(true);
    showToast('Credentials filled.', 'info');
    setTimeout(() => setJustFilled(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Dynamic Backdrop Blur with smooth fade */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'animate-backdrop-fade'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dynamic Dialog Box with Spring Slide-Down Effect */}
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 ${
          isClosing ? 'animate-modal-exit' : 'animate-modal-slide-down'
        }`}
      >
        {/* Dialog Header with Close Button */}
        <div className="pt-6 px-6 sm:px-8 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
              <img
                src="/images/logos/cmrit_csi_logo.jpeg"
                alt="CSI CMRIT"
                className="h-7 w-auto object-contain rounded"
              />
              <div className="h-4 w-px bg-slate-200" />
              <img
                src="/images/logos/cmr_new_logo.png"
                alt="CMRIT College"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Admin Sign In
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">CSI CMRIT Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 hover:rotate-90 cursor-pointer"
            aria-label="Close dialog box"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="px-6 sm:px-8 pb-7 pt-2 space-y-4">
          {/* Subtle Demo Credentials Helper */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="text-slate-600 min-w-0 pr-2">
              <span className="font-semibold text-slate-800 block text-[11px]">
                Authorized Demo Account
              </span>
              <span className="font-mono text-[11px] text-slate-500 truncate block">
                admin@cmritonline.ac.in &bull; admin123
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillAuthorizedCredentials}
              className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {justFilled ? 'Filled' : 'Auto-fill'}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold">Authentication Error</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="modal-admin-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="modal-admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="admin@cmritonline.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="modal-admin-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="modal-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Sign in to Admin Console</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Secure Institutional Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Authorized access only</span>
            <span>Secure session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
