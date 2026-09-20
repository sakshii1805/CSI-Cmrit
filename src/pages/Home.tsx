import React from 'react';
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
import { mockEvents } from '../data/events';
import { mockAnnouncements } from '../data/announcements';
import { chapterHighlights } from '../data/gallery';

export const Home: React.FC = () => {
  // These will be populated once admins publish content via the dashboard
  const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming').slice(0, 4);
  const latestAnnouncements = mockAnnouncements.slice(0, 4);
  const highlightThumbnails = chapterHighlights.slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. About CSI CMRIT + What We Do + Code Laptop Photo */}
      <HomeAboutRow />

      {/* 3. Explore Our Domains */}
      <ExploreDomains />

      {/* 4. Upcoming Events */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
                // CALENDAR
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight mt-1">
                Upcoming Events &amp; Workshops
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col group"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur-xs">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                      <Link to={`/events/${evt.slug || evt.id}`}>{evt.title}</Link>
                    </h3>
                    <div className="space-y-1 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px]">{evt.date}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700">Open Access</span>
                      <Link
                        to={`/events/${evt.slug || evt.id}`}
                        className="px-3 py-1.5 rounded-md text-xs font-display font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors active:scale-[0.98]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State — Intentional, informative, not generic */
            <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-8 sm:p-10 text-center">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3 shadow-subtle">
                <CalendarX2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-800 mb-1">
                No active event registrations right now
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Next semester workshop schedules and hackathon registrations are being finalized. Check announcements below.
              </p>
              <Link
                to="/announcements"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-display font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Read recent notices</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. Two-Column Dispatch: Latest Announcements (Left) + Chapter Highlights (Right) */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left: Latest Announcements */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <h2 className="text-lg font-display font-bold text-slate-900 tracking-tight">
                    Notice Board
                  </h2>
                </div>
                <Link
                  to="/announcements"
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold text-blue-600 hover:text-blue-700 group"
                >
                  <span>All Notices</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {latestAnnouncements.length > 0 ? (
                <div className="space-y-2.5">
                  {latestAnnouncements.map((ann, idx) => (
                    <Link
                      key={idx}
                      to={`/announcements/${ann.slug}`}
                      className="p-3.5 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80 bg-white transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {ann.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {ann.date}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {ann.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {ann.summary}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty State — Clean and restrained */
                <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-8 text-center">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2.5 shadow-subtle">
                    <BellOff className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-display font-semibold text-slate-700">Notice board is clear</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Official chapter announcements and registrations will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Chapter Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <h2 className="text-lg font-display font-bold text-slate-900 tracking-tight">
                    Chapter Highlights
                  </h2>
                </div>
                <Link
                  to="/highlights"
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold text-blue-600 hover:text-blue-700 group"
                >
                  <span>Visual Archive</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {highlightThumbnails.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {highlightThumbnails.map((item) => (
                    <Link
                      key={item.id}
                      to="/highlights"
                      className="relative aspect-[4/3] rounded-lg overflow-hidden group bg-slate-900 border border-slate-200"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-mono text-white font-medium bg-black/60 px-2 py-0.5 rounded">
                          View
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-8 text-center">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2.5 shadow-subtle">
                    <Camera className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-display font-semibold text-slate-700">Visual archive in progress</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Photographs from upcoming workshops and competitions will be archived here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Flagship Showcase: Smart India Hackathon + Chapter Membership */}
      <section className="py-14 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left: SIH Pillar */}
            <div className="lg:col-span-6 rounded-xl bg-[#091629] p-6 sm:p-8 text-white border border-slate-800 shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-950 border border-blue-800 text-blue-300 font-mono text-[10px] font-medium tracking-wide">
                  FLAGSHIP NATIONAL HACKATHON
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                  Smart India Hackathon (SIH)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  CSI CMRIT acts as an active incubator for student teams participating in India&apos;s largest national engineering competition. We guide teams through problem statement deconstruction, system architecture design, and internal college screening rounds.
                </p>

                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <p className="font-mono text-xs text-slate-400 leading-relaxed">
                    Mentorship focus: Full-Stack Web • Embedded IoT • Healthcare • Agriculture
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/sih"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-[transform,background-color] duration-150 active:scale-[0.98]"
                >
                  <span>Explore SIH Support Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Join CSI CMRIT Chapter */}
            <div className="lg:col-span-6 rounded-xl bg-white border border-slate-200 shadow-card overflow-hidden flex flex-col sm:flex-row items-stretch">
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users2 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-lg font-display font-bold text-slate-900">
                      Join CSI CMRIT
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Open to all undergraduate engineering students of CMRIT across departments.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Priority registration for hands-on bootcamps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>SIH team formation and mentorship support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Collaborative peer study and project circles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span>Official CSI national chapter affiliation</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to="/join"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors active:scale-[0.98]"
                  >
                    <span>Submit Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Student Team Photo with authentic photographic caption */}
              <div className="sm:w-2/5 min-h-[220px] relative bg-slate-900 overflow-hidden group">
                <img
                  src="/images/students_team.jpg"
                  alt="CSI CMRIT Student Cohort"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-3.5">
                  <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/70 backdrop-blur-sm">
                    Student Cohort • Campus Life
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
