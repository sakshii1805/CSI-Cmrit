import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles, BookOpen, Layers, Users } from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { WhatWeDo } from '../components/home/WhatWeDo';
import { SihFeature } from '../components/home/SihFeature';
import { EventCard } from '../components/events/EventCard';
import { AnnouncementCard } from '../components/announcements/AnnouncementCard';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { LightboxModal } from '../components/gallery/LightboxModal';
import { Button } from '../components/common/Button';
import { mockEvents } from '../data/events';
import { mockAnnouncements } from '../data/announcements';
import { mockGallery } from '../data/gallery';
import { GalleryItem } from '../types';

export const Home: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const upcomingEvents = mockEvents.filter((e) => e.status === 'upcoming').slice(0, 3);
  const latestAnnouncements = mockAnnouncements.slice(0, 3);
  const galleryPreview = mockGallery.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. About CSI CMRIT Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-3 py-1 rounded-md border border-blue-200">
                About the Chapter
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Fostering Technological Excellence & Student Leadership
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The Computer Society of India (CSI) student chapter at CMR Institute of Technology, Hyderabad, serves as a dynamic hub for aspiring engineers, developers, and technology enthusiasts.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We empower students by demystifying real-world software development, hosting technical bootcamps, organizing competitive hackathons, and fostering a collaborative peer-learning ecosystem aligned with current industry standards.
              </p>

              <div className="pt-2">
                <Link to="/about">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                  alt="CMRIT students working in computer lab"
                  className="rounded-xl w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Do (6 Pillar Cards) */}
      <WhatWeDo />

      {/* 4. Upcoming Events */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60">
                Participate & Grow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Upcoming Events & Workshops
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Explore upcoming chapter workshops, technical sessions, and hackathons.
              </p>
            </div>

            <Link to="/events">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Events
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Latest Announcements */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60">
                Official Updates
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Latest Announcements
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Stay informed with the newest circulars, hackathon updates, and opportunities.
              </p>
            </div>

            <Link to="/announcements">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                All Announcements
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestAnnouncements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Smart India Hackathon Feature */}
      <SihFeature />

      {/* 7. Gallery Preview (6 Images) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60">
                Visual Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Life at CSI CMRIT
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Moments from past hackathons, tech workshops, student orientation, and coding sessions.
              </p>
            </div>

            <Link to="/gallery">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Full Gallery
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryPreview.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setSelectedPhoto(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Join CSI CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-center text-white border border-slate-800 shadow-elevated relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Join the Movement
              </span>
              
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Be Part of the Community
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Learn. Connect. Create. Make an impact with CSI CMRIT. Join a vibrant student network committed to technical excellence and collaboration.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/join">
                  <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Join CSI
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Learn More
                  </Button>
                </Link>
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
