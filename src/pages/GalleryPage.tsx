import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Camera, Search, X, Loader2, ChevronLeft, ChevronRight, Plus, Shield } from 'lucide-react';
import { galleryService } from '../services/galleryService';
import { GalleryPostCard } from '../components/gallery/GalleryPostCard';
import { GalleryPost, GalleryCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { GalleryModal } from '../components/admin/in-place/GalleryModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const avishkarPromoImages = [
  '/images/avishkar_promo_! (1).png',
  '/images/avishkar_promo_! (2).png',
  '/images/avishkar_promo_! (3).png',
  '/images/avishkaar_poster.jpg',
];

export const GalleryPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await galleryService.getPublishedGalleryPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching gallery posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const handleUpdate = () => {
      fetchPosts();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % avishkarPromoImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
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
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
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
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
                Gallery
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Photos and moments from CSI CMRIT activities, events, workshops, and chapter life.
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

      {/* Main Content Area */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gallery posts..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AVISHKAAR 2026 Promotion Carousel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Featured Promotion
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                AVISHKAAR 2026
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselIndex((prev) => (prev - 1 + avishkarPromoImages.length) % avishkarPromoImages.length)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Previous promo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIndex((prev) => (prev + 1) % avishkarPromoImages.length)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Next promo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden shadow-subtle border border-slate-200 bg-slate-900">
            <img
              src={avishkarPromoImages[carouselIndex]}
              alt="AVISHKAAR 2026 Promo"
              className="w-full h-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
              <span>AVISHKAAR 2026 Promotional Series</span>
              <span>{carouselIndex + 1} / {avishkarPromoImages.length}</span>
            </div>
          </div>
        </div>

        {/* Gallery Posts Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-xs font-mono">Loading moments...</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <GalleryPostCard
                key={post.id}
                post={post}
                onEdit={(p) => {
                  setEditingPost(p);
                  setModalOpen(true);
                }}
                onDelete={(p) => setDeletingPost(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No moments found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              No gallery photos match your selected filter.
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
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </section>

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
