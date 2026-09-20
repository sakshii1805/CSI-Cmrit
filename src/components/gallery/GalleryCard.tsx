import React from 'react';
import { Maximize2, MapPin } from 'lucide-react';
import { GalleryItem } from '../../types';
import { Badge } from '../common/Badge';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 cursor-pointer shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-300 active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View photo: ${item.title}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
        <div className="flex items-center justify-between">
          <Badge variant="blue" className="bg-slate-950/80 border-slate-700 text-blue-300 font-mono text-[10px]">
            {item.category}
          </Badge>
          <div className="w-7 h-7 rounded-md bg-white/15 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <div className="pt-2">
          <h4 className="font-display text-sm font-bold tracking-tight text-white line-clamp-1 mb-1.5">
            {item.title}
          </h4>
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>{item.date}</span>
            {item.location && (
              <span className="flex items-center gap-1 text-[11px] text-slate-300">
                <MapPin className="w-3 h-3 text-blue-400" />
                {item.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

