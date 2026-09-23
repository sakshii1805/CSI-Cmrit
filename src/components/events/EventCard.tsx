import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock, Pencil, Trash2, Shield, Eye, EyeOff, Pin } from 'lucide-react';
import { EventItem } from '../../types';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

interface EventCardProps {
  event: EventItem;
  onEdit?: (event: EventItem) => void;
  onDelete?: (event: EventItem) => void;
  onTogglePublish?: (event: EventItem) => void;
  onTogglePin?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onTogglePublish,
  onTogglePin
}) => {
  const { isAdmin } = useAuth();
  const isPublished = event.status === 'published' || event.is_published !== false;

  const categoryColorMap = {
    Workshop: 'blue',
    Hackathon: 'purple',
    Competition: 'amber',
    'Technical Session': 'emerald',
    Workshops: 'blue',
    Hackathons: 'purple',
    Competitions: 'amber',
    'Technical Sessions': 'emerald',
    Other: 'slate'
  } as const;

  return (
    <div
      className={`group bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full relative ${
        event.is_pinned
          ? 'border-2 border-amber-300 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
          : 'border border-slate-200/90 shadow-subtle hover:shadow-card-hover'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.image || event.image_url || ''}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Category & Status badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pointer-events-none">
          {event.is_pinned && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
              <Pin className="w-2.5 h-2.5 fill-white" />
              Pinned
            </span>
          )}

          <Badge variant={(categoryColorMap as Record<string, any>)[event.category] || 'blue'}>
            {event.category}
          </Badge>

          {isAdmin && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md uppercase tracking-wider ${
                isPublished
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-amber-600/90 text-white'
              }`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          )}
        </div>

        {/* In-Place Admin Quick Actions (pinned top-right of image) */}
        {isAdmin && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-md">
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onTogglePin(event);
                }}
                className={`p-1 rounded transition-colors ${
                  event.is_pinned
                    ? 'text-amber-400 bg-amber-500/20'
                    : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'
                }`}
                title={event.is_pinned ? 'Unpin event' : 'Pin event to top (Admin)'}
              >
                <Pin className={`w-3.5 h-3.5 ${event.is_pinned ? 'fill-amber-400' : ''}`} />
              </button>
            )}
            {onTogglePublish && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onTogglePublish(event);
                }}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title={isPublished ? 'Unpublish to draft' : 'Publish event'}
              >
                {isPublished ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(event);
                }}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Edit Event"
              >
                <Pencil className="w-3.5 h-3.5 text-blue-400" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(event);
                }}
                className="p-1 rounded text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{event.date || event.event_date}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{(event.time || event.event_time || '').split('–')[0].trim()}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
          <Link to={`/events/${event.slug || event.id}`}>
            {event.title}
          </Link>
        </h3>

        {/* Venue */}
        <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="truncate">{event.venue}</span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5 flex-1">
          {event.shortDescription}
        </p>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
          <Link
            to={`/events/${event.slug || event.id}`}
            className="inline-flex items-center justify-between w-full text-xs font-semibold text-slate-700 group-hover:text-blue-600 py-1 transition-colors"
          >
            <span>View Details &amp; Schedule</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
