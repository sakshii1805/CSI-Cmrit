import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Building, Phone, FileText, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../common/Toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    designation: '',
    department: '',
    phone: '',
    bio: '',
    avatar_url: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        full_name: profile.full_name || '',
        designation: profile.designation || 'Student Coordinator',
        department: profile.department || 'Department of Computer Science & Engineering',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await updateProfile({
        full_name: formData.full_name.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        avatar_url: formData.avatar_url.trim(),
      });

      if (!res.success) {
        showToast(res.error || 'Failed to update profile', 'error');
        return;
      }

      showToast('Profile updated successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Edit Administrator Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your administrator information and chapter credentials
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Avatar Preview & URL */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-blue-500/40 bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt={formData.full_name || 'Admin'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span>{getInitials(formData.full_name)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Leave blank to use modern monogram initials.
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="e.g. Student Admin"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Designation & Phone (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Designation / Role
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Student Coordinator"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 80 2852 4466"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Department of Computer Science & Engineering"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Bio / Responsibilities
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of your administrative role in the CSI chapter..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
