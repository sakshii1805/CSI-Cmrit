import React, { useState, useEffect, useRef } from 'react';
import { X, Image, Calendar, Tag, FileText, Loader2, Sparkles, Upload, Check } from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { galleryService } from '../../../services/galleryService';
import { highlightsService } from '../../../services/highlightsService';
import { storageService } from '../../../services/storageService';
import { GalleryPost, ChapterHighlightCategory } from '../../../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: GalleryPost | null;
  onSuccess: () => void;
}

const chapterPhotoPresets = [
  { name: 'Students Team', path: '/images/students_team.jpg' },
  { name: 'Campus Hero', path: '/images/campus_hero.jpg' },
  { name: 'CMRIT Campus', path: '/images/cmrit_campus.png' },
  { name: 'Campus Front', path: '/images/cmrit_campus_front.png' },
  { name: 'Campus Wing', path: '/images/cmrit_campus_wing.png' },
  { name: 'Hackathon Poster', path: '/images/avishkaar_poster.jpg' },
  { name: 'Launch Promo 1', path: '/images/avishkar_promo_! (1).png' },
  { name: 'Faculty Briefing', path: '/images/avishkar_promo_! (2).png' },
  { name: 'Council Roadshow', path: '/images/avishkar_promo_! (3).png' },
];

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  postToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size exceeds 10 MB limit.', 'error');
      return;
    }

    try {
      setUploading(true);
      let finalUrl = '';

      // Try Supabase Storage if configured
      try {
        const res = await storageService.uploadFile('gallery', file);
        if (res?.url) {
          finalUrl = res.url;
        }
      } catch {
        // Fallback to local Data URL
      }

      // Fallback to Data URL for instant local selection
      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });
      }

      setImageUrl(finalUrl);
      showToast('Picture selected directly from your device!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error processing photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Title and Image are required.', 'error');
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
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
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

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Title / Activity Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI & Cloud Workshop Hands-on Session"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
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
                placeholder="e.g. 2026-09-23"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Picture Selection Section: Direct Device Selection + Library Picker + URL input */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-purple-600" />
                <span>Picture Selection *</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Direct Device Upload / Drag & Browse Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-4 bg-slate-50/70 hover:bg-purple-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click to select photo directly from device
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Upload JPG, PNG, or WebP from your computer
              </p>
            </div>

            {/* Direct Selection from Chapter Library / Presets */}
            <div>
              <p className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                <span>Or select directly from chapter library:</span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1.5 bg-slate-100/70 rounded-xl border border-slate-200">
                {chapterPhotoPresets.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setImageUrl(preset.path)}
                    className={`relative rounded-lg overflow-hidden border-2 aspect-[4/3] group transition-all text-left ${
                      imageUrl === preset.path
                        ? 'border-purple-600 ring-2 ring-purple-600/30 shadow-md scale-102'
                        : 'border-white hover:border-slate-300 opacity-75 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.path}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 backdrop-blur-xs text-[9px] font-medium text-white px-1 py-0.5 truncate text-center">
                      {preset.name}
                    </div>
                    {imageUrl === preset.path && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Path / URL input field */}
            <div>
              <p className="text-[11px] font-bold text-slate-600 mb-1">
                Or enter image path / URL directly:
              </p>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/... or https://..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white font-mono"
              />
            </div>

            {/* Image Preview with original proportions */}
            {imageUrl && (
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-110 pointer-events-none"
                />
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="relative max-h-full max-w-full object-contain z-10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/avishkaar_poster.jpg';
                  }}
                />
                <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md z-20">
                  Original Aspect Preview
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Caption / Brief Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlights from the session, speakers, participants..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
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
              className="bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20"
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
