import React from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { GalleryPost } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface GalleryPostCardProps {
  post: GalleryPost;
  onEdit?: (post: GalleryPost) => void;
  onDelete?: (post: GalleryPost) => void;
}

export const GalleryPostCard: React.FC<GalleryPostCardProps> = ({ post, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-subtle hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* In-Place Admin Controls */}
      {isAdmin && (onEdit || onDelete) && (
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-md">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(post);
              }}
              className="p-1 rounded text-blue-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Edit photo info"
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
              className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-slate-800 transition-colors"
              title="Delete photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <Link
        to={`/gallery/${post.slug || post.id}`}
        className="block w-full h-full"
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
            <ImageIcon className="w-12 h-12 text-white/40" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/10">
              {post.category}
            </span>
            {(post.image_count ?? 0) > 0 && (
              <span className="text-[10px] font-bold text-white/80 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {post.image_count} photos
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
            {post.title}
          </h3>
          {post.event_date && (
            <p className="text-[11px] text-white/60 mt-1 font-medium">
              {new Date(post.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};
