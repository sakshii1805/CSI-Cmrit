import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Ticket,
  ChevronRight
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
        <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-slate-200">
          <Calendar className="w-6 h-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900 mb-2">Event Not Found</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          This event does not exist or may have been archived.
        </p>
        <Link
          to="/events"
          className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-mono text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Return to Events Directory
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
      <div className="bg-white border-b border-slate-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL EVENTS</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Overview */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Event Image */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-card bg-slate-950 aspect-[16/9] w-full">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="blue" className="bg-slate-950/85 backdrop-blur-md text-blue-300 border-slate-700 font-mono text-[10px]">
                  {event.category}
                </Badge>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider ${
                    isUpcoming 
                      ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-700/60' 
                      : 'bg-slate-900/85 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {isUpcoming ? 'Scheduled Event' : 'Concluded'}
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
              <div>
                <span className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  {event.organizer}
                </span>
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Key Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-4 border-y border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-slate-400 block uppercase">Date</span>
                    <span className="font-mono text-xs font-semibold text-slate-900">{event.date}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-slate-400 block uppercase">Time</span>
                    <span className="font-mono text-xs font-semibold text-slate-900">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-slate-400 block uppercase">Venue / Mode</span>
                    <span className="text-xs font-semibold text-slate-900 block">{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-slate-900">Event Overview</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">Key Takeaways</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
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
                  <h3 className="font-display text-lg font-bold text-slate-900">Participant Expectations</h3>
                  <ul className="space-y-2">
                    {event.expectations.map((exp, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-normal">
                        <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Gallery Photos */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="font-display text-lg font-bold text-slate-900">Session Documentation</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {event.galleryImages.map((imgUrl, i) => (
                      <div key={i} className="rounded-lg overflow-hidden aspect-video border border-slate-200 bg-slate-900">
                        <img src={imgUrl} alt={`Session record ${i+1}`} className="w-full h-full object-cover" />
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
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card sticky top-24 space-y-5">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Registration Desk
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                  {isUpcoming ? 'Reserve Your Seat' : 'Registration Closed'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {isUpcoming
                    ? 'Free registration for all CMRIT engineering students. Prior registration is required for campus entry.'
                    : 'This session has concluded. Future editions will be announced on our notice board.'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">ENTRY:</span>
                  <span className="font-semibold text-emerald-700">Complimentary / CMRIT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FORMAT:</span>
                  <span className="font-semibold text-slate-800">{event.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CREDENTIAL:</span>
                  <span className="font-semibold text-slate-800">CSI Chapter Certificate</span>
                </div>
              </div>

              {isUpcoming ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<Ticket className="w-4 h-4" />}
                  onClick={() => setRegisterModalOpen(true)}
                >
                  Register for Session
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled className="w-full font-mono text-xs">
                  Event Concluded
                </Button>
              )}

              {/* Speaker / Faculty Mentor Card */}
              {event.speaker && (
                <div className="pt-5 border-t border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Faculty Mentor / Speaker
                  </span>
                  <div className="flex items-center gap-3">
                    {event.speaker.image && (
                      <img
                        src={event.speaker.image}
                        alt={event.speaker.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-display text-sm font-bold text-slate-900">{event.speaker.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{event.speaker.role}</p>
                      {event.speaker.organization && (
                        <p className="text-xs text-blue-600 font-medium">{event.speaker.organization}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Chapter Support Note */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 font-mono">
                  Questions? Inquire with coordinators via{' '}
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

