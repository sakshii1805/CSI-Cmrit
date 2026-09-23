import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { signIn, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [justFilled, setJustFilled] = useState(false);

  // If already logged in and confirmed admin, redirect directly to home in admin mode
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      navigate('/', { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      showToast('Please enter both email and password.', 'error');
      triggerShake();
      return;
    }

    const isValidAdmin =
      (cleanEmail === 'admin@cmritsi.in' || cleanEmail === 'admin@cmritonline.ac.in') &&
      cleanPass === 'admin123';

    if (!isValidAdmin) {
      const msg = 'Invalid credentials. Use admin@cmritonline.ac.in or admin@cmritsi.in with password admin123.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await signIn(cleanEmail, cleanPass);

      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed.');
        showToast(res.error || 'Authentication failed.', 'error');
        triggerShake();
        return;
      }

      showToast('Welcome back, Administrator! Admin Mode is now active.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleFillAuthorizedCredentials = () => {
    setEmail('admin@cmritonline.ac.in');
    setPassword('admin123');
    setErrorMessage(null);
    setJustFilled(true);
    showToast('Admin credentials filled.', 'info');
    setTimeout(() => setJustFilled(false), 2000);
  };

  const isEmailMatching = email.trim().toLowerCase() === 'admin@cmritonline.ac.in' || email.trim().toLowerCase() === 'admin@cmritsi.in';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Ambience & Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top back navigation pill */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header with Authentic Chapter & College Logos */}
        <div className="flex flex-col items-center justify-center mb-7 text-center">
          <div className="inline-flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl mb-4 hover:border-slate-700 transition-all">
            {/* CSI Logo */}
            <img
              src="/images/logos/cmrit_csi_logo.jpeg"
              alt="CSI CMRIT"
              className="w-9 h-9 rounded-lg object-contain bg-slate-950 p-0.5"
            />
            <div className="h-6 w-px bg-slate-800" />
            {/* CMRIT College Logo */}
            <img
              src="/images/logos/cmr_new_logo.png"
              alt="CMRIT College"
              className="w-8 h-8 object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>Administrator Console</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            CSI CMRIT Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Computer Society of India &bull; CMRIT Student Chapter
          </p>
        </div>

        {/* The Card */}
        <div
          className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl shadow-slate-950/80 overflow-hidden transition-all duration-300 ${
            shake ? 'animate-shake ring-2 ring-rose-500/50' : 'hover:border-slate-700/80'
          }`}
        >
          {/* Quick Demo Credentials Pill */}
          <div className="px-6 pt-6 pb-2">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-300 leading-none">
                    Authorized Credentials
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                    admin@cmritonline.ac.in &bull; admin123
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFillAuthorizedCredentials}
                className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  justFilled
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30'
                }`}
              >
                {justFilled ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Filled!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-Fill</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-7 pt-4">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <p className="font-semibold text-rose-200">Access Denied</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300">
                    Administrator Email
                  </label>
                  {isEmailMatching && (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Authorized
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="admin@cmritonline.ac.in"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                      isEmailMatching
                        ? 'border-emerald-500/50 focus:ring-emerald-500/20'
                        : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign in button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Enter Admin Mode</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Chapter: <strong>CSI CMRIT</strong></span>
              <span>Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;