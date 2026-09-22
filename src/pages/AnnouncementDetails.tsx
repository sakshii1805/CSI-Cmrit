import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Bell, Loader2, Pencil, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';
import { CommentSection } from '../components/common/CommentSection';
import { announcementsService } from '../services/announcementsService';
import { AnnouncementItem, ContentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { AnnouncementModal } from '../components/admin/in-place/AnnouncementModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const AnnouncementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);
  const [relatedAnnouncements, setRelatedAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  // In-place modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function loadData() {
    if (!id) return;
    try {
      setLoading(true);
      const res = await announcementsService.getAnnouncementBySlug(id);
      setAnnouncement(res.data);

      if (res.data) {
        const allRes = await announcementsService.getPublishedAnnouncements();
        const list = allRes.data || [];
        setRelatedAnnouncements(list.filter((a) => a.id !== res.data?.id).slice(0, 2));
      }
    } catch (err) {
      console.error('Failed to load announcement details:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Announcement link copied to clipboard!', 'info');
  };

  const handleTogglePublish = async () => {
    if (!announcement) return;
    try {
      const current = (announcement.status === 'published' || announcement.is_published !== false) ? 'published' : 'draft';
      const res = await announcementsService.toggleAnnouncementPublish(announcement.id, current as ContentStatus);
      if (!res.success) throw new Error(res.error);
      const next = current === 'published' ? 'draft' : 'published';
      showToast(`Announcement status changed to ${next}`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!announcement) return;
    try {
      const res = await announcementsService.deleteAnnouncement(announcement.id);
      if (!res.success) throw new Error(res.error);
      showToast('Announcement removed.', 'info');
      setDeleteDialogOpen(false);
      navigate('/announcements');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete announcement', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading notice details...</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
          <Bell className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Announcement Not Found</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          This announcement does not exist or may have been removed.
        </p>
        <Link
          to="/announcements"
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Back to Announcements
        </Link>
      </div>
    );
  }

  const isPublished = announcement.status === 'published' || announcement.is_published !== false;
  const contentParagraphs = Array.isArray(announcement.content)
    ? announcement.content
    : typeof announcement.content === 'string'
      ? (announcement.content as string).split('\n\n')
      : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumbs & Admin Actions */}
      <div className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => navigate('/announcements')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Announcements</span>
          </button>

          <div className="flex items-center gap-2">
            {/* In-Place Admin Controls */}
            {isAdmin && (
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <button
                  type="button"
                  onClick={handleTogglePublish}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isPublished
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isPublished ? 'Published' : 'Draft'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Notice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full space-y-10">
        <article className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-6">
          {/* Header & Meta */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="blue">{announcement.category}</Badge>
              {announcement.isUrgent && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded uppercase">
                  <Bell className="w-3 h-3 text-rose-500" />
                  Important Notice
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {announcement.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published on {announcement.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>By {announcement.author}</span>
              </div>
            </div>
          </div>

          {/* Summary Callout Box */}
          {announcement.summary && (
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-100 text-sm text-blue-900 leading-relaxed font-medium">
              {announcement.summary}
            </div>
          )}

          {/* Paragraphs */}
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
            {contentParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {announcement.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* In-Place Edit Modal */}
        {isAdmin && (
          <AnnouncementModal
            isOpen={modalOpen}
            announcementToEdit={announcement}
            onClose={() => setModalOpen(false)}
            onSuccess={(updated) => {
              setAnnouncement(updated);
              loadData();
            }}
          />
        )}

        {/* In-Place Delete Confirmation */}
        {isAdmin && (
          <ConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Notice"
            message={`Are you sure you want to delete "${announcement.title}"?`}
            confirmLabel="Delete Notice"
            variant="danger"
            onConfirm={handleDeleteConfirm}
            onClose={() => setDeleteDialogOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
