import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { GalleryPost } from '../../types';

interface LightboxModalProps {
  isOpen: boolean;
  post: GalleryPost | null;
  allPosts: GalleryPost[];
  initialPostIndex: number;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  post: initialPost,
  allPosts,
  initialPostIndex,
  onClose,
}) => {
  const [postIndex, setPostIndex] = useState(initialPostIndex);
  const [imageIndex, setImageIndex] = useState(0);

  // Reset when opened with a new post
  useEffect(() => {
    if (isOpen) {
      setPostIndex(initialPostIndex);
      setImageIndex(0);
    }
  }, [isOpen, initialPostIndex]);

  const activePost = allPosts[postIndex] ?? initialPost;

  const images = React.useMemo(() => {
    if (!activePost) return [];
    if (activePost.images && activePost.images.length > 0) {
      return activePost.images.map(img => img.image_url);
    }
    return activePost.cover_image ? [activePost.cover_image] : ['/images/avishkaar_poster.jpg'];
  }, [activePost]);

  const totalImages = images.length;
  const totalPosts = allPosts.length;

  const goNextImage = useCallback(() => {
    if (imageIndex < totalImages - 1) {
      setImageIndex(i => i + 1);
    } else if (postIndex < totalPosts - 1) {
      setPostIndex(p => p + 1);
      setImageIndex(0);
    }
  }, [imageIndex, totalImages, postIndex, totalPosts]);

  const goPrevImage = useCallback(() => {
    if (imageIndex > 0) {
      setImageIndex(i => i - 1);
    } else if (postIndex > 0) {
      setPostIndex(p => p - 1);
      setImageIndex(0);
    }
  }, [imageIndex, postIndex]);

  const hasPrev = imageIndex > 0 || postIndex > 0;
  const hasNext = imageIndex < totalImages - 1 || postIndex < totalPosts - 1;

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNextImage();
      else goPrevImage();
    }
    setTouchStart(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNextImage();
      if (e.key === 'ArrowLeft') goPrevImage();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, goNextImage, goPrevImage]);

  if (!isOpen || !activePost) return null;

  const currentImageUrl = images[imageIndex] || '/images/avishkaar_poster.jpg';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop click closes */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors focus:outline-none"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrevImage(); }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all shadow-xl focus:outline-none"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); goNextImage(); }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all shadow-xl focus:outline-none"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content */}
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center px-16 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative max-h-[72vh] w-full flex items-center justify-center">
          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={activePost.title}
            onError={(e) => { e.currentTarget.src = '/images/avishkaar_poster.jpg'; }}
            className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl"
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center max-w-xl px-2">
          <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
              {activePost.category || 'Chapter Visual'}
            </span>
            {totalImages > 1 && (
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Images className="w-3 h-3" />
                {imageIndex + 1} / {totalImages}
              </span>
            )}
            {totalPosts > 1 && (
              <span className="text-xs text-slate-500 font-mono">
                Post {postIndex + 1} of {totalPosts}
              </span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white">{activePost.title}</h4>
          {activePost.description && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{activePost.description}</p>
          )}
        </div>

        {/* Image dot nav (if multi-image post) */}
        {totalImages > 1 && (
          <div className="flex items-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === imageIndex ? 'bg-white scale-125' : 'bg-slate-600 hover:bg-slate-400'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
