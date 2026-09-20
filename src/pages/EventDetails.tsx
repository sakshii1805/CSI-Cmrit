import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Ticket, 
  Building,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { mockEvents } from '../data/events';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RegisterModal } from '../components/events/RegisterModal';
import { useToast } from '../components/common/Toast';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const event = mockEvents.find((e) => e.slug === id || e.id === id);

  // No event found (either array is empty or invalid ID)
  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl mb-4 border border-blue-100">
          <Calendar className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Event Not Found</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          This event does not exist or may have been removed.
        </p>
        <Link
          to="/events"
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Event link copied to clipboard!', 'info');
  };

  const isUpcoming = event.status === 'upcoming';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Content Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Overview */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Event Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-slate-900 aspect-[16/9] w-full">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="blue" className="bg-white/95 backdrop-blur-md">
                  {event.category}
                </Badge>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-md text-white ${
                    isUpcoming ? 'bg-emerald-600/95' : 'bg-slate-800/95'
                  }`}
                >
                  {isUpcoming ? 'Upcoming Event' : 'Event Concluded'}
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {event.organizer}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Key Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-4 border-y border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Date</span>
                    <span className="text-sm font-semibold text-slate-900">{event.date}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Time</span>
                    <span className="text-sm font-semibold text-slate-900">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Venue / Mode</span>
                    <span className="text-sm font-semibold text-slate-900">{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Event Overview</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-bold text-slate-900">Event Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What to Expect / Prerequisites */}
              {event.expectations && event.expectations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-bold text-slate-900">What Participants Can Expect</h3>
                  <ul className="space-y-2">
                    {event.expectations.map((exp, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Gallery Photos */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Event Photos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {event.galleryImages.map((imgUrl, i) => (
                      <div key={i} className="rounded-xl overflow-hidden aspect-video border border-slate-200">
                        <img src={imgUrl} alt={`Event session ${i+1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Registration & Speaker Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Registration Action Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card sticky top-24 space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Registration
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {isUpcoming ? 'Reserve Your Seat' : 'Registration Closed'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isUpcoming
                    ? 'Free registration for all CMRIT engineering students. Prior registration is required for entry.'
                    : 'This event has concluded. Stay tuned for future editions.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Entry Fee:</span>
                  <span className="font-semibold text-emerald-600">Free / Open to CMRIT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-semibold text-slate-800">{event.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Certificate:</span>
                  <span className="font-semibold text-slate-800">CSI Chapter Issued</span>
                </div>
              </div>

              {isUpcoming ? (
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  leftIcon={<Ticket className="w-4 h-4" />}
                  onClick={() => setRegisterModalOpen(true)}
                >
                  Register for Event
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled className="w-full">
                  Event Finished
                </Button>
              )}

              {/* Speaker / Faculty Mentor Card */}
              {event.speaker && (
                <div className="pt-5 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Featured Mentor / Speaker
                  </span>
                  <div className="flex items-center gap-3">
                    {event.speaker.image && (
                      <img
                        src={event.speaker.image}
                        alt={event.speaker.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{event.speaker.name}</h4>
                      <p className="text-xs text-slate-500">{event.speaker.role}</p>
                      {event.speaker.organization && (
                        <p className="text-xs text-blue-600 font-medium">{event.speaker.organization}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Chapter Support Note */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400">
                  Have questions about this event? Contact chapter coordinators via{' '}
                  <Link to="/contact" className="text-blue-600 underline">
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        event={event}
      />
    </div>
  );
};
