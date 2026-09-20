import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { EventItem } from '../../types';
import { Badge } from '../common/Badge';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isUpcoming = event.status === 'upcoming';

  const categoryColorMap = {
    Workshops: 'blue',
    Hackathons: 'purple',
    Competitions: 'amber',
    'Technical Sessions': 'emerald',
    Other: 'slate'
  } as const;

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

        {/* Category & Status badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <Badge variant={categoryColorMap[event.category] || 'blue'}>
            {event.category}
          </Badge>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md uppercase tracking-wider ${
              isUpcoming
                ? 'bg-emerald-500/90 text-white'
                : 'bg-slate-700/90 text-slate-200'
            }`}
          >
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{event.date}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.time.split('–')[0].trim()}</span>
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
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <Link
            to={`/events/${event.slug || event.id}`}
            className="inline-flex items-center justify-between w-full text-xs font-semibold text-slate-700 group-hover:text-blue-600 py-1 transition-colors"
          >
            <span>View Details & Schedule</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
