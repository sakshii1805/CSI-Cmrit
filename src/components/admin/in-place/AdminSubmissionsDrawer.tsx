import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Mail,
  User,
  Check,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  BookOpen,
  Calendar,
  Loader2,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { useAuth } from '../../../context/AuthContext';
import { joinService } from '../../../services/joinService';
import { contactService } from '../../../services/contactService';
import { JoinApplication, ContactMessage } from '../../../types';

interface AdminSubmissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'applications' | 'contacts' | 'profile';
}

export const AdminSubmissionsDrawer: React.FC<AdminSubmissionsDrawerProps> = ({
  isOpen,
  onClose,
  defaultTab = 'applications'
}) => {
  const { profile, updateProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'applications' | 'contacts' | 'profile'>(defaultTab);

  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setDepartment(profile.department || '');
      setDesignation(profile.designation || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsRes, msgsRes] = await Promise.all([
        joinService.adminListApplications(),
        contactService.adminListMessages()
      ]);
      setApplications(appsRes.data || []);
      setMessages(msgsRes.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateAppStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await joinService.updateApplicationStatus(id, status);
      if (!res.success) throw new Error(res.error);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      showToast(`Application marked as ${status}`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update application', 'error');
    }
  };

  const handleDeleteApp = async (id: string) => {
    try {
      const res = await joinService.deleteApplication(id);
      if (!res.success) throw new Error(res.error);
      setApplications(prev => prev.filter(a => a.id !== id));
      showToast('Application deleted', 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete application', 'error');
    }
  };

  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await contactService.markMessageRead(id, !currentRead);
      if (!res.success) throw new Error(res.error);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !currentRead } : m));
      showToast(`Message marked as ${!currentRead ? 'read' : 'unread'}`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update message', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await contactService.deleteMessage(id);
      if (!res.success) throw new Error(res.error);
      setMessages(prev => prev.filter(m => m.id !== id));
      showToast('Inquiry removed', 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete message', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        bio: bio.trim()
      });
      if (!res.success) throw new Error(res.error);
      showToast('Admin Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Top Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
          <div>
            <h3 className="font-bold text-base">Admin Management Center</h3>
            <p className="text-[11px] text-slate-400">Review student registrations, inquiries, and coordinator details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Join Applications</span>
            {applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                {applications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'contacts'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquiries</span>
            {messages.filter(m => !m.is_read).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                {messages.filter(m => !m.is_read).length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Admin Profile</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs">Loading records...</span>
            </div>
          ) : activeTab === 'applications' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Total Applications ({applications.length})
                </span>
                <button
                  type="button"
                  onClick={loadData}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl p-6">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No student membership applications yet.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{app.fullName || app.full_name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{app.email}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {app.status || 'pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Branch &amp; Year:</span>
                        <span className="font-semibold text-slate-800">{app.branch} • {app.year}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Phone:</span>
                        <span className="font-semibold text-slate-800">{app.phone || 'N/A'}</span>
                      </div>
                    </div>

                    {app.reason && (
                      <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/80">
                        "{app.reason}"
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      {app.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteApp(app.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'contacts' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Contact Inquiries ({messages.length})
                </span>
                <button
                  type="button"
                  onClick={loadData}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl p-6">
                  <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No contact messages received yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border space-y-2.5 transition-colors ${
                      msg.is_read
                        ? 'border-slate-200 bg-white'
                        : 'border-blue-200 bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{msg.name || msg.fullName}</h4>
                        <p className="text-xs text-slate-500 font-mono">{msg.email}</p>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    {msg.subject && (
                      <p className="text-xs font-semibold text-slate-800">
                        Subject: {msg.subject}
                      </p>
                    )}

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {msg.id && (
                        <button
                          type="button"
                          onClick={() => handleToggleMessageRead(msg.id!, !!msg.is_read)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                        </button>
                      )}

                      {msg.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id!)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 ml-auto"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Admin Profile Tab */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{fullName || 'Student Admin'}</h4>
                  <p className="text-xs text-slate-500 font-mono">admin@cmritonline.ac.in</p>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold text-[10px]">
                    Authorized Chapter Admin
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Student Coordinator"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department of Computer Science &amp; Engineering"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 80 2852 4466"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Coordinator Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={savingProfile}
                  className="w-full"
                >
                  {savingProfile ? 'Updating Profile...' : 'Save Profile Details'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
