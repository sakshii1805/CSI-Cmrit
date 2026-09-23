import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ImageIcon, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { galleryService } from '../services/galleryService';
import { CommentSection } from '../components/common/CommentSection';
import { GalleryPost, GalleryImage } from '../types';

export const GalleryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<GalleryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await galleryService.getGalleryPostBySlug(id);
        setPost(res.data);
      } catch (err) {
        console.error('Error loading gallery post:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const images: GalleryImage[] = post?.images || [];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
  };
  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) setLightboxIndex(lightboxIndex + 1);
  };

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Loading gallery post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <div className="py-32 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Gallery Post Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">This gallery post may have been removed or unpublished.</p>
          <Link to="/gallery" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-950 text-white pt-24 sm:pt-28 pb-10 sm:pb-14 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Gallery
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
            {post.event_date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              {images.length} {images.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Description */}
        {post.description && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 mb-8 shadow-subtle">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{post.description}</p>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 shadow-subtle hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-center justify-center border border-slate-200/80"
              >
                {/* Soft ambient blur backdrop */}
                <img
                  src={img.image_url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-110 pointer-events-none"
                />
                <img
                  src={img.image_url}
                  alt={img.caption || `Photo ${idx + 1}`}
                  className="relative max-h-full max-w-full object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors z-20" />
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <p className="text-[11px] text-white font-medium line-clamp-2">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center mb-10">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No images have been added to this gallery post yet.</p>
          </div>
        )}

        {/* Comments */}
        <CommentSection
          targetType="gallery_post"
          targetId={post.id}
          targetTitle={post.title}
        />
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].caption || ''}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            {images[lightboxIndex].caption && (
              <p className="text-sm text-white/80 mt-4 text-center max-w-lg">
                {images[lightboxIndex].caption}
              </p>
            )}
            <p className="text-xs text-white/40 mt-2">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
