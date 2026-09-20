import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, X, AlertCircle, CalendarX2 } from 'lucide-react';
import { mockEvents } from '../data/events';
import { EventCard } from '../components/events/EventCard';
import { EventCategory } from '../types';

export const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as EventCategory) || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(initialCategory);
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc'>('date-desc');

  const categories: EventCategory[] = [
    'All',
    'Workshops',
    'Hackathons',
    'Competitions',
    'Technical Sessions',
    'Other'
  ];

  const filteredEvents = useMemo(() => {
    return mockEvents
      .filter((event) => {
        // Category filter
        if (selectedCategory !== 'All' && event.category !== selectedCategory) {
          return false;
        }

        // Timefilter
        if (timeFilter === 'upcoming' && event.status !== 'upcoming') {
          return false;
        }
        if (timeFilter === 'past' && event.status !== 'completed') {
          return false;
        }

        // Search filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesTitle = event.title.toLowerCase().includes(q);
          const matchesDesc = event.shortDescription.toLowerCase().includes(q) || event.description.toLowerCase().includes(q);
          const matchesVenue = event.venue.toLowerCase().includes(q);
          const matchesSpeaker = event.speaker?.name.toLowerCase().includes(q);
          return matchesTitle || matchesDesc || matchesVenue || !!matchesSpeaker;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.isoDate).getTime();
        const timeB = new Date(b.isoDate).getTime();
        return sortBy === 'date-desc' ? timeB - timeA : timeA - timeB;
      });
  }, [searchQuery, selectedCategory, timeFilter, sortBy]);

  const handleCategoryChange = (cat: EventCategory) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setTimeFilter('all');
    setSearchParams({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Header Banner */}
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
              Events Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-3">
              Events
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Discover workshops, competitions, hackathons, technical sessions and more organized by CSI CMRIT.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Search & Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle mb-8 space-y-4">
          {/* Top Row: Search Input + Sorting */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, topic, or venue..."
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

            {/* Time Filter & Sort Dropdown */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTimeFilter('upcoming')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeFilter === 'upcoming'
                      ? 'bg-white text-blue-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setTimeFilter('past')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeFilter === 'past'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Past
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>
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
                onClick={() => handleCategoryChange(cat)}
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

        {/* Results Count & Active Filters Indicator */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
            {selectedCategory !== 'All' && <span> in <strong className="text-blue-600">{selectedCategory}</strong></span>}
            {timeFilter !== 'all' && <span> ({timeFilter})</span>}
          </div>

          {(searchQuery || selectedCategory !== 'All' || timeFilter !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Events Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : mockEvents.length === 0 ? (
          /* Primary empty state: No events have been published yet */
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-5">
              <CalendarX2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">No upcoming events</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              Events and activities will appear here when they are announced by chapter administrators.
            </p>
          </div>
        ) : (
          /* Filter/search empty state: Events exist but none match the current filters */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Events Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              We couldn&apos;t find any events matching your current filters or search terms.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
