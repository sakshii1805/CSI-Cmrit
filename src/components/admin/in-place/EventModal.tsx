import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Image,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  ImageIcon
} from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { eventsService } from '../../../services/eventsService';
import { EventItem } from '../../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: EventItem | null;
  onSuccess: (savedEvent: EventItem) => void;
}

const chapterImagePresets = [
  { label: 'AVISHKAAR Poster', url: '/images/avishkaar_poster.jpg' },
  { label: 'Official Launch', url: '/images/avishkar_promo_! (1).png' },
  { label: 'Faculty Briefing', url: '/images/avishkar_promo_! (2).png' },
  { label: 'Campus Campaign', url: '/images/avishkar_promo_! (3).png' },
  { label: 'CMRIT Campus', url: '/images/hero/campus_hero.jpg' },
  { label: 'Students Team', url: '/images/community/students_team.jpg' }
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Workshop');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('CMRIT Campus, Bengaluru');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Multi-image management state
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setCategory(eventToEdit.category || 'Workshop');
      setDate(eventToEdit.event_date || eventToEdit.date || '');
      setTime(eventToEdit.event_time || eventToEdit.time || '10:00 AM - 1:00 PM');
      setVenue(eventToEdit.venue || eventToEdit.location || 'CMRIT Campus, Bengaluru');
      setShortDescription(eventToEdit.shortDescription || '');
      setDescription(eventToEdit.description || '');
      setRegistrationLink(eventToEdit.registration_link || '');
      setIsPublished(eventToEdit.status === 'published' || eventToEdit.is_published !== false);

      const existingImages = Array.isArray(eventToEdit.galleryImages) && eventToEdit.galleryImages.length > 0
        ? eventToEdit.galleryImages
        : (eventToEdit.image || eventToEdit.image_url ? [eventToEdit.image || eventToEdit.image_url!] : []);
      setImages(existingImages.length > 0 ? existingImages : ['/images/avishkaar_poster.jpg']);
    } else {
      setTitle('');
      setCategory('Workshop');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('10:00 AM - 1:00 PM');
      setVenue('CMRIT Campus, Bengaluru');
      setShortDescription('');
      setDescription('');
      setRegistrationLink('');
      setIsPublished(true);
      setImages(['/images/avishkaar_poster.jpg']);
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  // Add multiple files from local device in parallel
  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      const readPromises = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
      });

      const loadedUrls = await Promise.all(readPromises);
      const validUrls = loadedUrls.filter(Boolean);

      if (validUrls.length > 0) {
        setImages((prev) => [...prev, ...validUrls]);
        showToast(`Added ${validUrls.length} photo${validUrls.length > 1 ? 's' : ''} to event.`, 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error uploading files', 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showToast('Image URL added to event photos.', 'info');
  };

  const handleAddPreset = (url: string) => {
    setImages((prev) => [...prev, url]);
    showToast('Preset photo added.', 'info');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length <= 1) {
      showToast('Event should have at least one photo.', 'warning');
      return;
    }
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCover = (indexToCover: number) => {
    setImages((prev) => {
      const target = prev[indexToCover];
      const rest = prev.filter((_, idx) => idx !== indexToCover);
      return [target, ...rest];
    });
    showToast('Set as main cover image.', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Event title is required.', 'error');
      return;
    }

    if (images.length === 0) {
      showToast('Please add at least one image for the event.', 'error');
      return;
    }

    try {
      setLoading(true);
      const primaryImage = images[0];

      const payload: any = {
        title: title.trim(),
        category,
        event_date: date,
        date,
        event_time: time,
        time,
        venue,
        location: venue,
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        image: primaryImage,
        image_url: primaryImage,
        galleryImages: images,
        registration_link: registrationLink.trim() || null,
        status: isPublished ? 'published' : 'draft',
        is_published: isPublished
      };

      if (eventToEdit) {
        const res = await eventsService.updateEvent(eventToEdit.id, payload);
        if (res.error) throw new Error(res.error);
        showToast('Event updated successfully with all images!', 'success');
        onSuccess(res.data || { ...eventToEdit, ...payload });
      } else {
        const res = await eventsService.createEvent(payload);
        if (res.error) throw new Error(res.error);
        showToast('New event created successfully with all images!', 'success');
        onSuccess(res.data!);
      }
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {eventToEdit ? 'Edit Event & Photos' : 'Create New Event'}
              </h3>
              <p className="text-xs text-slate-400">Add event details and as many photos as you want</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AVISHKAAR 2026 – SIH-Pattern Hackathon"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Technical Session">Technical Session</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Publication Status
              </label>
              <select
                value={isPublished ? 'published' : 'draft'}
                onChange={(e) => setIsPublished(e.target.value === 'published')}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              >
                <option value="published">Published (Visible to all users)</option>
                <option value="draft">Draft (Visible only to admins)</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 26 Sept 2026"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 1:00 PM"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Venue</span>
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="CMRIT Campus, Bengaluru"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* MULTI-IMAGE MANAGEMENT SECTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Event Photos &amp; Media ({images.length} added)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The first photo is the main cover.
                </p>
              </div>

              {/* Direct Multi-File Upload Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleDeviceUpload}
                  className="hidden"
                  id="event-file-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select Photos from Device</span>
                </button>
              </div>
            </div>

            {/* Quick URL Adder */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                placeholder="Or paste an image URL / relative path (/images/...)"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => handleAddUrl()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                + Add Image
              </button>
            </div>

            {/* Chapter Library Quick Pickers */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick-add from chapter library:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {chapterImagePresets.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => handleAddPreset(preset.url)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 transition-all shadow-2xs"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Added Images Thumbnail Grid */}
            {images.length > 0 ? (
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`relative group/thumb rounded-xl overflow-hidden border-2 bg-slate-950 aspect-[4/3] flex items-center justify-center transition-all ${
                        idx === 0
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/images/avishkaar_poster.jpg';
                        }}
                      />

                      {/* Primary Cover Badge */}
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-extrabold shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            Cover
                          </span>
                        </div>
                      )}

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 z-20">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors text-[10px] font-bold flex items-center gap-1"
                            title="Make this the primary cover image"
                          >
                            <Star className="w-3 h-3" />
                            <span>Cover</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl bg-white">
                No images added yet. Click &quot;Upload Photos&quot; or paste a URL above.
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Summary / Short Description
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-2 sentence overview for cards and home showcase..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Full Details / Markdown Content
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full event schedule, guidelines, prizes, problem statements, and requirements..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Registration Link */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>External Registration Link (Optional)</span>
            </label>
            <input
              type="url"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              placeholder="https://forms.gle/... or similar"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              className="shadow-md shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{eventToEdit ? 'Save Changes' : 'Publish Event'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EventModal;
