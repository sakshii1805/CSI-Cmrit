import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, Loader2, AlertCircle, Sparkles, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { LogoMark } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';

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

  // If already logged in and confirmed admin, redirect directly
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
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

    const isValidAdmin = (cleanEmail === 'admin@cmritsi.in' || cleanEmail === 'admin@cmritonline.ac.in') && cleanPass === 'admin123';
    if (!isValidAdmin) {
      const msg = 'Invalid credentials. Please use admin@cmritsi.in or admin@cmritonline.ac.in with password admin123.';
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

      showToast('Welcome back, Student Admin!', 'success');
      navigate('/admin/dashboard');
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
    showToast('Authorized credentials loaded into form.', 'info');
    setTimeout(() => setJustFilled(false), 2000);
  };

  const isEmailMatching = email.trim().toLowerCase() === 'admin@cmritonline.ac.in';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Dynamic ambient background aura */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Chapter Logo with interactive hover */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-3 hover:scale-105 transition-transform">
            <LogoMark size={54} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">CSI CMRIT Portal</h1>
          <p className="text-xs text-slate-400 mt-0.5">Computer Society of India &bull; CMRIT Chapter</p>
        </div>

        {/* Unified Security Console Terminal */}
        <div
          className={`bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${shake ? 'animate-shake ring-2 ring-rose-500/50' : 'hover:border-slate-700/80'
            }`}
        >
          {/* Terminal Title Bar */}
          <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
              <span className="text-slate-200 font-semibold tracking-wide">CSI Chapter Student Admin Portal</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50 font-medium">
              CMRIT &bull; CSI
            </span>
          </div>

          {/* Interactive Credential Helper Banner */}
          <div className="px-5 py-3 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span>Authorized Admin Credentials:</span>
              </span>
              <button
                type="button"
                onClick={handleFillAuthorizedCredentials}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${justFilled
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 hover:text-white'
                  }`}
              >
                {justFilled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Auto-Fill</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-slate-400">ID:</span>
              <span className="text-blue-300 select-all font-semibold">admin@cmritonline.ac.in</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">PW:</span>
              <span className="text-amber-300 select-all font-semibold">admin123</span>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <p className="font-semibold text-rose-200">Access Restricted</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300">
                    Administrator Email
                  </label>
                  {isEmailMatching && (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Authorized ID
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
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
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border rounded-xl text-white placeholder-slate-600 transition-all focus:outline-none focus:ring-2 ${isEmailMatching
                        ? 'border-emerald-500/50 focus:ring-emerald-500/30'
                        : 'border-slate-800 focus:ring-blue-500 focus:border-transparent'
                      }`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 shadow-lg shadow-blue-600/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Sign In to Dashboard</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleFillAuthorizedCredentials}
                  className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60 flex items-center justify-center gap-2 transition-all hover:text-white"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fill Admin Credentials (admin@cmritonline.ac.in)</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Chapter: <strong>CSI CMRIT</strong></span>
              <span>Student Admin Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};