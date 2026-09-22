import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Ticket,
  Building,
  ExternalLink
} from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { EventItem } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RegisterModal } from '../components/events/RegisterModal';
import { CommentSection } from '../components/common/CommentSection';
import { useToast } from '../components/common/Toast';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await eventsService.getEventBySlug(id);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Event link copied to clipboard!', 'info');
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500">Loading event briefing...</p>
      </div>
    );
  }

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

  const isUpcoming = event.status === 'published';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb Header */}
      <section className="bg-slate-950 text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all events</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium border border-slate-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Event</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Main Content (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Header Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="blue">{event.category}</Badge>
                <Badge variant={isUpcoming ? 'emerald' : 'slate'}>
                  {isUpcoming ? 'Published' : 'Concluded'}
                </Badge>
                {event.organizer && (
                  <span className="text-xs text-slate-400 font-medium">
                    Organized by <strong className="text-slate-700">{event.organizer}</strong>
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {event.title}
              </h1>

              {/* Event Image Banner */}
              {(event.image_url || event.image) && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-96">
                  <img
                    src={event.image_url || event.image || ''}
                    alt={event.title}
                    className="w-full h-full object-cover object-center max-h-96"
                  />
                </div>
              )}

              {/* Detailed Description */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3">About This Event</h3>
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Key Takeaways / Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Session Highlights &amp; Takeaways</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Public Comment Section */}
            <CommentSection
              targetType="event"
              targetId={event.id}
              targetTitle={event.title}
            />
          </div>

          {/* Right Sidebar: Registration & Logistics (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-5 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Event Logistics
              </h3>

              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date</span>
                  <span className="text-sm font-bold text-slate-800">
                    {event.event_date || event.date}
                  </span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Timing</span>
                  <span className="text-sm font-bold text-slate-800">
                    {event.event_time || event.time}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Location / Venue</span>
                  <span className="text-sm font-bold text-slate-800">{event.venue}</span>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Host Chapter</span>
                  <span className="text-sm font-bold text-slate-800">{event.organizer || 'CSI CMRIT Chapter'}</span>
                </div>
              </div>

              {/* Registration Action */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {event.registration_link ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full shadow-md"
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                    >
                      Official Registration
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-md"
                    onClick={() => setRegisterModalOpen(true)}
                    leftIcon={<Ticket className="w-4 h-4" />}
                  >
                    Register for Event
                  </Button>
                )}
              </div>

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
