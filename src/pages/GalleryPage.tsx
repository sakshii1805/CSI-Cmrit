import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Camera, Search, X, Loader2 } from 'lucide-react';
import { galleryService } from '../services/galleryService';
import { GalleryPostCard } from '../components/gallery/GalleryPostCard';
import { GalleryPost, GalleryCategory } from '../types';

export const GalleryPage: React.FC = () => {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      <section className="bg-slate-950 text-white py-14 sm:py-18 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
              Visual Archives
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-3">
              Gallery
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Photos and moments from CSI CMRIT activities, events, workshops, and chapter life — published by chapter administrators.
            </p>
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

            <div className="text-xs text-slate-500 font-medium">
              {isLoading ? (
                'Loading gallery...'
              ) : (
                <>
                  <strong className="text-slate-800">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'post' : 'posts'}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
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

        {/* Content */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading gallery...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <GalleryPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-5">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">No gallery posts yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Gallery posts will appear here when published by chapter administrators.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <h3 className="text-base font-bold text-slate-900 mb-1">No Posts Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              No gallery posts match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
