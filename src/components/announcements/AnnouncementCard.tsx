import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Bell, Pencil, Trash2, Eye, EyeOff, Pin } from 'lucide-react';
import { AnnouncementItem } from '../../types';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

interface AnnouncementCardProps {
  announcement: AnnouncementItem;
  onEdit?: (announcement: AnnouncementItem) => void;
  onDelete?: (announcement: AnnouncementItem) => void;
  onTogglePublish?: (announcement: AnnouncementItem) => void;
  onTogglePin?: (announcement: AnnouncementItem) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
  onTogglePublish,
  onTogglePin
}) => {
  const { isAdmin } = useAuth();
  const isPublished = announcement.status === 'published' || announcement.is_published !== false;

  const categoryVariantMap = {
    General: 'slate',
    Hackathon: 'purple',
    Workshop: 'blue',
    Registration: 'emerald',
    Opportunity: 'amber',
    Event: 'blue'
  } as const;

  return (
    <div
      className={`bg-white rounded-xl p-5 transition-all duration-300 flex flex-col group h-full relative ${
        announcement.is_pinned
          ? 'border-2 border-amber-300 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
          : 'border border-slate-200/90 shadow-subtle hover:shadow-card-hover'
      }`}
    >
      {/* Top row: Category & Date + Admin Actions */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {announcement.is_pinned && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded shadow-xs">
              <Pin className="w-3 h-3 fill-amber-500 text-amber-600" />
              Pinned
            </span>
          )}

          <Badge variant={(categoryVariantMap as Record<string, any>)[announcement.category] || 'slate'}>
            {announcement.category}
          </Badge>

          {announcement.isUrgent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded uppercase tracking-wider">
              <Bell className="w-3 h-3 text-rose-500 animate-pulse" />
              Notice
            </span>
          )}

          {isAdmin && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                isPublished
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Controls (Only visible and accessible to Admins) */}
          {isAdmin && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {onTogglePin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onTogglePin(announcement);
                  }}
                  className={`p-1 rounded transition-colors ${
                    announcement.is_pinned
                      ? 'text-amber-600 bg-amber-100'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-slate-200'
                  }`}
                  title={announcement.is_pinned ? 'Unpin notice' : 'Pin notice to top (Admin)'}
                >
                  <Pin className={`w-3.5 h-3.5 ${announcement.is_pinned ? 'fill-amber-600' : ''}`} />
                </button>
              )}
              {onTogglePublish && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onTogglePublish(announcement);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-slate-900 transition-colors"
                  title={isPublished ? 'Unpublish to draft' : 'Publish notice'}
                >
                  {isPublished ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(announcement);
                  }}
                  className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Edit Announcement"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(announcement);
                  }}
                  className="p-1 rounded text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{announcement.date}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
        <Link to={`/announcements/${announcement.slug || announcement.id}`}>
          {announcement.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4 flex-1">
        {announcement.summary}
      </p>

      {/* Author & Read More */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto text-xs">
        <span className="text-slate-500 font-medium">
          By {announcement.author}
        </span>
        <Link
          to={`/announcements/${announcement.slug || announcement.id}`}
          className="inline-flex items-center gap-1 text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
