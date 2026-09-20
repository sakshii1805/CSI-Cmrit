import React, { useState, useMemo } from 'react';
import { Filter, Camera, Sparkles } from 'lucide-react';
import { chapterHighlights } from '../data/gallery';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { LightboxModal } from '../components/gallery/LightboxModal';
import { ChapterHighlightCategory } from '../types';

export const ChapterHighlights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ChapterHighlightCategory>('All');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const categories: ChapterHighlightCategory[] = [
    'All',
    'Events',
    'Workshops',
    'Hackathons',
    'SIH',
    'Community'
  ];

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return chapterHighlights;
    return chapterHighlights.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null && activePhotoIndex < filteredPhotos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sleek Masthead */}
      <section className="bg-[#081325] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-blue-500/30 bg-blue-950/50 text-blue-400 font-mono text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Visual Media Archive</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Chapter <span className="text-blue-400">Highlights</span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-blue-300/90 mt-3 tracking-wide">
              Documenting hackathons, research labs, workshops, and student delegations.
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl">
              A curated photographic record of CSI CMRIT&apos;s active campus footprint, technical cohorts, competitive wins, and community initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Category Pills Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-mono text-xs font-semibold text-slate-400 mr-2 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              COLLECTION:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all active:scale-[0.98] ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs text-slate-500">
            {filteredPhotos.length === 0
              ? 'NO MEDIA INDEXED'
              : <>INDEXED: <strong className="text-slate-900">{filteredPhotos.length}</strong> / {chapterHighlights.length}</>
            }
          </div>
        </div>

        {/* Highlights Grid or Empty State */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setActivePhotoIndex(index)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center max-w-lg mx-auto shadow-card my-8">
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Archive Standby
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 mb-2">No Visual Records Found</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              {selectedCategory !== 'All'
                ? `No photographs catalogued under "${selectedCategory}".`
                : 'Photographic documentation of chapter activities will be published here.'}
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-5 px-4 py-2 rounded-lg bg-slate-900 text-white font-mono text-xs font-semibold hover:bg-blue-600 transition-colors active:scale-[0.98]"
              >
                View All Records
              </button>
            )}
          </div>
        )}
      </section>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={activePhotoIndex !== null}
        item={activePhoto}
        onClose={() => setActivePhotoIndex(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasNext={activePhotoIndex !== null && activePhotoIndex < filteredPhotos.length - 1}
        hasPrev={activePhotoIndex !== null && activePhotoIndex > 0}
      />
    </div>
  );
};

