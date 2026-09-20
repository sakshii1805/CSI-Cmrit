import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, X, AlertCircle, CalendarX2 } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { EventCard } from '../components/events/EventCard';
import { EventCategory, EventItem } from '../types';

export const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as EventCategory) || 'All';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(initialCategory);
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc'>('date-asc');

  const categories: EventCategory[] = [
    'All',
    'Workshop',
    'Hackathon',
    'Competition',
    'Technical Session',
    'Other'
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await eventsService.getPublishedEvents();
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch published events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCategorySelect = (cat: EventCategory) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setTimeFilter('all');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const filteredEvents = useMemo(() => {
    const now = new Date().toISOString().split('T')[0];

    return events
      .filter((event) => {
        // Category filter (support singular & plural)
        if (selectedCategory !== 'All') {
          const catNorm = event.category?.toLowerCase() || '';
          const selNorm = selectedCategory.toLowerCase().replace(/s$/, '');
          if (!catNorm.includes(selNorm)) {
            return false;
          }
        }

        // Timefilter
        const eventDate = event.event_date || event.date || '';
        if (timeFilter === 'upcoming' && eventDate < now) {
          return false;
        }
        if (timeFilter === 'past' && eventDate >= now) {
          return false;
        }

        // Search filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesTitle = event.title?.toLowerCase().includes(q) || false;
          const matchesDesc = event.description?.toLowerCase().includes(q) || false;
          const matchesVenue = event.venue?.toLowerCase().includes(q) || false;
          return matchesTitle || matchesDesc || matchesVenue;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.event_date || a.date || 0).getTime();
        const timeB = new Date(b.event_date || b.date || 0).getTime();
        return sortBy === 'date-desc' ? timeB - timeA : timeA - timeB;
      });
  }, [events, searchQuery, selectedCategory, timeFilter, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
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
              Chapter Initiatives
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-3">
              Events &amp; Workshops
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Hands-on tech bootcamps, developer sprints, hackathons, and technical symposiums hosted by the CSI CMRIT Chapter.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Controls Bar: Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, venue, or topics..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
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

            {/* Time Filter & Sort Dropdowns */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Status:</span>
              </div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc')}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="date-asc">Date: Upcoming First</option>
                <option value="date-desc">Date: Newest First</option>
              </select>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Active Filter feedback */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
          <div>
            {isLoading ? (
              'Checking upcoming schedule...'
            ) : (
              <>
                Showing <span className="font-semibold text-slate-800">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
                {selectedCategory !== 'All' && <span> in <strong className="text-blue-600">{selectedCategory}</strong></span>}
                {timeFilter !== 'all' && <span> ({timeFilter})</span>}
              </>
            )}
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

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-mono text-slate-500">Loading published chapter events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : events.length === 0 ? (
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
