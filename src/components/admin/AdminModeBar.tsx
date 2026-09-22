import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  LogOut,
  Bell,
  MessageSquare,
  Users,
  Mail,
  User,
  Plus,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { commentsService } from '../../services/commentsService';

interface AdminModeBarProps {
  onOpenSubmissions?: (tab: 'applications' | 'contacts' | 'profile') => void;
  onOpenEventModal?: () => void;
  onOpenAnnouncementModal?: () => void;
  onOpenGalleryModal?: () => void;
}

export const AdminModeBar: React.FC<AdminModeBarProps> = ({
  onOpenSubmissions,
  onOpenEventModal,
  onOpenAnnouncementModal,
  onOpenGalleryModal
}) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [pendingCommentCount, setPendingCommentCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchPendingCommentsCount = async () => {
    try {
      const res = await commentsService.adminListComments();
      const count = (res.data || []).filter(c => c.status === 'pending').length;
      setPendingCommentCount(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchPendingCommentsCount();

    const handleUpdate = () => {
      fetchPendingCommentsCount();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, [isAdmin]);

  if (!isAdmin) return null;

  const handleExitAdmin = async () => {
    try {
      await signOut();
      showToast('Exited Admin Mode. Returned to public view.', 'info');
      navigate('/');
    } catch (err: any) {
      showToast(err?.message || 'Error signing out', 'error');
    }
  };

  return (
    <aside aria-label="Administrator Toolbar" className="bg-slate-950/95 backdrop-blur-md border-b border-blue-900/40 text-slate-200 text-xs py-2 px-4 sticky top-0 z-[60] shadow-md shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Mode Status + Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Shield className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase">Admin Mode Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="text-slate-300 font-medium">
              {profile?.full_name || 'Student Admin'}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-400">admin@cmritonline.ac.in</span>
          </div>
        </div>

        {/* Right: Quick In-Place Action Shortcuts + Pending Badge + Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pending Comments Shortcut */}
          {pendingCommentCount > 0 && (
            <Link
              to="/events"
              title={`${pendingCommentCount} comments awaiting review`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-[11px] transition-all animate-pulse"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{pendingCommentCount} Pending Review</span>
            </Link>
          )}

          {/* Quick Add Menu */}
          {(onOpenEventModal || onOpenAnnouncementModal || onOpenGalleryModal) && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-[11px] transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create</span>
                <ChevronDown className="w-3 h-3 text-blue-200" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in"
                  onClick={() => setMenuOpen(false)}
                >
                  {onOpenEventModal && (
                    <button
                      type="button"
                      onClick={onOpenEventModal}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-400" />
                      <span>New Event</span>
                    </button>
                  )}
                  {onOpenAnnouncementModal && (
                    <button
                      type="button"
                      onClick={onOpenAnnouncementModal}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs flex items-center gap-2"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>New Announcement</span>
                    </button>
                  )}
                  {onOpenGalleryModal && (
                    <button
                      type="button"
                      onClick={onOpenGalleryModal}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>New Gallery Post</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submissions / Admin Hub Trigger */}
          {onOpenSubmissions && (
            <button
              type="button"
              onClick={() => onOpenSubmissions('applications')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px]"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Applications</span>
            </button>
          )}

          {onOpenSubmissions && (
            <button
              type="button"
              onClick={() => onOpenSubmissions('contacts')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px]"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inquiries</span>
            </button>
          )}

          {onOpenSubmissions && (
            <button
              type="button"
              onClick={() => onOpenSubmissions('profile')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px]"
              title="Admin Account Profile"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}

          {/* Exit Admin Mode Button */}
          <button
            type="button"
            onClick={handleExitAdmin}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-all font-medium text-[11px]"
            title="Exit Admin Mode and return to normal public website"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
