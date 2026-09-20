import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { GalleryItem } from '../../types';
import { Badge } from '../common/Badge';

interface LightboxModalProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  item,
  onClose,
  onNext,
  onPrev,
  hasNext = true,
  hasPrev = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/95 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Close photo preview"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation: Previous */}
      {hasPrev && onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 sm:left-6 z-20 p-3 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Navigation: Next */}
      {hasNext && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 sm:right-6 z-20 p-3 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Container */}
      <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#081325] rounded-xl overflow-hidden border border-slate-800 shadow-elevated">
        {/* Main Image */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[70vh]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-contain max-h-[70vh]"
          />
        </div>

        {/* Footer Details */}
        <div className="p-5 sm:p-6 bg-[#081325] border-t border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="blue" className="bg-blue-950/80 text-blue-300 border-blue-800 font-mono text-[10px]">
                {item.category}
              </Badge>
              <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{item.date}</span>
            </div>
            {item.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{item.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

