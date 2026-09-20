import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Bell, CheckCircle2 } from 'lucide-react';
import { mockAnnouncements } from '../data/announcements';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const AnnouncementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const announcement = mockAnnouncements.find((a) => a.slug === id || a.id === id) || mockAnnouncements[0];
  const relatedAnnouncements = mockAnnouncements.filter((a) => a.id !== announcement.id).slice(0, 2);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Announcement link copied to clipboard!', 'info');
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
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
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-100 text-sm text-blue-900 leading-relaxed font-medium">
            {announcement.summary}
          </div>

          {/* Detailed Content Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            {announcement.content.map((paragraph, idx) => (
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

        {/* Related Announcements */}
        {relatedAnnouncements.length > 0 && (
          <div className="mt-12 space-y-4">
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
