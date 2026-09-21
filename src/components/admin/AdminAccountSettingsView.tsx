import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Eye,
  Check,
  RotateCcw,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '../common/Button';

interface AdminAccountSettingsViewProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const SETTINGS_STORAGE_KEY = 'csi_admin_account_preferences';

interface AccountPreferences {
  circularNotifications: boolean;
  eventRegistrationNotifications: boolean;
  announcementNotifications: boolean;
  commentModerationNotifications: boolean;
  theme: 'dark' | 'light';
  compactDensity: boolean;
  confirmDeleteActions: boolean;
  profileVisibility: boolean;
  emailVisibility: boolean;
  activityStatus: boolean;
}

const defaultPreferences: AccountPreferences = {
  circularNotifications: true,
  eventRegistrationNotifications: true,
  announcementNotifications: true,
  commentModerationNotifications: true,
  theme: 'dark',
  compactDensity: false,
  confirmDeleteActions: true,
  profileVisibility: true,
  emailVisibility: false,
  activityStatus: true
};

export const AdminAccountSettingsView: React.FC<AdminAccountSettingsViewProps> = ({
  showToast,
  isDarkMode = true,
  onToggleTheme
}) => {
  const [prefs, setPrefs] = useState<AccountPreferences>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const activeTheme = localStorage.getItem('csi_admin_theme') as 'dark' | 'light';
      const base = stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
      if (activeTheme === 'dark' || activeTheme === 'light') {
        base.theme = activeTheme;
      }
      return base;
    } catch {
      return defaultPreferences;
    }
  });

  const [saving, setSaving] = useState(false);

  const handleToggle = (key: keyof AccountPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectTheme = (selectedTheme: 'dark' | 'light') => {
    setPrefs(prev => ({ ...prev, theme: selectedTheme }));
    localStorage.setItem('csi_admin_theme', selectedTheme);
    if ((selectedTheme === 'dark' && !isDarkMode) || (selectedTheme === 'light' && isDarkMode)) {
      if (onToggleTheme) {
        onToggleTheme();
      } else {
        window.dispatchEvent(new CustomEvent('csi_admin_theme_changed', { detail: selectedTheme }));
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(prefs));
      localStorage.setItem('csi_admin_theme', prefs.theme);
      showToast('Account preferences saved successfully!', 'success');
    } catch {
      showToast('Preferences updated locally.', 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPrefs(defaultPreferences);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultPreferences));
    localStorage.setItem('csi_admin_theme', 'dark');
    if (!isDarkMode && onToggleTheme) {
      onToggleTheme();
    }
    showToast('Preferences reset to default values.', 'info');
  };

  const cardBg = isDarkMode ? 'bg-[#0b1329] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs';
  const innerCardBg = isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/90';
  const subtextColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const headingColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderDivider = isDarkMode ? 'border-slate-800' : 'border-slate-100';

  return (
    <div className={`max-w-4xl mx-auto space-y-6 animate-fadeIn ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Top Header Card */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences &amp; Defaults</span>
          </div>
          <h2 className={`text-2xl font-bold ${headingColor} tracking-tight`}>Account Settings</h2>
          <p className={`text-xs sm:text-sm ${subtextColor} mt-1`}>
            Configure portal visual appearance, system notification alerts, and directory privacy preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleReset}
            className={`text-xs ${
              isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Reset Defaults
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5" />}
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      {/* Section 1: Portal Appearance (Dark vs Light Mode) */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 space-y-6 transition-colors`}>
        <div className={`flex items-center gap-2.5 pb-4 border-b ${borderDivider}`}>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${headingColor}`}>Portal Appearance &amp; Workspace Theme</h3>
            <p className={`text-xs ${subtextColor}`}>Toggle between High-Contrast Dark Mode and Crisp Light Mode.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Select Workspace Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Mode Card */}
            <div
              onClick={() => handleSelectTheme('dark')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isDarkMode
                  ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-800 text-amber-300 border border-slate-700">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white">Dark Mode</span>
                </div>
                {isDarkMode && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Deep navy &amp; OLED black workspace with high-contrast text and luminous accent highlights for eye comfort.
              </p>
            </div>

            {/* Light Mode Card */}
            <div
              onClick={() => handleSelectTheme('light')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                !isDarkMode
                  ? 'bg-blue-50/70 border-blue-600 shadow-md ring-1 ring-blue-600/30'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Light Mode</span>
                </div>
                {!isDarkMode && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Clean, bright daylight workspace with sharp dark typography and crisp borders for high-readability environments.
              </p>
            </div>
          </div>

          {/* Confirm Destructive Actions Toggle */}
          <div className={`flex items-center justify-between p-4 rounded-xl border mt-3 ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>In-App Confirmation Dialogs</h4>
              <p className={`text-xs ${subtextColor}`}>Show safety confirmation dialogs before permanently deleting records.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('confirmDeleteActions')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.confirmDeleteActions ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.confirmDeleteActions ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Notification Preferences */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 space-y-6 transition-colors`}>
        <div className={`flex items-center gap-2.5 pb-4 border-b ${borderDivider}`}>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${headingColor}`}>Notification Preferences</h3>
            <p className={`text-xs ${subtextColor}`}>Choose which administrative alerts and automated updates you receive.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Chapter Circulars */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>Chapter Circulars &amp; Official Notices</h4>
              <p className={`text-xs ${subtextColor}`}>Receive priority notifications when new university or CSI headquarter directives are issued.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('circularNotifications')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.circularNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.circularNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Event Registration Alerts */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>Event &amp; Workshop Registrations</h4>
              <p className={`text-xs ${subtextColor}`}>Get notified immediately when attendees or student teams register for chapter events.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('eventRegistrationNotifications')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.eventRegistrationNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.eventRegistrationNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Announcement Notifications */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>Announcement Updates</h4>
              <p className={`text-xs ${subtextColor}`}>Alerts when announcements are published, scheduled, or revised by other coordinators.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('announcementNotifications')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.announcementNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.announcementNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Comment Moderation Alerts */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>Comment Moderation Alerts</h4>
              <p className={`text-xs ${subtextColor}`}>Receive an instant notice whenever a visitor leaves a comment that requires administrative review.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('commentModerationNotifications')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.commentModerationNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.commentModerationNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Privacy Settings */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 space-y-6 transition-colors`}>
        <div className={`flex items-center gap-2.5 pb-4 border-b ${borderDivider}`}>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${headingColor}`}>Directory &amp; Public Visibility</h3>
            <p className={`text-xs ${subtextColor}`}>Control what information is visible to students and chapter members.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Profile Visibility */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>Public Directory Listing</h4>
              <p className={`text-xs ${subtextColor}`}>List my name, department, and role in the CSI CMRIT Student Chapter Committee directory.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('profileVisibility')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.profileVisibility ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.profileVisibility ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Email Visibility */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${innerCardBg}`}>
            <div className="space-y-0.5 max-w-xl">
              <h4 className={`text-sm font-bold ${headingColor}`}>Show Contact Email to Members</h4>
              <p className={`text-xs ${subtextColor}`}>Allow logged-in student members to view administrator contact email for inquiries.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailVisibility')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                prefs.emailVisibility ? 'bg-blue-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  prefs.emailVisibility ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
