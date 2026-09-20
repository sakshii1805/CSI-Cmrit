import React, { useState, useMemo } from 'react';
import { Search, Filter, X, AlertCircle, Inbox, Bell } from 'lucide-react';
import { mockAnnouncements } from '../data/announcements';
import { AnnouncementCard } from '../components/announcements/AnnouncementCard';
import { AnnouncementCategory } from '../types';

export const Announcements: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory>('All');

  const categories: AnnouncementCategory[] = [
    'All',
    'General',
    'Hackathon',
    'Workshop',
    'Registration',
    'Opportunity'
  ];

  const filteredAnnouncements = useMemo(() => {
    return mockAnnouncements.filter((ann) => {
      if (selectedCategory !== 'All' && ann.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ann.title.toLowerCase().includes(q);
        const matchesSummary = ann.summary.toLowerCase().includes(q);
        const matchesTags = ann.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesSummary || matchesTags;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sleek Masthead */}
      <section className="bg-[#081325] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-blue-500/30 bg-blue-950/50 text-blue-400 font-mono text-xs uppercase tracking-wider mb-4">
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Circulars &amp; Dispatch</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Announcements &amp; <span className="text-blue-400">Notices</span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-blue-300/90 mt-3 tracking-wide">
              Official circulars, screening schedules, and competition alerts.
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl">
              All official student dispatches, screening calls, registration deadlines, and department notices published by the CSI CMRIT executive committee.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Search & Filter bar */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars, topics, or keywords..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
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

            <div className="font-mono text-xs text-slate-500 self-end sm:self-center">
              {mockAnnouncements.length === 0
                ? 'NO DISPATCHES PUBLISHED'
                : <>DISPATCHES: <strong className="text-slate-900">{filteredAnnouncements.length}</strong> / {mockAnnouncements.length}</>
              }
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-3 border-t border-slate-100">
            <span className="font-mono text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              CATEGORY:
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
        </div>

        {/* Content */}
        {mockAnnouncements.length === 0 ? (
          /* Primary empty state */
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center max-w-lg mx-auto shadow-card my-8">
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Archive Standby
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 mb-2">No Active Circulars</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              Important updates and circulars from CSI CMRIT will be indexed here as published.
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
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-card my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 mb-1">No Matching Dispatches</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5">
              No circulars match your current query or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-mono text-xs font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

