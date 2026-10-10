import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { adminAuthService } from '../services/adminAuthService';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { signIn, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in and confirmed admin, redirect directly to home in admin mode
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      navigate('/', { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    if (!adminAuthService.isValidEmailFormat(cleanEmail)) {
      const msg = 'Invalid institutional email format. Please use username@cmritonline.ac.in';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    if (!adminAuthService.isAuthorizedEmail(cleanEmail)) {
      const msg = 'Access denied. This institutional account is not authorized for administrator access.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await signIn(cleanEmail, cleanPass);

      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
        showToast(res.error || 'Authentication failed.', 'error');
        return;
      }

      showToast('Signed in successfully. Admin mode active.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top back navigation */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Institutional Branding */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 bg-white p-2.5 px-4 rounded-xl border border-slate-200/80 shadow-xs">
            <img
              src="/images/logos/cmrit_csi_logo.jpeg"
              alt="CSI CMRIT"
              className="h-9 w-auto object-contain rounded"
            />
            <div className="h-5 w-px bg-slate-200" />
            <img
              src="/images/logos/cmr_new_logo.png"
              alt="CMR Institute of Technology"
              className="h-8 w-auto object-contain"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Computer Society of India &bull; CMRIT Student Chapter
          </p>
        </div>

        {/* Clean Corporate Login Dialog Box with Dynamic Slide-Down Effect */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-6 sm:p-8 animate-modal-slide-down">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
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
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Institutional Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="username@cmritonline.ac.in"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="admin-password"
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

          {/* Secure Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>CMRIT Student Chapter</span>
            <span>Secure Access</span>
          </div>
        </div>

        {/* Bottom Helper */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Authorized personnel only &bull; All sessions are logged
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;