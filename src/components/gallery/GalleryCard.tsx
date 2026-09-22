import React from 'react';
import { Camera, MapPin } from 'lucide-react';
import { GalleryItem } from '../../types';
import { Badge } from '../common/Badge';

interface GalleryCardProps {
  item: GalleryItem;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item }) => {
  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-subtle transition-all duration-300"
      aria-label={`${item.title}`}
    >
      <div className="aspect-[4/3] w-full flex items-center justify-center p-6">
        <Camera className="w-12 h-12 text-slate-300" />
      </div>

      {/* Overlay */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="blue" className="bg-slate-50 border-slate-200 text-blue-600">
            {item.category}
          </Badge>
        </div>

        <h4 className="text-sm font-semibold tracking-tight text-slate-900 line-clamp-1 mb-1">
          {item.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-slate-500">
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
  );
};
