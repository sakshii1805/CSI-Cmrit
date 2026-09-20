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
      className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 cursor-pointer shadow-subtle hover:shadow-card-hover transition-all duration-300"
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
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          loading="lazy"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-between p-4 text-white">
        <div className="flex items-center justify-between">
          <Badge variant="blue" className="bg-slate-900/80 border-slate-700 text-blue-300">
            {item.category}
          </Badge>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-tight text-white line-clamp-1 mb-1">
            {item.title}
          </h4>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{item.date}</span>
            {item.location && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
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
