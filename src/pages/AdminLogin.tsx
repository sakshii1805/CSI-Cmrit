import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@cmritonline.ac.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Do not authenticate; frontend demo only
    showToast('Logged into demo admin portal! Backend auth will be connected later.', 'info');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background tech grid */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Chapter Logo Emblem */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-card border border-blue-500/40">
            CSI
          </div>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          CSI CMRIT
        </h2>
        <p className="text-center text-xs font-semibold text-blue-400 uppercase tracking-widest mt-1">
          Administrative Portal
        </p>

        {/* Informational Disclaimer Banner */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">Interactive Prototype:</span> Authentication will be connected later. You can click Login to explore the dashboard layout.
          </div>
        </div>

        {/* Card Box */}
        <div className="mt-6 bg-slate-900/80 backdrop-blur-md py-8 px-6 sm:px-8 border border-slate-800 rounded-2xl shadow-elevated">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Executive Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cmritonline.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                leftIcon={<Shield className="w-4 h-4" />}
              >
                Enter Demo Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Computer Society of India • CMRIT Student Chapter
          </div>
        </div>
      </div>
    </div>
  );
};
