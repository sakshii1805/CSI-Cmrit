import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, AlertCircle, BellOff, Loader2 } from 'lucide-react';
import { AnnouncementCard } from '../components/announcements/AnnouncementCard';
import { AnnouncementCategory, AnnouncementItem } from '../types';
import { announcementsService } from '../services/announcementsService';

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory>('All');

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const res = await announcementsService.getPublishedAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();

    const handleUpdate = () => {
      loadAnnouncements();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, []);

  const categories: AnnouncementCategory[] = [
    'All',
    'General',
    'Hackathon',
    'Workshop',
    'Event',
    'Registration',
    'Opportunity'
  ];

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      if (selectedCategory !== 'All' && ann.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ann.title.toLowerCase().includes(q);
        const matchesSummary = (ann.summary || '').toLowerCase().includes(q);
        const matchesTags = (ann.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesSummary || matchesTags;
      }
      return true;
    });
  }, [announcements, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Banner */}
      <section className="bg-slate-950 text-white py-14 sm:py-18 border-b border-slate-800 relative overflow-hidden">
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
              Notice Board
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-3">
              Announcements
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Official updates, registration notices, and community opportunities from CSI CMRIT Chapter — published by chapter administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Search & Filter bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements, topics, or keywords..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              {loading ? (
                'Loading notices...'
              ) : announcements.length === 0 ? (
                'No announcements published yet'
              ) : (
                <><strong className="text-slate-800">{filteredAnnouncements.length}</strong> items</>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          /* Primary empty state: website is new, no announcements published yet */
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-5">
              <BellOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">No announcements yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Important updates from CSI CMRIT will appear here when published by chapter administrators.
            </p>
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        ) : (
          /* Filter/search empty state */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Announcements Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              No notices match your current search query or category filter.
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
