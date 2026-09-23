import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Filter,
  Camera,
  Search,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Share2,
  Maximize2,
  Pin
} from 'lucide-react';
import { galleryService } from '../services/galleryService';
import { GalleryPostCard } from '../components/gallery/GalleryPostCard';
import { GalleryPost, GalleryCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { GalleryModal } from '../components/admin/in-place/GalleryModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const GalleryPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fullscreen Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // In-place modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<GalleryPost | null>(null);

  const categories: GalleryCategory[] = [
    'All',
    'Events',
    'Workshops',
    'Hackathons',
    'Community',
    'Other',
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await galleryService.getPublishedGalleryPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching gallery posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    const handleUpdate = () => {
      fetchPosts();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, [fetchPosts]);

  // Sort: Pinned items first, then latest stack order (newest first)
  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        const timeA = new Date(a.created_at || a.event_date || 0).getTime();
        const timeB = new Date(b.created_at || b.event_date || 0).getTime();
        return timeB - timeA;
      });
  }, [posts, selectedCategory, searchQuery]);

  // Fullscreen keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' && filteredPosts.length > 0) {
        setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredPosts.length);
      }
      if (e.key === 'ArrowLeft' && filteredPosts.length > 0) {
        setLightboxIndex((prev) => ((prev ?? 0) - 1 + filteredPosts.length) % filteredPosts.length);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, filteredPosts.length]);

  const activeLightboxPost = lightboxIndex !== null && filteredPosts[lightboxIndex]
    ? filteredPosts[lightboxIndex]
    : null;

  const handleOpenLightbox = (post: GalleryPost) => {
    const idx = filteredPosts.findIndex((p) => p.id === post.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    } else {
      setLightboxIndex(0);
    }
  };

  const handleTogglePin = async (post: GalleryPost) => {
    try {
      const res = await galleryService.togglePinGalleryPost(post.id);
      if (!res.success) throw new Error(res.error);
      showToast(res.is_pinned ? 'Photo pinned to top!' : 'Photo unpinned', 'success');
      fetchPosts();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle pin', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;
    try {
      const res = await galleryService.deleteGalleryPost(deletingPost.id);
      if (!res.success) throw new Error(res.error);
      showToast('Photo removed from gallery.', 'info');
      setDeletingPost(null);
      fetchPosts();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete photo', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Banner with Navbar Top Clearance */}
      <section className="bg-slate-950 text-white pt-24 sm:pt-28 pb-10 sm:pb-12 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
                Visual Archives
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-3">
                Gallery &amp; Chapter Moments
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Photos, hackathons, and technical milestones from Computer Society of India CMRIT Student Chapter.
              </p>
            </div>

            {/* Admin Add Photo Button */}
            {isAdmin && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Photo to Gallery</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area: Side-by-Side Responsive Grid */}
      <main className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gallery posts, topics, keywords..."
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid (One beside one: 2-3 columns, stack-ordered with pinned items first) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-xs font-mono">Loading gallery...</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {filteredPosts.map((post, index) => (
              <GalleryPostCard
                key={post.id}
                post={post}
                isLatest={index === 0 && !post.is_pinned}
                onOpenLightbox={handleOpenLightbox}
                onTogglePin={isAdmin ? handleTogglePin : undefined}
                onEdit={(p) => {
                  setEditingPost(p);
                  setModalOpen(true);
                }}
                onDelete={(p) => setDeletingPost(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3 text-purple-600">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No moments found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {selectedCategory !== 'All' || searchQuery
                ? 'No gallery posts match your search or filter.'
                : 'No chapter moments published yet.'}
            </p>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
              >
                + Add Photo Now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Fullscreen Lightbox for Any Clicked Post */}
      {activeLightboxPost && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors focus:outline-none"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation: Previous */}
          {filteredPosts.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => ((prev ?? 0) - 1 + filteredPosts.length) % filteredPosts.length);
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all focus:outline-none shadow-xl"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Navigation: Next */}
          {filteredPosts.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredPosts.length);
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all focus:outline-none shadow-xl"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Modal Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[72vh] w-full flex items-center justify-center">
              <img
                src={activeLightboxPost.cover_image || activeLightboxPost.images?.[0]?.image_url || '/images/avishkaar_poster.jpg'}
                alt={activeLightboxPost.title}
                onError={(e) => {
                  e.currentTarget.src = '/images/avishkaar_poster.jpg';
                }}
                className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Bottom details */}
            <div className="mt-4 text-center max-w-xl px-4">
              <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
                {activeLightboxPost.is_pinned && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-white" />
                    Pinned
                  </span>
                )}
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
                  {activeLightboxPost.category || 'Chapter Visual'}
                </span>
                {lightboxIndex !== null && (
                  <span className="text-xs text-slate-400 font-mono">
                    {lightboxIndex + 1} of {filteredPosts.length}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {activeLightboxPost.title}
              </h4>
              {activeLightboxPost.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {activeLightboxPost.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* In-Place Gallery Modal */}
      <GalleryModal
        isOpen={modalOpen}
        postToEdit={editingPost}
        onClose={() => {
          setModalOpen(false);
          setEditingPost(null);
        }}
        onSuccess={() => {
          fetchPosts();
        }}
      />

      {/* Confirmation Dialog for Deleting Photo */}
      <ConfirmDialog
        isOpen={!!deletingPost}
        title="Delete Photo"
        message={`Are you sure you want to remove "${deletingPost?.title}" from the gallery?`}
        confirmLabel="Delete Photo"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingPost(null)}
      />
    </div>
  );
};
export default GalleryPage;
