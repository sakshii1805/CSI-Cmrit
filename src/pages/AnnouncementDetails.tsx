import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Bell, Loader2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';
import { CommentSection } from '../components/common/CommentSection';
import { announcementsService } from '../services/announcementsService';
import { AnnouncementItem } from '../types';

export const AnnouncementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);
  const [relatedAnnouncements, setRelatedAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadData();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Announcement link copied to clipboard!', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading notice details...</p>
      </div>
    );
  }

  // No announcement found (array is empty or invalid ID)
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

  const contentParagraphs = Array.isArray(announcement.content)
    ? announcement.content
    : typeof announcement.content === 'string'
      ? (announcement.content as string).split('\n\n')
      : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/announcements')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Announcements</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
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
                  Important Circular
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

          {/* Detailed Content Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            {contentParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 mr-1">Tags:</span>
              {announcement.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Public Visitor Comments */}
        <CommentSection
          targetType="announcement"
          targetId={announcement.id}
          targetTitle={announcement.title}
        />

        {/* Related Announcements */}
        {relatedAnnouncements.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Notices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedAnnouncements.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/announcements/${rel.slug || rel.id}`}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 shadow-subtle hover:shadow-card transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span>{rel.category}</span>
                    <span>•</span>
                    <span>{rel.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
