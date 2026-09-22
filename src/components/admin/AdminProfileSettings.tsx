import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Laptop,
  Check,
  X,
  Copy,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sliders,
  Bell,
  Mail,
  User,
  Building,
  Phone,
  BookOpen,
  FileText,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Globe,
  Radio
} from 'lucide-react';
import { Button } from '../common/Button';
import { adminService } from '../../services/adminService';

interface AdminProfileSettingsProps {
  profileForm: {
    full_name: string;
    designation: string;
    department: string;
    phone: string;
    bio: string;
    avatar_url: string;
  };
  setProfileForm: React.Dispatch<React.SetStateAction<{
    full_name: string;
    designation: string;
    department: string;
    phone: string;
    bio: string;
    avatar_url: string;
  }>>;
  onSaveProfile: (e: React.FormEvent) => Promise<void>;
  updatingProfile: boolean;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  targetSection?: 'personal' | 'account' | 'security' | null;
}

export const AdminProfileSettings: React.FC<AdminProfileSettingsProps> = ({
  profileForm,
  setProfileForm,
  onSaveProfile,
  updatingProfile,
  showToast,
  targetSection
}) => {
  // Personal Information Edit Mode state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalDraft, setPersonalDraft] = useState({ ...profileForm });

  // Modals state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);

  // Password Modal form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  // Active Sessions state
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Chrome 128 on Windows 11',
      location: 'CMRIT Campus Network (Bengaluru, IN)',
      ip: '10.20.14.88',
      current: true,
      lastActive: 'Active Now'
    },
    {
      id: 'sess-2',
      device: 'Safari 17.4 on Apple iPhone 15',
      location: 'Bengaluru, Karnataka, IN',
      ip: '106.51.78.12',
      current: false,
      lastActive: '2 hours ago'
    }
  ]);

  // Account Settings preferences state
  const [accountSettings, setAccountSettings] = useState({
    systemCirculars: true,
    eventDigests: true,
    membershipDigests: true,
    browserPushAlerts: true,
    securityIncidentAlerts: true,
    language: 'English (India)',
    inactivityTimeout: '1 hour',
    timezone: 'Asia/Kolkata (IST, UTC+05:30)'
  });
  const [savingAccountSettings, setSavingAccountSettings] = useState(false);

  // Privacy preferences state
  const [privacySettings, setPrivacySettings] = useState({
    publicDirectory: true,
    publicContactEmail: true,
    restrictPhoneToCore: true,
    authorAttribution: true
  });
  const [savingPrivacySettings, setSavingPrivacySettings] = useState(false);

  // Recent Activity Log
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 'act-1',
      action: 'Profile Updated',
      detail: 'Contact phone & department information updated',
      time: 'Today, 18:40',
      icon: <User className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 'act-2',
      action: 'Security Session Verified',
      detail: 'Institutional SSO session token authenticated via TLS 1.3',
      time: 'Today, 14:15',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      id: 'act-3',
      action: 'Administrative Login',
      detail: 'Signed in from Chrome on Windows 11 (CMRIT Campus)',
      time: 'Today, 09:30',
      icon: <Laptop className="w-3.5 h-3.5 text-indigo-400" />
    },
    {
      id: 'act-4',
      action: 'Settings Modified',
      detail: 'Administrative email digest preferences configured',
      time: 'Yesterday, 16:20',
      icon: <Sliders className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      id: 'act-5',
      action: 'Password Verified',
      detail: 'Administrative credential re-authentication successful',
      time: 'Sep 18, 11:05',
      icon: <Key className="w-3.5 h-3.5 text-sky-400" />
    }
  ]);

  // Sync draft when profileForm updates
  useEffect(() => {
    setPersonalDraft({ ...profileForm });
  }, [profileForm]);

  // Handle auto-scrolling when targetSection prop changes from header dropdown
  useEffect(() => {
    if (targetSection) {
      const element = document.getElementById(`section-${targetSection}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.classList.add('ring-2', 'ring-blue-500/40', 'transition-all');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500/40');
        }, 2000);
      }
    }
  }, [targetSection]);

  // Personal Info Edit Handlers
  const handleStartEditPersonal = () => {
    setPersonalDraft({ ...profileForm });
    setIsEditingPersonal(true);
  };

  const handleCancelEditPersonal = () => {
    setPersonalDraft({ ...profileForm });
    setIsEditingPersonal(false);
  };

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalDraft.full_name.trim()) {
      showToast('Full Name cannot be empty.', 'error');
      return;
    }

    setProfileForm(personalDraft);
    await onSaveProfile(e);
    setIsEditingPersonal(false);

    // Append to recent activity
    setRecentActivities(prev => [
      {
        id: 'act-' + Date.now(),
        action: 'Profile Updated',
        detail: `Personal information updated for ${personalDraft.full_name}`,
        time: 'Just now',
        icon: <User className="w-3.5 h-3.5 text-blue-400" />
      },
      ...prev.slice(0, 7)
    ]);
  };

  // Password Change Handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Please enter a new password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      await adminService.changePassword(newPassword);
      showToast('Administrator password updated successfully!', 'success');
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setRecentActivities(prev => [
        {
          id: 'act-' + Date.now(),
          action: 'Password Changed',
          detail: 'Administrative portal password changed successfully',
          time: 'Just now',
          icon: <Key className="w-3.5 h-3.5 text-amber-400" />
        },
        ...prev.slice(0, 7)
      ]);
    } catch (err: any) {
      showToast(err?.message || 'Password update failed.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Copy helper
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, 'info');
  };

  // Save Account Settings handler
  const handleSaveAccountSettings = () => {
    setSavingAccountSettings(true);
    setTimeout(() => {
      setSavingAccountSettings(false);
      showToast('Account preferences saved successfully.', 'success');
      setRecentActivities(prev => [
        {
          id: 'act-' + Date.now(),
          action: 'Settings Modified',
          detail: 'Account and notification preferences saved',
          time: 'Just now',
          icon: <Sliders className="w-3.5 h-3.5 text-amber-400" />
        },
        ...prev.slice(0, 7)
      ]);
    }, 450);
  };

  // Save Privacy Settings handler
  const handleSavePrivacySettings = () => {
    setSavingPrivacySettings(true);
    setTimeout(() => {
      setSavingPrivacySettings(false);
      showToast('Privacy & visibility settings updated.', 'success');
      setRecentActivities(prev => [
        {
          id: 'act-' + Date.now(),
          action: 'Settings Modified',
          detail: 'Chapter directory visibility settings updated',
          time: 'Just now',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        },
        ...prev.slice(0, 7)
      ]);
    }, 450);
  };

  // Terminate other sessions
  const handleTerminateOtherSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    showToast('All other active sessions have been terminated.', 'success');
    setSessionsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Page Heading ── */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] tracking-widest font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
              Official Administration
            </span>
            <span className="text-slate-500 text-xs">&bull;</span>
            <span className="text-xs text-slate-400 font-mono">CMRIT Chapter Code: CSI-CMRIT-4601</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Administrator Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-200">Authorized Session</span>
            <span className="text-slate-500">&bull;</span>
            <span className="font-mono text-slate-400">admin@cmritonline.ac.in</span>
          </div>
        </div>
      </div>

      {/* ── Two-Column Layout (Wider Main, Narrower Secondary) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* WIDER COLUMN (Left: Personal Info, Account Settings, Privacy) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-8">
          {/* ────────────────────────────────────────────────────── */}
          {/* 1. PERSONAL INFORMATION CARD */}
          {/* ────────────────────────────────────────────────────── */}
          <div
            id="section-personal"
            className="bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-400">
                    Administrator details and institutional directory assignment.
                  </p>
                </div>
              </div>

              {!isEditingPersonal ? (
                <button
                  type="button"
                  onClick={handleStartEditPersonal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEditPersonal}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="button"
                    onClick={handleSavePersonal}
                    variant="primary"
                    size="sm"
                    disabled={updatingProfile}
                    leftIcon={updatingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  >
                    {updatingProfile ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6">
              {!isEditingPersonal ? (
                /* READ-ONLY VIEW */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Full Name
                      </span>
                      <span className="text-sm font-bold text-white">
                        {profileForm.full_name || 'Student Coordinator'}
                      </span>
                    </div>

                    {/* Email Address */}
                    <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                          Email Address
                        </span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                          Institutional
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-slate-200">
                          admin@cmritonline.ac.in
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText('admin@cmritonline.ac.in', 'Admin Email')}
                          className="text-slate-400 hover:text-slate-200 p-1 rounded"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Phone Number
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-200">
                        {profileForm.phone || '+91 80 2852 4466'}
                      </span>
                    </div>

                    {/* Department */}
                    <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Department
                      </span>
                      <span className="text-xs font-medium text-slate-200">
                        {profileForm.department || 'Department of Computer Science & Engineering'}
                      </span>
                    </div>

                    {/* Role */}
                    <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Role
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {profileForm.designation || 'Student Coordinator'}
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold">
                          Active Administrator
                        </span>
                      </div>
                    </div>

                    {/* Chapter / Institution */}
                    <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Chapter / Institution
                      </span>
                      <span className="text-xs font-medium text-slate-200">
                        CSI CMRIT Student Chapter &bull; CMRIT Bengaluru
                      </span>
                    </div>
                  </div>

                  {/* Biography / Bio */}
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Administrator Summary / Scope
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {profileForm.bio ||
                        'Student coordinator for CSI CMRIT chapter. Responsible for managing chapter events, workshops, hackathons, membership circulars, and student engagement initiatives.'}
                    </p>
                  </div>
                </div>
              ) : (
                /* EDITING VIEW */
                <form onSubmit={handleSavePersonal} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={personalDraft.full_name}
                        onChange={e => setPersonalDraft({ ...personalDraft, full_name: e.target.value })}
                        placeholder="e.g. Student Coordinator"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Institutional Email (Read-Only) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-slate-500 font-normal">(Institutional &bull; Locked)</span>
                      </label>
                      <input
                        type="email"
                        disabled
                        value="admin@cmritonline.ac.in"
                        className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={personalDraft.phone}
                        onChange={e => setPersonalDraft({ ...personalDraft, phone: e.target.value })}
                        placeholder="+91 80 2852 4466"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Department Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Department
                      </label>
                      <input
                        type="text"
                        value={personalDraft.department}
                        onChange={e => setPersonalDraft({ ...personalDraft, department: e.target.value })}
                        placeholder="Department of Computer Science & Engineering"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Role Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={personalDraft.designation}
                        onChange={e => setPersonalDraft({ ...personalDraft, designation: e.target.value })}
                        placeholder="Student Coordinator"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Chapter / Institution (Fixed institutional context) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Chapter / Institution <span className="text-slate-500 font-normal">(Verified Chapter)</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Computer Society of India - CMRIT Student Chapter"
                        className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-lg text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Summary / Scope Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Administrator Summary / Scope
                    </label>
                    <textarea
                      rows={3}
                      value={personalDraft.bio}
                      onChange={e => setPersonalDraft({ ...personalDraft, bio: e.target.value })}
                      placeholder="Brief overview of administrative responsibilities..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleCancelEditPersonal}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={updatingProfile}
                      leftIcon={updatingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    >
                      {updatingProfile ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ────────────────────────────────────────────────────── */}
          {/* 2. ACCOUNT SETTINGS CARD */}
          {/* ────────────────────────────────────────────────────── */}
          <div
            id="section-account"
            className="bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Account Settings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Preferences for notification digests, session timeout, and localized controls.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSaveAccountSettings}
                variant="outline"
                size="sm"
                disabled={savingAccountSettings}
                leftIcon={savingAccountSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-blue-400" />}
              >
                {savingAccountSettings ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Notification & Email Toggles */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Email &amp; Digest Notifications</span>
                </h3>

                <div className="space-y-3">
                  {/* Toggle 1: System Circulars */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-white block">
                        Chapter Circulars &amp; Official Notices
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Receive instant email confirmations when notices are dispatched to members.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={accountSettings.systemCirculars}
                        onChange={e => setAccountSettings({ ...accountSettings, systemCirculars: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Toggle 2: Event Registration Alerts */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-white block">
                        Event Registrations Digest
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Daily consolidated summary of attendee registrations and workshop seats claimed.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={accountSettings.eventDigests}
                        onChange={e => setAccountSettings({ ...accountSettings, eventDigests: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Toggle 3: Membership Applications */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-white block">
                        Student Membership Applications
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Alert administrator whenever a new CMRIT student submits a chapter membership form.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={accountSettings.membershipDigests}
                        onChange={e => setAccountSettings({ ...accountSettings, membershipDigests: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Toggle 4: Browser Push Alerts */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <div className="pr-4">
                      <span className="text-xs font-semibold text-white block">
                        Browser Push Notifications
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Real-time desktop notifications for pending comments and inquiries needing review.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={accountSettings.browserPushAlerts}
                        onChange={e => setAccountSettings({ ...accountSettings, browserPushAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Regional, Timeout & Portal Dropdowns */}
              <div className="pt-2 border-t border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Portal Regional &amp; Session Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Language */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Portal Language
                    </label>
                    <select
                      value={accountSettings.language}
                      onChange={e => setAccountSettings({ ...accountSettings, language: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    >
                      <option value="English (India)">English (India) - Official</option>
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                    </select>
                  </div>

                  {/* Session Timeout */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Inactivity Session Timeout
                    </label>
                    <select
                      value={accountSettings.inactivityTimeout}
                      onChange={e => setAccountSettings({ ...accountSettings, inactivityTimeout: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    >
                      <option value="30 minutes">30 Minutes (High Security)</option>
                      <option value="1 hour">1 Hour (Recommended)</option>
                      <option value="4 hours">4 Hours</option>
                      <option value="8 hours">8 Hours (Full Shift)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────── */}
          {/* 4. PRIVACY CARD */}
          {/* ────────────────────────────────────────────────────── */}
          <div
            id="section-privacy"
            className="bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Privacy &amp; Directory Disclosure
                  </h2>
                  <p className="text-xs text-slate-400">
                    Control public directory listings and team visibility preferences.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSavePrivacySettings}
                variant="outline"
                size="sm"
                disabled={savingPrivacySettings}
                leftIcon={savingPrivacySettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-blue-400" />}
              >
                {savingPrivacySettings ? 'Saving...' : 'Save Privacy'}
              </Button>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-3">
              {/* Privacy Toggle 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <div className="pr-4">
                  <span className="text-xs font-semibold text-white block">
                    Public Chapter Directory Roster
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Display administrator name and chapter role on the official CSI CMRIT public About page.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings.publicDirectory}
                    onChange={e => setPrivacySettings({ ...privacySettings, publicDirectory: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Privacy Toggle 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <div className="pr-4">
                  <span className="text-xs font-semibold text-white block">
                    Public Contact Inquiries Address
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Show institutional email (<span className="font-mono text-slate-300">admin@cmritonline.ac.in</span>) on chapter contact page.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings.publicContactEmail}
                    onChange={e => setPrivacySettings({ ...privacySettings, publicContactEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Privacy Toggle 3 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <div className="pr-4">
                  <span className="text-xs font-semibold text-white block">
                    Restrict Phone Number to Core Committee
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Keep administrator mobile number strictly hidden from public visitors and general attendees.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings.restrictPhoneToCore}
                    onChange={e => setPrivacySettings({ ...privacySettings, restrictPhoneToCore: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Privacy Toggle 4 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <div className="pr-4">
                  <span className="text-xs font-semibold text-white block">
                    Author Attribution on Circulars
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Attribute chapter announcements and notifications to administrator signature.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings.authorAttribution}
                    onChange={e => setPrivacySettings({ ...privacySettings, authorAttribution: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NARROWER COLUMN (Right: Security, Recent Activity, Badges) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-8">
          {/* ────────────────────────────────────────────────────── */}
          {/* 3. SECURITY CARD */}
          {/* ────────────────────────────────────────────────────── */}
          <div
            id="section-security"
            className="bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Security
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Access control and protection
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Protected
              </span>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3.5">
              {/* Security Status Box */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/90 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium text-[11px]">Security Status</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">High (256-bit TLS)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium text-[11px]">Account ID</span>
                  <span className="font-mono text-slate-200 text-[10px]">admin@cmritonline.ac.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium text-[11px]">Two-Factor (2FA)</span>
                  <span className="text-blue-400 font-semibold text-[11px]">Enabled (TOTP)</span>
                </div>
              </div>

              {/* Action 1: Change Password */}
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Password</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Last updated 14 days ago
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Action 2: Two-Factor Authentication */}
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Two-Factor Auth</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Google / Microsoft Authenticator
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  Configure
                </button>
              </div>

              {/* Action 3: Active Sessions */}
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Active Sessions</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {activeSessions.length} devices authenticated
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSessionsModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  Manage
                </button>
              </div>

              {/* Action 4: Login Activity */}
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Login Activity</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    View authentication audit log
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivityModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────── */}
          {/* 5. RECENT ACTIVITY CARD */}
          {/* ────────────────────────────────────────────────────── */}
          <div
            id="section-activity"
            className="bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Recent Activity
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Administrator audit trail
                  </p>
                </div>
              </div>
            </div>

            {/* Minimal Timeline */}
            <div className="p-5">
              <div className="relative border-l border-slate-800 pl-4 space-y-4 text-xs ml-1">
                {recentActivities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Timeline node */}
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-blue-500/60" />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 text-xs">
                          {act.action}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {act.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Institutional Chapter Accreditation Badge */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-slate-200">Affiliation &amp; Governance</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              CMR Institute of Technology Student Chapter, affiliated with Computer Society of India (CSI Region V, Bangalore Chapter). Authorized under Department of Computer Science &amp; Engineering.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: CHANGE PASSWORD */}
      {/* ======================================================== */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Change Password</h3>
                  <p className="text-[11px] text-slate-400">Update your chapter portal access password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (admin123)"
                    className="w-full px-3 py-2 pr-9 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-3 py-2 pr-9 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                Password should be minimum 6 characters. Avoid common university passwords.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={updatingPassword}
                  leftIcon={updatingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                >
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TWO-FACTOR AUTHENTICATION (2FA) */}
      {/* ======================================================== */}
      {twoFactorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Two-Factor Authentication</h3>
                  <p className="text-[11px] text-slate-400">Time-based One-Time Password (TOTP)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">2FA Protection is currently active</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-bold">
                  Enforced
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Institutional TOTP Secret Key
                </span>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-blue-300">
                  <span className="flex-1 truncate select-all">CMRIT-CSI-SEC-4601-AUTH</span>
                  <button
                    type="button"
                    onClick={() => {
                      copyText('CMRIT-CSI-SEC-4601-AUTH', 'Secret Key');
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="p-1 hover:text-white text-slate-400"
                    title="Copy Key"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Backup Recovery Codes (Stored Securely)
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px] text-slate-300">
                  <span className="p-1.5 bg-slate-950 rounded border border-slate-800">8942-0193</span>
                  <span className="p-1.5 bg-slate-950 rounded border border-slate-800">4418-7204</span>
                  <span className="p-1.5 bg-slate-950 rounded border border-slate-800">9201-3817</span>
                  <span className="p-1.5 bg-slate-950 rounded border border-slate-800">1104-5829</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTwoFactorModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ACTIVE SESSIONS */}
      {/* ======================================================== */}
      {sessionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Active Administrator Sessions</h3>
                  <p className="text-[11px] text-slate-400">Devices currently authenticated to this account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSessionsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{sess.device}</span>
                      {sess.current && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                          This Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{sess.location}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">IP: {sess.ip}</p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">
                    {sess.lastActive}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleTerminateOtherSessions}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
              >
                Terminate Other Sessions
              </button>
              <button
                type="button"
                onClick={() => setSessionsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LOGIN ACTIVITY AUDIT LOG */}
      {/* ======================================================== */}
      {activityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Login Activity &amp; Audit Log</h3>
                  <p className="text-[11px] text-slate-400">Authorized authentications recorded by the chapter security gateway</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivityModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                    <th className="pb-2.5">Date &amp; Time</th>
                    <th className="pb-2.5">Device / OS</th>
                    <th className="pb-2.5">IP Address</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 font-mono text-[11px]">Today, 09:30:12</td>
                    <td className="py-2.5">Chrome 128 / Windows 11</td>
                    <td className="py-2.5 font-mono text-[11px]">10.20.14.88 (Campus)</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                        Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono text-[11px]">Yesterday, 14:10:45</td>
                    <td className="py-2.5">Safari 17 / iOS 17</td>
                    <td className="py-2.5 font-mono text-[11px]">106.51.78.12 (Bangalore)</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                        Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono text-[11px]">Sep 18, 11:04:18</td>
                    <td className="py-2.5">Chrome 128 / Windows 11</td>
                    <td className="py-2.5 font-mono text-[11px]">10.20.14.88 (Campus)</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                        Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono text-[11px]">Sep 15, 17:42:01</td>
                    <td className="py-2.5">Firefox 129 / macOS Sonoma</td>
                    <td className="py-2.5 font-mono text-[11px]">49.37.142.90 (Bangalore)</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                        Success
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Showing last 4 verified sessions.</span>
              <button
                type="button"
                onClick={() => setActivityModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
