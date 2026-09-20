import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Megaphone,
  Camera,
  Lightbulb,
  Check,
  ChevronRight,
  Users2,
  CalendarX2,
  BellOff
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { HomeAboutRow } from '../components/home/HomeAboutRow';
import { ExploreDomains } from '../components/home/ExploreDomains';
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

      {/* 3. Explore Our Domains */}
      <ExploreDomains />

      {/* 4. Upcoming Events */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Workshops, competitions, hackathons and more — organized by CSI CMRIT.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col group"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                      <Link to={`/events/${evt.slug || evt.id}`}>{evt.title}</Link>
                    </h3>
                    <div className="space-y-1 text-[11px] text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Free Entry</span>
                      <Link
                        to={`/events/${evt.slug || evt.id}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0f243d] hover:bg-blue-600 transition-colors shadow-xs"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State — No Events */
            <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-subtle">
                <CalendarX2 className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">No upcoming events</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Events and activities will appear here when they are announced by chapter administrators.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Go to Events</span>
                <ArrowRight className="w-3 h-3" />
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

      {/* 7. Bottom Two Cards: SIH (Left) + Join CSI CMRIT (Right) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Card: Smart India Hackathon (SIH) */}
            <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-[#061933] via-[#092244] to-[#061933] p-6 sm:p-8 text-white border border-slate-800 shadow-card flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Smart India Hackathon (SIH)
                </h3>
                <p className="text-xs text-blue-400 font-semibold tracking-wide">
                  Innovate • Build • Make a Difference
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  CSI CMRIT actively supports students participating in SIH — India&apos;s largest open innovation hackathon for engineering students. We guide teams from ideation to prototype presentation.
                </p>

                <div className="pt-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/60">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    SIH updates, participating teams, and chapter achievements will be published here as they are available.
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  to="/sih"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <span>Learn About SIH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Card: Join CSI CMRIT */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 shadow-card overflow-hidden flex flex-col sm:flex-row items-stretch">
              {/* Left Sub-card: Checklist & Button */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Join CSI CMRIT
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Be a part of a vibrant community of learners, creators and innovators.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Skill Development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Hands-on Workshops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Networking Opportunities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Certifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>National &amp; International Events</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to="/join"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0e2238] hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Sub-card: Student Team Photo */}
              <div className="sm:w-2/5 min-h-[200px] relative bg-slate-900">
                <img
                  src="/images/students_team.jpg"
                  alt="CSI CMRIT Students Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
