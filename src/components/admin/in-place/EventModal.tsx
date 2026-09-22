import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Image, Link as LinkIcon, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { eventsService } from '../../../services/eventsService';
import { EventItem, EventCategory } from '../../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: EventItem | null;
  onSuccess: (savedEvent: EventItem) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Workshop');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('CMRIT Campus, Bengaluru');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setCategory(eventToEdit.category || 'Workshop');
      setDate(eventToEdit.event_date || eventToEdit.date || '');
      setTime(eventToEdit.event_time || eventToEdit.time || '10:00 AM - 1:00 PM');
      setVenue(eventToEdit.venue || eventToEdit.location || 'CMRIT Campus, Bengaluru');
      setShortDescription(eventToEdit.shortDescription || '');
      setDescription(eventToEdit.description || '');
      setImage(eventToEdit.image || eventToEdit.image_url || '');
      setRegistrationLink(eventToEdit.registration_link || '');
      setIsPublished(eventToEdit.status === 'published' || eventToEdit.is_published !== false);
    } else {
      setTitle('');
      setCategory('Workshop');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('10:00 AM - 1:00 PM');
      setVenue('CMRIT Campus, Bengaluru');
      setShortDescription('');
      setDescription('');
      setImage('/images/avishkaar_poster.jpg');
      setRegistrationLink('');
      setIsPublished(true);
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Event title is required.', 'error');
      return;
    }

    try {
      setLoading(true);
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
        image: image.trim(),
        image_url: image.trim(),
        registration_link: registrationLink.trim() || null,
        status: isPublished ? 'published' : 'draft',
        is_published: isPublished
      };

      if (eventToEdit) {
        const res = await eventsService.updateEvent(eventToEdit.id, payload);
        if (res.error) throw new Error(res.error);
        showToast('Event updated successfully!', 'success');
        onSuccess(res.data || { ...eventToEdit, ...payload });
      } else {
        const res = await eventsService.createEvent(payload);
        if (res.error) throw new Error(res.error);
        showToast('New event created successfully!', 'success');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {eventToEdit ? 'Edit Event' : 'Create New Event'}
              </h3>
              <p className="text-[11px] text-slate-400">Manage event details displayed across the website</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
              placeholder="e.g. AVISHKAAR 2026 – Hackathon"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
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
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
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

          {/* Poster Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-slate-400" />
              <span>Poster / Banner Image URL</span>
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/avishkaar_poster.jpg or https://..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
