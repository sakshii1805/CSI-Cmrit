import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, AlertCircle, CalendarX2, Plus, Shield } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { EventCard } from '../components/events/EventCard';
import { EventCategory, EventItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { EventModal } from '../components/admin/in-place/EventModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const Events: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as EventCategory) || 'All';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(initialCategory);

  // In-place modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);

  const categories: EventCategory[] = [
    'All',
    'Workshop',
    'Hackathon',
    'Competition',
    'Technical Session',
    'Other'
  ];

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = isAdmin
        ? await eventsService.adminListEvents()
        : await eventsService.getPublishedEvents();
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const handleUpdate = () => {
      fetchEvents();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, [isAdmin]);

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
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const handleTogglePublish = async (event: EventItem) => {
    try {
      const currentStatus = (event.status === 'published' || event.is_published !== false) ? 'published' : 'draft';
      const res = await eventsService.toggleEventPublish(event.id, currentStatus);
      if (!res.success) throw new Error(res.error);
      showToast(`Event status updated to ${currentStatus === 'published' ? 'draft' : 'published'}`, 'success');
      fetchEvents();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle publish status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    try {
      const res = await eventsService.deleteEvent(deletingEvent.id);
      if (!res.success) throw new Error(res.error);
      showToast('Event deleted successfully.', 'info');
      setDeletingEvent(null);
      fetchEvents();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete event', 'error');
    }
  };

  const handleTogglePin = async (event: EventItem) => {
    try {
      const res = await eventsService.togglePinEvent(event.id);
      if (!res.success) throw new Error(res.error);
      showToast(res.is_pinned ? 'Event pinned to top!' : 'Event unpinned', 'success');
      fetchEvents();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle pin', 'error');
    }
  };

  const filteredEvents = useMemo(() => {
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
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        const timeA = new Date(a.event_date || a.date || 0).getTime();
        const timeB = new Date(b.event_date || b.date || 0).getTime();
        return timeB - timeA;
      });
  }, [events, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14 border-b border-slate-800 relative overflow-hidden w-full max-w-full">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md inline-block">
                Chapter Initiatives
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mt-2 sm:mt-3 mb-2 sm:mb-3">
                Events &amp; Workshops
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
                Hands-on tech bootcamps, developer sprints, hackathons, and technical symposiums hosted by the CSI CMRIT Chapter.
              </p>
            </div>

            {/* Admin In-Place Create Button */}
            {isAdmin && (
              <div className="shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventModalOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Event</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full flex-1">
        {/* Controls Bar: Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-subtle mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative w-full md:max-w-md">
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

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto min-w-0 max-w-full pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-xs px-3 sm:px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all shrink-0 ${
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

        {/* Results Counter & Active Filter feedback */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mb-6 font-medium gap-2">
          <div>
            {isLoading ? (
              'Checking upcoming schedule...'
            ) : (
              <>
                Showing <span className="font-semibold text-slate-800">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
                {selectedCategory !== 'All' && <span> in <strong className="text-blue-600">{selectedCategory}</strong></span>}
                {isAdmin && <span className="block sm:inline sm:ml-2 text-blue-600 font-semibold">(Admin View: Published + Drafts)</span>}
              </>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-slate-200/60 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(e) => {
                  setEditingEvent(e);
                  setEventModalOpen(true);
                }}
                onDelete={(e) => setDeletingEvent(e)}
                onTogglePublish={handleTogglePublish}
                onTogglePin={isAdmin ? handleTogglePin : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CalendarX2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No matching events found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn't find any events matching your selected filter or search terms.
            </p>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setEventModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Add Event Now
              </button>
            ) : (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* In-Place Event Modal */}
      <EventModal
        isOpen={eventModalOpen}
        eventToEdit={editingEvent}
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={() => {
          fetchEvents();
        }}
      />

      {/* Confirmation Dialog for Deleting Event */}
      <ConfirmDialog
        isOpen={!!deletingEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Event"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingEvent(null)}
      />
    </div>
  );
};
