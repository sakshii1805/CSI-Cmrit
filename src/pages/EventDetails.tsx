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
  EyeOff,
  Images,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
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

  // Multi-image gallery state
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  const allImages = React.useMemo(() => {
    if (!event) return [];
    if (event.galleryImages && Array.isArray(event.galleryImages) && event.galleryImages.length > 0) {
      return event.galleryImages.filter(Boolean);
    }
    const fallback = event.image_url || event.image;
    return fallback ? [fallback] : [];
  }, [event]);

  useEffect(() => {
    if (activeImageIdx >= allImages.length && allImages.length > 0) {
      setActiveImageIdx(0);
    }
  }, [allImages.length, activeImageIdx]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setActiveImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, allImages.length]);

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

              {/* Event Images / Multi-Photo Showcase */}
              {allImages.length > 0 && (
                <div className="space-y-3">
                  {/* Main Active Image Stage */}
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
                    {/* Ambient Glow */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-25 blur-2xl scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${allImages[activeImageIdx] || allImages[0]})` }}
                    />

                    {/* Centered Main Image */}
                    <div
                      className="relative z-10 w-full flex items-center justify-center cursor-pointer min-h-[260px] sm:min-h-[380px] max-h-[500px]"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <img
                        src={allImages[activeImageIdx] || allImages[0]}
                        alt={`${event.title} - Photo ${activeImageIdx + 1}`}
                        className="max-h-[500px] w-auto max-w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    </div>

                    {/* Top badges & tools */}
                    <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                      {allImages.length > 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-sm pointer-events-auto">
                          <Images className="w-3.5 h-3.5 text-blue-400" />
                          <span>{activeImageIdx + 1} / {allImages.length}</span>
                        </span>
                      ) : <span />}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-slate-200 hover:text-white text-xs font-medium border border-white/10 shadow-sm pointer-events-auto transition-colors"
                        title="Click to expand full resolution"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View Fullscreen</span>
                      </button>
                    </div>

                    {/* Prev / Next arrows for multi-image */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-white/15 backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 shadow-md"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-white/15 backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 shadow-md"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {allImages.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative shrink-0 rounded-lg overflow-hidden transition-all ${
                            idx === activeImageIdx
                              ? 'ring-2 ring-blue-500 scale-105 shadow-md border-2 border-transparent'
                              : 'opacity-70 hover:opacity-100 border border-slate-200'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-12 sm:w-20 sm:h-14 object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                              Cover
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
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

      {/* Event Photo Fullscreen Lightbox Modal */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-slate-950/92 backdrop-blur-md"
            onClick={() => setLightboxOpen(false)}
          />

          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative z-10 max-w-5xl w-full max-h-[92vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Header info */}
            <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-white truncate max-w-md">{event.title}</span>
              <span className="font-mono text-slate-400">Photo {activeImageIdx + 1} of {allImages.length}</span>
            </div>

            {/* Main Stage */}
            <div className="flex-1 bg-black flex items-center justify-center p-2 overflow-hidden max-h-[72vh]">
              <img
                src={allImages[activeImageIdx] || allImages[0]}
                alt={`${event.title} - Full size photo`}
                className="w-full h-full object-contain max-h-[72vh]"
              />
            </div>

            {/* Bottom thumbnail strip inside lightbox */}
            {allImages.length > 1 && (
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-10 rounded overflow-hidden transition-all ${
                      idx === activeImageIdx
                        ? 'ring-2 ring-blue-500 scale-105'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
