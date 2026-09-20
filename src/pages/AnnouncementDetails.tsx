import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, AlertCircle, Bell } from 'lucide-react';
import { mockAnnouncements } from '../data/announcements';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

export const AnnouncementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const announcement = mockAnnouncements.find((a) => a.slug === id || a.id === id);

  // No announcement found (array is empty or invalid ID)
  if (!announcement) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-slate-200">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900 mb-2">Notice Not Found</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          This dispatch does not exist or may have been archived.
        </p>
        <Link
          to="/announcements"
          className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-mono text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Return to Bulletin Board
        </Link>
      </div>
    );
  }

  const relatedAnnouncements = mockAnnouncements.filter((a) => a.id !== announcement.id).slice(0, 2);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Circular link copied to clipboard!', 'info');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3.5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/announcements')}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO NOTICES</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <article className="bg-white rounded-xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-6">
          {/* Header & Meta */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="blue">{announcement.category}</Badge>
              {announcement.isUrgent && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded uppercase tracking-wider">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  Urgent Notice
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {announcement.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Published: {announcement.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Office: {announcement.author}</span>
              </div>
            </div>
          </div>

          {/* Summary Callout Box */}
          <div className="p-4 sm:p-5 rounded-lg bg-blue-50/60 border border-blue-200/80 text-sm text-blue-950 leading-relaxed font-normal">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-800 block mb-1">
              Executive Synopsis
            </span>
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
              <span className="font-mono text-xs text-slate-400 mr-1">TAGS:</span>
              {announcement.tags.map((tag, i) => (
                <span
                  key={i}
                  className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80"
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
            <h3 className="font-display text-lg font-bold text-slate-900">Recent Dispatches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedAnnouncements.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/announcements/${rel.slug || rel.id}`}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-subtle hover:shadow-card transition-all group"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 mb-1">
                    <span>{rel.category}</span>
                    <span>•</span>
                    <span>{rel.date}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
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

