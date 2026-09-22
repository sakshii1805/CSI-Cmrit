import React, { useState, useEffect } from 'react';
import { X, Image, Calendar, Tag, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { galleryService } from '../../../services/galleryService';
import { highlightsService } from '../../../services/highlightsService';
import { GalleryPost, ChapterHighlightCategory } from '../../../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: GalleryPost | null;
  onSuccess: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  postToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChapterHighlightCategory>('Events');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '');
      setCategory((postToEdit.category as ChapterHighlightCategory) || 'Events');
      setImageUrl(postToEdit.cover_image || (postToEdit.images && postToEdit.images[0]?.image_url) || '');
      setDate(postToEdit.event_date || '');
      setDescription(postToEdit.description || '');
    } else {
      setTitle('');
      setCategory('Events');
      setImageUrl('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Title and Image URL are required.', 'error');
      return;
    }

    try {
      setLoading(true);
      if (postToEdit) {
        // Update highlight/post
        const res = await highlightsService.updateHighlight(postToEdit.id, {
          title: title.trim(),
          category,
          imageUrl: imageUrl.trim(),
          date,
          description: description.trim()
        });
        if (res.error) throw new Error(res.error);
        showToast('Gallery item updated!', 'success');
      } else {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `gallery-${Date.now()}`;
        const res = await galleryService.createGalleryPost(
          {
            slug,
            title: title.trim(),
            category,
            cover_image: imageUrl.trim(),
            event_date: date,
            description: description.trim(),
            status: 'published'
          },
          [{ image_url: imageUrl.trim(), caption: description.trim() }]
        );
        if (res.error) throw new Error(res.error);
        showToast('Photo added to chapter gallery!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save gallery item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-purple-600/30 text-purple-400 border border-purple-500/30">
              <Image className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {postToEdit ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
              </h3>
              <p className="text-[11px] text-slate-400">Publish moments and photos to the chapter visual archives</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Title / Activity Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI & Cloud Workshop 2026 Hands-on Session"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ChapterHighlightCategory)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Events">Events</option>
                <option value="Workshops">Workshops</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Community">Community</option>
                <option value="Competitions">Competitions</option>
                <option value="Technical Sessions">Technical Sessions</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 15 Oct 2026"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-slate-400" />
              <span>Image URL or Relative Path *</span>
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/gallery/photo1.jpg or https://..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Image Preview if provided */}
          {imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/avishkaar_poster.jpg';
                }}
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded">
                Live Preview
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Caption / Brief Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlights from the session, speakers, participants..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

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
                <span>{postToEdit ? 'Save Changes' : 'Add to Gallery'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
