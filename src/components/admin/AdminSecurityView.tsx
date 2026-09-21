import React, { useState } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Check,
  Lock,
  Radio,
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/Button';

interface AdminSecurityViewProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  adminEmail?: string;
  isDarkMode?: boolean;
}

export const AdminSecurityView: React.FC<AdminSecurityViewProps> = ({
  showToast,
  adminEmail = 'admin@cmritsi.in',
  isDarkMode = true
}) => {
  // Modals state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Active Sessions Mock Data State
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Google Chrome on Windows 11',
      location: 'Bengaluru, Karnataka, India',
      ip: '103.24.120.45',
      current: true,
      lastActive: 'Active Now'
    },
    {
      id: 'sess-2',
      device: 'Mobile Safari on iPhone 15 Pro',
      location: 'Bengaluru, Karnataka, India',
      ip: '103.24.120.89',
      current: false,
      lastActive: '2 hours ago'
    }
  ]);

  const [copiedId, setCopiedId] = useState(false);
  const accountId = 'usr_cmrit_csi_admin_921';

  const handleCopyAccountId = () => {
    navigator.clipboard.writeText(accountId);
    setCopiedId(true);
    showToast('Account ID copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully! Next login will require the new credentials.', 'success');
    }, 800);
  };

  const handleTerminateOtherSessions = () => {
    setSessions(sessions.filter(s => s.current));
    showToast('All other active sessions have been terminated.', 'info');
  };

  const cardBg = isDarkMode ? 'bg-[#0b1329] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs';
  const innerCardBg = isDarkMode ? 'bg-slate-900/60 border-slate-800/80 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';
  const headingColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtextColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600 font-bold';
  const borderDivider = isDarkMode ? 'border-slate-800' : 'border-slate-200';
  const modalBg = isDarkMode ? 'bg-[#0b1329] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
  const inputBg = isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600';

  return (
    <div className={`max-w-4xl mx-auto space-y-6 animate-fadeIn ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Top Header Card */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Security &amp; Credentials</span>
          </div>
          <h2 className={`text-2xl font-bold ${headingColor} tracking-tight`}>Security &amp; Authentication</h2>
          <p className={`text-xs sm:text-sm ${subtextColor} mt-1`}>
            Manage your account password, two-factor authentication, active devices, and audit log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Account Protected</span>
          </div>
        </div>
      </div>

      {/* Grid of Dedicated Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Account Identity & Security Status */}
        <div className={`${cardBg} rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-colors`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>Account ID</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                Verified
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl border font-mono text-xs ${innerCardBg}`}>
              <span>{accountId}</span>
              <button
                type="button"
                onClick={handleCopyAccountId}
                className={`p-1 rounded-md transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Copy Account ID"
              >
                {copiedId ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className={`text-xs ${subtextColor} mt-2`}>
              Primary Administrator: <strong className={headingColor}>{adminEmail}</strong>
            </p>
          </div>
          <div className={`text-[11px] ${subtextColor} pt-3 border-t ${borderDivider}`}>
            Last secure authentication check: Today from Bengaluru, India
          </div>
        </div>

        {/* 2. Password Card */}
        <div className={`${cardBg} rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-colors`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Key className="w-3.5 h-3.5 text-blue-500" />
                <span>Password</span>
              </span>
              <span className={`text-[10px] font-medium ${subtextColor}`}>Last changed: 14 days ago</span>
            </div>
            <h3 className={`text-sm font-semibold ${headingColor}`}>Administrator Passphrase</h3>
            <p className={`text-xs ${subtextColor} mt-1 leading-relaxed`}>
              Use a secure 12+ character password combining upper and lowercase letters, numbers, and symbols.
            </p>
          </div>

          <div className={`pt-3 border-t ${borderDivider}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPasswordModalOpen(true)}
              className={`w-full text-xs font-semibold ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* 3. Two-Factor Authentication (2FA) */}
        <div className={`${cardBg} rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-colors`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Two-Factor Authentication</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Enabled
              </span>
            </div>
            <h3 className={`text-sm font-semibold ${headingColor}`}>Authenticator App (TOTP)</h3>
            <p className={`text-xs ${subtextColor} mt-1 leading-relaxed`}>
              Requires a 6-digit verification code from Google Authenticator or Microsoft Authenticator during sign in.
            </p>
          </div>

          <div className={`pt-3 border-t ${borderDivider}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTwoFactorModalOpen(true)}
              className={`w-full text-xs font-semibold ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Manage 2FA
            </Button>
          </div>
        </div>

        {/* 4. Active Sessions */}
        <div className={`${cardBg} rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-colors`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Laptop className="w-3.5 h-3.5 text-indigo-500" />
                <span>Active Sessions</span>
              </span>
              <span className="text-xs text-blue-500 font-bold">{sessions.length} Active Devices</span>
            </div>
            <h3 className={`text-sm font-semibold ${headingColor}`}>Device Management</h3>
            <p className={`text-xs ${subtextColor} mt-1 leading-relaxed`}>
              Currently logged in on Chrome (Windows desktop) and Safari (iOS mobile).
            </p>
          </div>

          <div className={`pt-3 border-t ${borderDivider}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSessionsModalOpen(true)}
              className={`w-full text-xs font-semibold ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Manage Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Login Activity Card (Full Width) */}
      <div className={`${cardBg} rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${subtextColor}`} />
            <h3 className={`text-sm font-semibold ${headingColor}`}>Security &amp; Login Audit Trail</h3>
          </div>
          <p className={`text-xs ${subtextColor}`}>
            Review detailed access records, IP addresses, and sign-in timestamps for your administrator account.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setActivityModalOpen(true)}
          className={`text-xs font-semibold shrink-0 ${
            isDarkMode
              ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
              : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          View Activity Log
        </Button>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CHANGE PASSWORD */}
      {/* ========================================================= */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 border shadow-2xl animate-fadeIn`}>
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider} mb-4`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className={`text-base font-bold ${headingColor}`}>Change Password</h3>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Current Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>New Password (Min 8 characters) *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong new password"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${labelColor}`}>Confirm New Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`flex items-center gap-1 transition-colors ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
              </div>

              <div className={`pt-4 border-t ${borderDivider} flex items-center justify-end gap-2.5`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPasswordModalOpen(false)}
                  className={`text-xs ${
                    isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isChangingPassword}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  {isChangingPassword ? 'Verifying...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TWO-FACTOR AUTHENTICATION (2FA) */}
      {/* ========================================================= */}
      {twoFactorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 border shadow-2xl animate-fadeIn space-y-4`}>
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider}`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className={`text-base font-bold ${headingColor}`}>Two-Factor Authentication</h3>
              </div>
              <button
                onClick={() => setTwoFactorModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-4 rounded-xl border flex items-center gap-3 ${innerCardBg}`}>
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className={`text-xs font-bold ${headingColor}`}>TOTP Authenticator is Active</h4>
                <p className={`text-[11px] ${subtextColor}`}>Configured with your authenticator device.</p>
              </div>
            </div>

            <div className={`space-y-2 text-xs ${subtextColor}`}>
              <p className={`font-semibold ${headingColor}`}>Emergency Backup Codes:</p>
              <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl font-mono text-[11px] border ${
                isDarkMode ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <span>• 8492-1049</span>
                <span>• 3918-9920</span>
                <span>• 7712-4019</span>
                <span>• 5590-1284</span>
              </div>
              <p className="text-[10px] text-slate-400">Keep these recovery codes in a secure password vault.</p>
            </div>

            <div className={`pt-4 border-t ${borderDivider} flex items-center justify-end gap-2`}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  showToast('New backup recovery codes generated.', 'success');
                }}
                className={`text-xs ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Regenerate Codes
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setTwoFactorModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ACTIVE SESSIONS */}
      {/* ========================================================= */}
      {sessionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-lg w-full p-6 border shadow-2xl animate-fadeIn space-y-4`}>
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider}`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Laptop className="w-4 h-4" />
                </div>
                <h3 className={`text-base font-bold ${headingColor}`}>Active Device Sessions</h3>
              </div>
              <button
                onClick={() => setSessionsModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div key={sess.id} className={`p-3.5 rounded-xl border flex items-center justify-between ${innerCardBg}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${headingColor}`}>{sess.device}</span>
                      {sess.current && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${subtextColor}`}>{sess.location} • IP: {sess.ip}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{sess.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`pt-4 border-t ${borderDivider} flex items-center justify-between`}>
              {sessions.length > 1 ? (
                <button
                  type="button"
                  onClick={handleTerminateOtherSessions}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-400"
                >
                  Terminate Other Sessions
                </button>
              ) : (
                <span className={`text-xs ${subtextColor}`}>Only your current device is active.</span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSessionsModalOpen(false)}
                className={`text-xs ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: LOGIN ACTIVITY LOG */}
      {/* ========================================================= */}
      {activityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-lg w-full p-6 border shadow-2xl animate-fadeIn space-y-4`}>
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider}`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className={`text-base font-bold ${headingColor}`}>Login &amp; Security Activity</h3>
              </div>
              <button
                onClick={() => setActivityModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {[
                { event: 'Successful Login', device: 'Chrome / Windows', ip: '103.24.120.45', time: 'Today, 22:40' },
                { event: 'Session Refresh', device: 'Chrome / Windows', ip: '103.24.120.45', time: 'Today, 21:15' },
                { event: 'Successful Login', device: 'Safari / iOS', ip: '103.24.120.89', time: 'Today, 20:02' },
                { event: 'Password Verified', device: 'Chrome / Windows', ip: '103.24.120.45', time: 'Yesterday, 14:30' },
                { event: '2FA Code Validated', device: 'Chrome / Windows', ip: '103.24.120.45', time: '2 days ago' }
              ].map((log, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${innerCardBg}`}>
                  <div>
                    <div className={`font-semibold flex items-center gap-1.5 ${headingColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {log.event}
                    </div>
                    <div className={`text-[11px] ${subtextColor}`}>{log.device} • {log.ip}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{log.time}</div>
                </div>
              ))}
            </div>

            <div className={`pt-4 border-t ${borderDivider} flex items-center justify-end`}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActivityModalOpen(false)}
                className={`text-xs ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Close Activity Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
