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
  Sparkles
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { HomeAboutRow } from '../components/home/HomeAboutRow';
import { eventsService } from '../services/eventsService';
import { announcementsService } from '../services/announcementsService';
import { highlightsService } from '../services/highlightsService';
import { EventItem, AnnouncementItem, ChapterHighlightItem } from '../types';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [highlights, setHighlights] = useState<ChapterHighlightItem[]>([]);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const [evts, anns, hls] = await Promise.all([
          eventsService.getPublishedEvents(),
          announcementsService.getPublishedAnnouncements(),
          highlightsService.getPublishedHighlights()
        ]);
        setEvents(evts.data || []);
        setAnnouncements(anns.data || []);
        setHighlights(hls.data || []);
      } catch (err) {
        console.error('Failed to load home page content:', err);
      }
    }
    loadHomeContent();
  }, []);

  const upcomingEvents = events.slice(0, 4);
  const latestAnnouncements = announcements.slice(0, 4);
  const highlightThumbnails = highlights.slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. About CSI CMRIT + What We Do + Code Laptop Photo */}
      <HomeAboutRow />

      {/* 4. Upcoming Events */}
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
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Register for hands-on technical bootcamps, 24-hour hackathons, and competitive coding sprints hosted by CSI CMRIT.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all shrink-0 active:scale-95"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingEvents.length === 1 ? (
            /* Single Featured Event Showcase (AVISHKAAR) */
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-blue-300 transition-all duration-300 group">
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
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-xs">
                        {upcomingEvents[0].category}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
                        SIH-Pattern Hackathon
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                        Innovate • Build • Make An Impact · Think Build Solve
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {upcomingEvents[0].shortDescription}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Prizes</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">₹35,000 Pool</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">1st: ₹20k · 2nd: ₹10k</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prelims</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">26 Sept 2026</span>
                        <span className="text-[10px] text-blue-600 font-semibold">8-10 min pitch + Q&amp;A</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Team Size</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">6 Members</span>
                        <span className="text-[10px] text-purple-600 font-semibold">CMRIT · Min 1 Girl</span>
                      </div>
                    </div>

                    {/* Coordinators & Registration Info */}
                    <div className="pt-2 text-xs text-slate-500 space-y-1">
                      <p>
                        <strong className="text-slate-700">Student Coordinators:</strong> B. Akshitha (+91 95734 69911) &amp; Medi Sumeet (+91 80748 29165)
                      </p>
                      <p>
                        <strong className="text-slate-700">Fee:</strong> ₹1,200 per team (Applicable only for shortlisted teams)
                      </p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium">CMRIT Campus, Kandlakoya</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 overflow-hidden shadow-subtle hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                >
                  {/* Card Media */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-md">
                        {evt.category}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-400/20 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Registration Open</span>
                      </span>
                    </div>

                    {/* Date Pill at bottom of image */}
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

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                        ₹35,000 Prizes
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
              <Link
                to="/events"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>View Past Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* 5. "Be a part of something bigger" Banner */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#071d3a] via-[#0b284e] to-[#071d3a] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Be a part of something bigger.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Join CSI CMRIT and be a part of an amazing community of tech enthusiasts!
                </p>
              </div>
            </div>

            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/40 transition-colors shrink-0 shadow-sm"
            >
              <span>Join Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Two-Column: Latest Announcements (Left) + Chapter Highlights (Right) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Latest Announcements */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Latest Announcements
                  </h2>
                </div>
                <Link
                  to="/announcements"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {latestAnnouncements.length > 0 ? (
                <div className="space-y-3">
                  {latestAnnouncements.map((ann, idx) => (
                    <Link
                      key={idx}
                      to={`/announcements/${ann.slug || ann.id}`}
                      className="p-4 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20 bg-white transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                          <Megaphone className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {ann.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {ann.summary}
                          </p>
                          <div className="mt-1">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">
                              {ann.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty State — No Announcements */
                <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-subtle">
                    <BellOff className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mb-0.5">No announcements yet</p>
                  <p className="text-[11px] text-slate-500">
                    Important updates from CSI CMRIT will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Gallery
                  </h2>
                </div>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {highlightThumbnails.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {highlightThumbnails.map((item) => (
                    <Link
                      key={item.id}
                      to="/gallery"
                      className="relative aspect-video rounded-xl overflow-hidden group bg-slate-900 border border-slate-200"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-medium bg-black/60 px-2 py-1 rounded">
                          View
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty State — No Chapter Highlights */
                <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-subtle">
                    <Camera className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mb-0.5">No highlights yet</p>
                  <p className="text-[11px] text-slate-500">
                    Photos and moments from CSI CMRIT activities will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
