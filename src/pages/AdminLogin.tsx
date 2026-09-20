import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication is not yet implemented — redirects to dashboard UI preview only.
    showToast('Accessing admin dashboard (frontend preview only). Backend authentication will be connected later.', 'info');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#081325] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top back link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-400 hover:text-white transition-colors active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO SITE</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Institutional Chapter Gate Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-500/20 bg-blue-950/40 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Computer Society of India &bull; CMRIT</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Operations Console
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Restricted Officer Gateway &bull; Session Auth Required
          </p>
        </div>

        {/* Unified Security Console Terminal */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-elevated overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-semibold">GATEWAY_ACTIVE</span>
            </div>
            <span className="text-slate-500 text-[11px]">PORT: 5174</span>
          </div>

          {/* Inline Preview Notice */}
          <div className="px-5 py-3 bg-blue-950/20 border-b border-slate-800/80 flex items-start gap-2.5 text-xs font-mono text-slate-400 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-semibold">PREVIEW MODE:</span> Backend auth endpoint in development sprint. Submit opens live dashboard preview.
            </div>
          </div>

          <div className="p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block font-mono text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Officer Identifier / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cmritonline.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-600 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block font-mono text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-600 font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<Shield className="w-4 h-4" />}
              >
                Authenticate &amp; Enter
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center font-mono text-xs text-slate-500">
            Computer Society of India &bull; CMRIT Chapter
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

