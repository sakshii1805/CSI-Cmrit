import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Camera } from 'lucide-react';
import { highlightsService } from '../services/highlightsService';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { CommentSection } from '../components/common/CommentSection';
import { ChapterHighlightCategory, ChapterHighlightItem } from '../types';

export const ChapterHighlights: React.FC = () => {
  const [highlights, setHighlights] = useState<ChapterHighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<ChapterHighlightCategory>('All');

  const categories: ChapterHighlightCategory[] = [
    'All',
    'Events',
    'Workshops',
    'Hackathons',
    'Community'
  ];

  const fetchHighlights = async () => {
    try {
      setIsLoading(true);
      const res = await highlightsService.getPublishedHighlights();
      setHighlights(res.data);
    } catch (err) {
      console.error('Error fetching highlights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();

    const handleUpdate = () => {
      fetchHighlights();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, []);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return highlights;
    return highlights.filter((item) => item.category === selectedCategory);
  }, [highlights, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white pt-24 sm:pt-28 pb-12 sm:pb-16 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
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
        {/* Category Pills Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter by:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {isLoading ? (
              'Loading archives...'
            ) : filteredPhotos.length === 0 ? (
              'No highlights published yet'
            ) : (
              <>Showing <strong className="text-slate-800">{filteredPhotos.length}</strong> {filteredPhotos.length === 1 ? 'highlight' : 'highlights'}</>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono text-slate-500">Retrieving official visual archives...</p>
          </div>
        ) : filteredPhotos.length > 0 ? (
          /* Highlights Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredPhotos.map((item) => (
               <GalleryCard
                 key={item.id}
                 item={item}
               />
             ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-5">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">No highlights yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              {selectedCategory !== 'All'
                ? `No highlights found in the "${selectedCategory}" category.`
                : 'Photos and moments from CSI CMRIT activities will appear here when published by the chapter administrators.'}
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
              >
                View All Categories
              </button>
            )}
          </div>
        )}

        {/* Public Comments Section for Chapter Highlights */}
        <CommentSection
          targetType="highlight"
          targetId="general-gallery"
          targetTitle="Chapter Gallery & Archives"
        />
       </section>
     </div>
   );
 };
