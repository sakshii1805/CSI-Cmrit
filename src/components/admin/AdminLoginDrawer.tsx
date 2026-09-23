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

interface AdminLoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginDrawer: React.FC<AdminLoginDrawerProps> = ({
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

  // If already authenticated as admin, close drawer
  useEffect(() => {
    if (isOpen && isAuthenticated && isAdmin) {
      onClose();
    }
  }, [isOpen, isAuthenticated, isAdmin, onClose]);

  // Handle escape key
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
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel from Right */}
      <div
        className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <img
                src="/images/logos/cmrit_csi_logo.jpeg"
                alt="CSI CMRIT"
                className="h-6 w-auto object-contain rounded"
              />
              <div className="h-4 w-px bg-slate-200" />
              <img
                src="/images/logos/cmr_new_logo.png"
                alt="CMRIT College"
                className="h-5 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Admin Portal
              </h2>
              <p className="text-[11px] text-slate-500">CSI CMRIT Chapter</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close admin login drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="p-6 sm:p-7 flex-1 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Sign in to manage
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your chapter credentials to access admin controls.
            </p>
          </div>

          {/* Institutional Demo Credentials Pill */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
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
              className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
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
              <label htmlFor="drawer-admin-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="drawer-admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="admin@cmritonline.ac.in"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="drawer-admin-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="drawer-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
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
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
        </div>

        {/* Panel Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400">
          <span>CMRIT Student Chapter</span>
          <span>Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginDrawer;
