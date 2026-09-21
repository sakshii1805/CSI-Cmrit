import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Award,
  BookOpen,
  Pencil,
  Check,
  X,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';

interface AdminProfileViewProps {
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
  onSaveProfile: (e: React.FormEvent, updatedData?: any) => Promise<void>;
  updatingProfile: boolean;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  adminEmail?: string;
  isDarkMode?: boolean;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  profileForm,
  setProfileForm,
  onSaveProfile,
  updatingProfile,
  showToast,
  adminEmail = 'admin@cmritsi.in',
  isDarkMode = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Local draft state when editing
  const [editDraft, setEditDraft] = useState({ ...profileForm });

  // Keep draft in sync if external profileForm updates
  React.useEffect(() => {
    if (!isEditing) {
      setEditDraft({ ...profileForm });
    }
  }, [profileForm, isEditing]);

  const handleStartEdit = () => {
    setEditDraft({ ...profileForm });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditDraft({ ...profileForm });
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileForm({ ...editDraft });
    await onSaveProfile(e, editDraft);
    setIsEditing(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopiedEmail(true);
    showToast('Email address copied to clipboard.', 'info');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const cardBg = isDarkMode ? 'bg-[#0b1329] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs';
  const innerCardBg = isDarkMode ? 'bg-slate-900/60 border-slate-800/80 text-white' : 'bg-slate-50 border-slate-200/90 text-slate-900';
  const inputBg = isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600 font-bold';
  const subtextColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const headingColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderDivider = isDarkMode ? 'border-slate-800' : 'border-slate-100';

  return (
    <div className={`max-w-4xl mx-auto space-y-6 animate-fadeIn ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Top Header Card */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Official Identity Record</span>
          </div>
          <h2 className={`text-2xl font-bold ${headingColor} tracking-tight`}>Administrator Profile</h2>
          <p className={`text-xs sm:text-sm ${subtextColor} mt-1`}>
            Personal identity credentials, department affiliation, and student coordinator administrative records.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Pencil className="w-3.5 h-3.5" />}
              onClick={handleStartEdit}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<X className="w-3.5 h-3.5" />}
                onClick={handleCancelEdit}
                disabled={updatingProfile}
                className={`text-xs ${
                  isDarkMode
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon={<Check className="w-3.5 h-3.5" />}
                onClick={handleSave}
                disabled={updatingProfile}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm"
              >
                {updatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 transition-colors`}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Full Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={editDraft.full_name}
                  onChange={(e) => setEditDraft({ ...editDraft, full_name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
                  placeholder="e.g. Student Admin"
                />
              ) : (
                <div className={`p-3 rounded-xl border text-sm font-semibold ${innerCardBg}`}>
                  {profileForm.full_name || 'Student Admin'}
                </div>
              )}
            </div>

            {/* Email Address (Official ID) */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>Email Address (Primary Admin ID)</span>
              </label>
              <div className={`flex items-center justify-between p-3 rounded-xl border text-sm font-mono ${innerCardBg}`}>
                <span className="truncate">{adminEmail}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`p-1 rounded-md transition-colors ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Copy email address"
                >
                  {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>Phone Number</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editDraft.phone}
                  onChange={(e) => setEditDraft({ ...editDraft, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
                  placeholder="+91 80 2852 4466"
                />
              ) : (
                <div className={`p-3 rounded-xl border text-sm ${innerCardBg}`}>
                  {profileForm.phone || '+91 80 2852 4466'}
                </div>
              )}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Building className="w-3.5 h-3.5 text-blue-500" />
                <span>Academic Department</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editDraft.department}
                  onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
                  placeholder="Department of Computer Science & Engineering"
                />
              ) : (
                <div className={`p-3 rounded-xl border text-sm ${innerCardBg}`}>
                  {profileForm.department || 'Department of Computer Science & Engineering'}
                </div>
              )}
            </div>

            {/* Designation / Role */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span>Assigned Role / Title</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editDraft.designation}
                  onChange={(e) => setEditDraft({ ...editDraft, designation: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
                  placeholder="e.g. Student Coordinator, President, Lead Organizer"
                />
              ) : (
                <div className={`p-3 rounded-xl border flex items-center justify-between ${innerCardBg}`}>
                  <span className={`text-sm font-semibold ${headingColor}`}>
                    {profileForm.designation || 'Student Coordinator'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/30">
                    Authorized Admin
                  </span>
                </div>
              )}
            </div>

            {/* Avatar Photo URL */}
            <div className="space-y-1.5">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Avatar / Photo URL</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editDraft.avatar_url}
                  onChange={(e) => setEditDraft({ ...editDraft, avatar_url: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
                  placeholder="https://... or leave empty for initials monogram"
                />
              ) : (
                <div className={`p-3 rounded-xl border text-sm truncate ${innerCardBg}`}>
                  {profileForm.avatar_url ? (
                    <span className="text-blue-400 truncate">{profileForm.avatar_url}</span>
                  ) : (
                    <span className={subtextColor}>Initials Monogram (Default)</span>
                  )}
                </div>
              )}
            </div>

            {/* Chapter / Institution */}
            <div className="space-y-1.5 md:col-span-2">
              <label className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${labelColor}`}>
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Chapter / Institution</span>
              </label>
              <div className={`p-3 rounded-xl border text-sm leading-relaxed ${innerCardBg}`}>
                Computer Society of India — CMR Institute of Technology (CMRIT), Bengaluru
              </div>
            </div>
          </div>

          {/* Administrator Summary / Bio */}
          <div className="space-y-1.5 pt-2">
            <label className={`text-xs uppercase tracking-wider block ${labelColor}`}>
              Administrator Summary &amp; Responsibilities
            </label>
            {isEditing ? (
              <textarea
                rows={4}
                value={editDraft.bio}
                onChange={(e) => setEditDraft({ ...editDraft, bio: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors leading-relaxed ${inputBg}`}
                placeholder="Brief summary of chapter coordination and leadership roles..."
              />
            ) : (
              <div className={`p-4 rounded-xl border text-sm leading-relaxed ${innerCardBg}`}>
                {profileForm.bio || 'Student coordinator for CSI CMRIT chapter. Managing chapter events, workshops, hackathons, and technical community activities.'}
              </div>
            )}
          </div>

          {/* Bottom Action bar when in Edit Mode */}
          {isEditing && (
            <div className={`pt-4 border-t ${borderDivider} flex items-center justify-end gap-3`}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={updatingProfile}
                className={`text-xs ${
                  isDarkMode
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={updatingProfile}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 shadow-sm"
              >
                {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
