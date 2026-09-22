import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Megaphone,
  Camera,
  Lightbulb,
  ChevronRight,
  CalendarX2,
  BellOff,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Shield,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { HomeAboutRow } from '../components/home/HomeAboutRow';
import { WhyJoinCsi } from '../components/home/WhyJoinCsi';
import { eventsService } from '../services/eventsService';
import { announcementsService } from '../services/announcementsService';
import { highlightsService } from '../services/highlightsService';
import { EventItem, AnnouncementItem, ChapterHighlightItem } from '../types';
import { mockEvents } from '../data/events';
import { mockAnnouncements } from '../data/announcements';
import { mockGallery } from '../data/gallery';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { EventModal } from '../components/admin/in-place/EventModal';
import { AnnouncementModal } from '../components/admin/in-place/AnnouncementModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const Home: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(mockAnnouncements);
  const [highlights, setHighlights] = useState<ChapterHighlightItem[]>(mockGallery as any);

  // In-place admin modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);

  const loadHomeContent = async () => {
    try {
      const [evts, anns, hls] = await Promise.all([
        eventsService.getPublishedEvents(),
        announcementsService.getPublishedAnnouncements(),
        highlightsService.getPublishedHighlights()
      ]);
      const loadedEvents = (evts.data && evts.data.length > 0) ? evts.data : mockEvents;
      setEvents(loadedEvents);
      setAnnouncements(anns.data || []);
      setHighlights(hls.data || []);
    } catch (err) {
      console.error('Failed to load home page content:', err);
      setEvents(mockEvents);
    }
  };

  useEffect(() => {
    loadHomeContent();

    const handleUpdate = () => {
      loadHomeContent();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, []);

  const handleDeleteEventConfirm = async () => {
    if (!deletingEvent) return;
    try {
      const res = await eventsService.deleteEvent(deletingEvent.id);
      if (!res.success) throw new Error(res.error);
      showToast('Event removed successfully.', 'info');
      setDeletingEvent(null);
      loadHomeContent();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete event', 'error');
    }
  };

  const upcomingEvents = events.slice(0, 4);
  const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const otherEvents = upcomingEvents.slice(1);
  const latestAnnouncements = announcements.slice(0, 4);
  const highlightThumbnails = highlights.slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. About CSI CMRIT + What We Do + Code Laptop Photo */}
      <HomeAboutRow />

      {/* 3. Upcoming Events & Featured Hackathon Showcase */}
      <section className="py-20 lg:py-24 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Chapter Calendar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Upcoming Events &amp; Workshops
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Event</span>
                </button>
              )}

              <Link
                to="/events"
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 shadow-md shadow-slate-900/10 hover:shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <span>Explore All Events</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {upcomingEvents.length === 1 ? (
            /* Single Featured Event Showcase (AVISHKAAR) */
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-blue-300 transition-all duration-300 group relative">
              {/* Admin Overlay Controls */}
              {isAdmin && (
                <div className="bg-slate-900/90 border-b border-slate-800 text-white px-6 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Featured Event Controls</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEvent(upcomingEvents[0]);
                        setEventModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingEvent(upcomingEvents[0])}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Poster Preview (5 cols) */}
                <div className="lg:col-span-5 relative bg-slate-950 overflow-hidden flex items-center justify-center p-4 sm:p-6">
                  <div className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={upcomingEvents[0].image}
                      alt={upcomingEvents[0].title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className="text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                        Grand Finale: 9 – 10 Oct 2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Details (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Badges */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        Registration Open
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        <Link to={`/events/${upcomingEvents[0].slug || upcomingEvents[0].id}`}>
                          {upcomingEvents[0].title}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide mt-1">
                        Innovate • Build • Make An Impact
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {upcomingEvents[0].shortDescription || "CMRIT's SIH pattern hackathon with 20 pre-selected problem statements, ₹35,000 cash prizes, and mentorship for CMRIT students."}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Prizes</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">₹35,000 Pool</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prelims</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">26 Sept 2026</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Team Size</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">6 Members</span>
                      </div>
                    </div>

                    {/* Coordinators & Registration Info */}
                    <div className="pt-2 text-xs text-slate-500 space-y-1">
                      <p>
                        <strong className="text-slate-700">Student Coordinators:</strong> B. Akshitha (+91 95734 69911) <br />&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; Medi Sumeet (+91 80748 29165)
                      </p>
                      <br />
                      <p>
                        <strong className="text-slate-700">Fee:</strong> ₹1,200 per team (Applicable only for shortlisted teams)
                      </p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium">CMRGI, Kandlakoya</span>
                    </div>
                    <Link
                      to={`/events/${upcomingEvents[0].slug || upcomingEvents[0].id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      <span>View Full Event Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : upcomingEvents.length > 1 ? (
            /* Multiple Events: Featured + Grid */
            <div className="space-y-8">
              {/* Featured Event Showcase */}
              <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-blue-300 transition-all duration-300 group">
                {isAdmin && (
                  <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Featured Event Controls</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEvent(upcomingEvents[0]);
                          setEventModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingEvent(upcomingEvents[0])}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  <div className="lg:col-span-5 relative bg-slate-950 overflow-hidden flex items-center justify-center p-4 sm:p-6">
                    <div className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                      <img
                        src={upcomingEvents[0].image}
                        alt={upcomingEvents[0].title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 inset-x-3 text-center">
                        <span className="text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                          {upcomingEvents[0].date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Registration Open
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                          <Link to={`/events/${upcomingEvents[0].slug || upcomingEvents[0].id}`}>
                            {upcomingEvents[0].title}
                          </Link>
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide mt-1">
                          {upcomingEvents[0].category} • CSI CMRIT
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {upcomingEvents[0].shortDescription}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        to={`/events/${upcomingEvents[0].slug || upcomingEvents[0].id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        <span>View Full Event Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Events Grid */}
              {otherEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-6">
                  {otherEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 overflow-hidden shadow-subtle hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative"
                    >
                      {/* Admin Card Action Overlay */}
                      {isAdmin && (
                        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-md">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingEvent(evt);
                              setEventModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-blue-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Event"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setDeletingEvent(evt);
                            }}
                            className="p-1 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-slate-800 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Card Media */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-md">
                            {evt.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white font-medium drop-shadow-md">
                          <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{evt.date}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            <Link to={`/events/${evt.slug || evt.id}`}>
                              {evt.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {evt.shortDescription}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                            Active Event
                          </span>
                          <Link
                            to={`/events/${evt.slug || evt.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 group-hover:bg-blue-600 transition-colors shadow-xs"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-12 text-center max-w-xl mx-auto shadow-subtle">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
                <CalendarX2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No upcoming events right now</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Stay tuned! New workshops, competitions and hackathons are announced regularly.
              </p>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Event</span>
                </button>
              ) : (
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span>View Past Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Join CSI CMRIT Section */}
      <WhyJoinCsi />

      {/* In-Place Event Modal for Home page */}
      <EventModal
        isOpen={eventModalOpen}
        eventToEdit={editingEvent}
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={() => {
          loadHomeContent();
        }}
      />

      {/* In-Place Announcement Modal for Home page */}
      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        onSuccess={() => {
          loadHomeContent();
        }}
      />

      {/* Confirmation Dialog for Deleting Event */}
      <ConfirmDialog
        isOpen={!!deletingEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Event"
        variant="danger"
        onConfirm={handleDeleteEventConfirm}
        onClose={() => setDeletingEvent(null)}
      />
    </div>
  );
};
