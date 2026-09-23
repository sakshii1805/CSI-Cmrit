import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Ticket,
  Building,
  ExternalLink,
  Pencil,
  Trash2,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { EventItem } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RegisterModal } from '../components/events/RegisterModal';
import { CommentSection } from '../components/common/CommentSection';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { EventModal } from '../components/admin/in-place/EventModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // In-place edit and delete state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  useEffect(() => {
    fetchEvent();

    const handleUpdate = () => {
      fetchEvent();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Event link copied to clipboard!', 'info');
  };

  const handleTogglePublish = async () => {
    if (!event) return;
    try {
      const currentStatus = (event.status === 'published' || event.is_published !== false) ? 'published' : 'draft';
      const res = await eventsService.toggleEventPublish(event.id, currentStatus);
      if (!res.success) throw new Error(res.error);
      const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
      showToast(`Event status updated to ${nextStatus}`, 'success');
      setEvent({ ...event, status: nextStatus, is_published: nextStatus === 'published' });
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!event) return;
    try {
      const res = await eventsService.deleteEvent(event.id);
      if (!res.success) throw new Error(res.error);
      showToast('Event deleted successfully.', 'info');
      setDeleteDialogOpen(false);
      navigate('/events');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete event', 'error');
    }
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

  const isPublished = event.status === 'published' || event.is_published !== false;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb Header */}
      <section className="bg-slate-950 text-white pt-24 sm:pt-28 pb-6 sm:pb-8 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all events</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* In-Place Admin Controls */}
              {isAdmin && (
                <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
                  <button
                    type="button"
                    onClick={handleTogglePublish}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    }`}
                  >
                    {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{isPublished ? 'Published' : 'Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Event</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium border border-slate-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
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
                <Badge variant={isPublished ? 'emerald' : 'slate'}>
                  {isPublished ? 'Published' : 'Draft'}
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

            {/* Public Comment Section with In-Place Admin Moderation */}
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

      {/* In-Place Event Edit Modal */}
      {isAdmin && (
        <EventModal
          isOpen={editModalOpen}
          eventToEdit={event}
          onClose={() => setEditModalOpen(false)}
          onSuccess={(updated) => {
            setEvent(updated);
            fetchEvent();
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      {isAdmin && (
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Delete Event"
          message={`Are you sure you want to delete "${event.title}"? This will permanently remove the event.`}
          confirmLabel="Delete Event"
          variant="danger"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
};
