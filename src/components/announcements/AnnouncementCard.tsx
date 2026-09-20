import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Bell } from 'lucide-react';
import { AnnouncementItem } from '../../types';
import { Badge } from '../common/Badge';

interface AnnouncementCardProps {
  announcement: AnnouncementItem;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const categoryVariantMap = {
    General: 'slate',
    Hackathon: 'purple',
    Workshop: 'blue',
    Registration: 'emerald',
    Opportunity: 'amber'
  } as const;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col group h-full">
      {/* Top row: Category & Date */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={(categoryVariantMap as Record<string, any>)[announcement.category] || 'slate'}>
            {announcement.category}
          </Badge>
          {announcement.isUrgent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded uppercase tracking-wider">
              <Bell className="w-3 h-3 text-rose-500 animate-pulse" />
              Notice
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{announcement.date}</span>
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
