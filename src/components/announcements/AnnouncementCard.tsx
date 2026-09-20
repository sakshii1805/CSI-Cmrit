import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
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
    <article className="bg-white rounded-xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col group h-full">
      {/* Top row: Category & Date */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <Badge variant={categoryVariantMap[announcement.category] || 'slate'}>
            {announcement.category}
          </Badge>
          {announcement.isUrgent && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded uppercase tracking-wider">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              Circular
            </span>
          )}
        </div>
        <div className="font-mono text-xs text-slate-500">
          {announcement.date}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
        <Link to={`/announcements/${announcement.slug || announcement.id}`}>
          {announcement.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-5 flex-1 font-normal">
        {announcement.summary}
      </p>

      {/* Author & Read More */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto text-xs">
        <span className="font-mono text-[11px] text-slate-500">
          Authored by {announcement.author}
        </span>
        <Link
          to={`/announcements/${announcement.slug || announcement.id}`}
          className="inline-flex items-center gap-1 font-mono font-medium text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read Document</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};

