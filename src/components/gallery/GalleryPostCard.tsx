import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil,
  Trash2,
  ArrowRight,
  Calendar,
  Share2,
  Maximize2,
  Sparkles,
  Check,
  Pin
} from 'lucide-react';
import { GalleryPost } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface GalleryPostCardProps {
  post: GalleryPost;
  isLatest?: boolean;
  onOpenLightbox?: (post: GalleryPost) => void;
  onTogglePin?: (post: GalleryPost) => void;
  onEdit?: (post: GalleryPost) => void;
  onDelete?: (post: GalleryPost) => void;
}

export const GalleryPostCard: React.FC<GalleryPostCardProps> = ({
  post,
  isLatest = false,
  onOpenLightbox,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const { isAdmin } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawImage = post.cover_image || post.images?.[0]?.image_url;
  const displayImage = imageError || !rawImage ? '/images/avishkaar_poster.jpg' : rawImage;

  const formattedDate = post.event_date
    ? new Date(post.event_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : post.created_at
    ? new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/gallery/${post.slug || post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <article
      className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col h-full group ${
        post.is_pinned
          ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
          : 'border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Post Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-blue-500/20 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center">
            <img
              src="/images/logos/cmrit_csi_logo.jpeg"
              alt="CSI CMRIT"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                CSI CMRIT Chapter
              </h2>
              {post.is_pinned ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                  <Pin className="w-2.5 h-2.5 fill-white" />
                  Pinned
                </span>
              ) : isLatest ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  <Sparkles className="w-2.5 h-2.5" />
                  Latest
                </span>
              ) : null}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
              <span>{post.category || 'General'}</span>
              {formattedDate && (
                <>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Admin Controls (Only visible and accessible to Admins) */}
        {isAdmin && (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl p-1 shrink-0 ml-1">
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePin(post);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  post.is_pinned
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-xs'
                    : 'text-slate-400 hover:text-amber-600 hover:bg-white'
                }`}
                title={post.is_pinned ? 'Unpin post' : 'Pin post to top (Admin)'}
                aria-label={post.is_pinned ? 'Unpin post' : 'Pin post to top'}
              >
                <Pin className={`w-3.5 h-3.5 ${post.is_pinned ? 'fill-amber-600' : ''}`} />
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-all shadow-xs"
                title="Edit post info"
                aria-label="Edit post info"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(post);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-all shadow-xs"
                title="Delete post"
                aria-label="Delete post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Post Media Stage - Preserves Original Aspect Ratio Without Tearing */}
      <div
        onClick={() => onOpenLightbox?.(post)}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-pointer group/stage"
        title="Click to view full photo"
      >
        {/* Soft Ambient Backdrop for proper aesthetic framing */}
        <img
          src={displayImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-110 pointer-events-none"
        />

        {/* Main Image in full original proportion (Never torn or cropped) */}
        <img
          src={displayImage}
          alt={post.title}
          onError={() => setImageError(true)}
          className="relative max-h-full max-w-full object-contain z-10 transition-transform duration-300 group-hover/stage:scale-105 drop-shadow-2xl"
          loading="lazy"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-slate-950/0 group-hover/stage:bg-slate-950/25 transition-all flex items-center justify-center pointer-events-none z-20">
          <span className="opacity-0 group-hover/stage:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold border border-slate-700/80 shadow-xl flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            Click to view full
          </span>
        </div>

        {/* Floating Category Tag */}
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-md text-white border border-slate-700/60 shadow-md">
            {post.category || 'Chapter Visual'}
          </span>
        </div>

        {formattedDate && (
          <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-md text-slate-200 border border-slate-700/60 shadow-md flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>
        )}
      </div>

      {/* Post Content & Actions */}
      <div className="p-4 sm:p-5 bg-white space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          {post.description ? (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal whitespace-pre-line">
              {post.description}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic font-normal">
              Visual capture from Computer Society of India CMRIT Student Chapter.
            </p>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 mt-auto">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Share photo link"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenLightbox?.(post)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-all shadow-xs"
            >
              <Maximize2 className="w-3 h-3 text-blue-400" />
              <span>Full Photo</span>
            </button>
          </div>

          <Link
            to={`/gallery/${post.slug || post.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors hover:translate-x-0.5"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
};
