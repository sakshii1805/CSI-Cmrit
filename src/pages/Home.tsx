import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Megaphone, 
  Camera, 
  Lightbulb, 
  Check, 
  ChevronRight, 
  Clock, 
  Cpu, 
  Users2
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { HomeAboutRow } from '../components/home/HomeAboutRow';
import { ExploreDomains } from '../components/home/ExploreDomains';
import { LightboxModal } from '../components/gallery/LightboxModal';
import { mockEvents } from '../data/events';
import { mockAnnouncements } from '../data/announcements';
import { mockGallery } from '../data/gallery';
import { GalleryItem } from '../types';

export const Home: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Take 4 events for the 4-column event grid
  const upcomingEvents = mockEvents.slice(0, 4);

  // Take 4 announcements for the announcement list
  const announcementsList = [
    {
      day: '18',
      month: 'Sep',
      title: 'SIH 2026 – Internal Round Registration Open!',
      subtitle: 'Show your coding skills and compete with the best minds.',
      tag: 'SIH',
      slug: 'sih-2026-internal-screening',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      day: '15',
      month: 'Sep',
      title: 'Workshop on Cloud Native & Containers',
      subtitle: 'Learn modern Docker, Linux, and Kubernetes technologies.',
      tag: 'Workshop',
      slug: 'workshop-alert-cloud-native',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      day: '10',
      month: 'Sep',
      title: 'CSI Student Membership Drive 2026',
      subtitle: 'Become a part of CSI and unlock new technical opportunities.',
      tag: 'General',
      slug: 'membership-drive-2026-27',
      tagColor: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      day: '05',
      month: 'Sep',
      title: 'Tech Talk: Microservices & AI Systems',
      subtitle: 'An interactive keynote on distributed systems and career growth.',
      tag: 'Events',
      slug: 'codesprint-rules-track-preview',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  // Take 9 photos for the 3x3 gallery grid
  const galleryThumbnails = mockGallery.slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section (with Campus Blend) */}
      <HeroSection />

      {/* 2. About CSI CMRIT + What We Do 6 Cards + Code Laptop Photo */}
      <HomeAboutRow />

      {/* 3. Explore Our Domains (7 Circular Pill Cards) */}
      <ExploreDomains />

      {/* 4. Upcoming Events (4-Column Grid) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Don&apos;t miss out on our exciting events, workshops and competitions!
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col group"
              >
                {/* Image */}
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

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                    <Link to={`/events/${evt.slug || evt.id}`}>{evt.title}</Link>
                  </h3>

                  <div className="space-y-1 text-[11px] text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.date} • {evt.time.split('–')[0].trim()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  {/* Price / Entry & Button */}
                  <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Free Entry
                    </span>
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
        </div>
      </section>

      {/* 5. "Be a part of something bigger" Blue Wave Banner */}
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

      {/* 6. Two-Column Split Section: Latest Announcements (Left 50%) + Gallery (Right 50%) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 50%: Latest Announcements */}
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

              {/* Announcement Rows */}
              <div className="space-y-3">
                {announcementsList.map((ann, idx) => (
                  <Link
                    key={idx}
                    to={`/announcements/${ann.slug}`}
                    className="p-4 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20 bg-white transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Square Date Box */}
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                        <span className="text-sm font-black text-blue-600 leading-none">
                          {ann.day}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                          {ann.month}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {ann.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {ann.subtitle}
                        </p>
                        <div className="mt-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${ann.tagColor}`}>
                            {ann.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right 50%: Gallery 3x3 Grid */}
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

              {/* 3x3 Photo Thumbnails Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {galleryThumbnails.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPhoto(item)}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-200"
                    role="button"
                    tabIndex={0}
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
                  </div>
                ))}
              </div>
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
              {/* Glowing decorative circuit / AI background */}
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Smart India Hackathon (SIH)
                </h3>
                <p className="text-xs text-blue-400 font-semibold tracking-wide">
                  Innovate • Build • Make a Difference
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  CSI CMRIT actively participates in SIH, the world&apos;s largest open innovation platform for students. We encourage ideas, build solutions and create real-world impact.
                </p>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-left">
                    <span className="text-xl sm:text-2xl font-black text-white">5+</span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Participations</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-left">
                    <span className="text-xl sm:text-2xl font-black text-white">10+</span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Projects Submitted</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-left">
                    <span className="text-xl sm:text-2xl font-black text-white">4</span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">National Level Wins</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  to="/sih"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <span>Explore SIH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Card: Join CSI CMRIT (Split with Student Team Photo) */}
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
                      <span>National & International Events</span>
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

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!selectedPhoto}
        item={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
};
