import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Calendar,
  Loader2,
  Upload,
  Check,
  Plus,
  Trash2,
  Star,
  Images
} from 'lucide-react';
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
  { name: 'Hackathon Poster', path: '/images/avishkaar_poster.jpg' },
  { name: 'Launch Promo 1', path: '/images/avishkar_promo_! (1).png' },
  { name: 'Faculty Briefing', path: '/images/avishkar_promo_! (2).png' },
  { name: 'Council Roadshow', path: '/images/avishkar_promo_! (3).png' },
  { name: 'Students Team', path: '/images/students_team.jpg' },
  { name: 'Campus Hero', path: '/images/campus_hero.jpg' },
  { name: 'CMRIT Campus', path: '/images/cmrit_campus.png' },
  { name: 'Campus Front', path: '/images/cmrit_campus_front.png' },
  { name: 'Campus Wing', path: '/images/cmrit_campus_wing.png' },
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
  const [images, setImages] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '');
      setCategory((postToEdit.category as ChapterHighlightCategory) || 'Events');
      let existingImages: string[] = [];
      if (postToEdit.images && Array.isArray(postToEdit.images) && postToEdit.images.length > 0) {
        existingImages = postToEdit.images.map((img) => img.image_url);
      } else if (postToEdit.cover_image) {
        existingImages = [postToEdit.cover_image];
      }
      setImages(existingImages);
      setDate(postToEdit.event_date || '');
      setDescription(postToEdit.description || '');
      setCustomUrl('');
    } else {
      setTitle('');
      setCategory('Events');
      setImages([]);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setCustomUrl('');
    }
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  // Process batch image file upload directly from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const fileArray = Array.from(files);

      const readPromises = fileArray.map(async (file) => {
        if (file.size > 15 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 15 MB limit.`);
        }

        // Try storage service if available
        try {
          const res = await storageService.uploadFile('gallery', file);
          if (res?.url) return res.url;
        } catch {
          // Fall back to local Data URL
        }

        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
          reader.readAsDataURL(file);
        });
      });

      const loadedUrls = await Promise.all(readPromises);
      const validUrls = loadedUrls.filter(Boolean);

      if (validUrls.length > 0) {
        setImages((prev) => [...prev, ...validUrls]);
        showToast(
          `Added ${validUrls.length} photo${validUrls.length > 1 ? 's' : ''} to post!`,
          'success'
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Error processing photos', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      showToast('Photo already attached to this post.', 'info');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setCustomUrl('');
    showToast('Photo URL added to post.', 'info');
  };

  const handleTogglePreset = (path: string) => {
    if (images.includes(path)) {
      setImages((prev) => prev.filter((p) => p !== path));
    } else {
      setImages((prev) => [...prev, path]);
    }
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    showToast('Photo set as primary cover.', 'info');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a title for the post.', 'error');
      return;
    }

    if (images.length === 0) {
      showToast('Please add at least one photo to the post.', 'error');
      return;
    }

    try {
      setLoading(true);
      const primaryCover = images[0];

      if (postToEdit) {
        // Update highlight / post
        const res = await highlightsService.updateHighlight(postToEdit.id, {
          title: title.trim(),
          category,
          imageUrl: primaryCover,
          images: images,
          date,
          description: description.trim()
        });
        if (res.error) throw new Error(res.error);
        showToast(`Post updated with ${images.length} photo${images.length > 1 ? 's' : ''}!`, 'success');
      } else {
        const slug =
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `gallery-${Date.now()}`;

        const res = await galleryService.createGalleryPost(
          {
            slug,
            title: title.trim(),
            category,
            cover_image: primaryCover,
            event_date: date,
            description: description.trim(),
            status: 'published'
          },
          images.map((imgUrl, idx) => ({
            image_url: imgUrl,
            caption: description.trim(),
            display_order: idx
          }))
        );

        if (res.error) throw new Error(res.error);
        showToast(
          `Published gallery post with ${images.length} photo${images.length > 1 ? 's' : ''}!`,
          'success'
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save gallery post.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30">
              <Images className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {postToEdit ? 'Edit Gallery Post' : 'Add Photos to Gallery'}
              </h3>
              <p className="text-xs text-slate-400">
                Upload and publish moments from chapter events
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title & Activity Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Title / Activity Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AVISHKAAR 2026 Hackathon Finale & Presentations"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ChapterHighlightCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
              >
                <option value="Events">Events</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Workshops">Workshops</option>
                <option value="Competitions">Competitions</option>
                <option value="Technical Sessions">Technical Sessions</option>
                <option value="Community">Community</option>
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
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* MULTI-PHOTO UPLOAD & SELECTION SECTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-purple-600" />
                  <span>Attached Photos ({images.length} added)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The first photo is the main cover.
                </p>
              </div>

              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Direct Multi-File Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-5 bg-purple-50/40 hover:bg-purple-50/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-md shadow-purple-600/20">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-purple-900">
                Click to select photos from your device
              </p>
              <p className="text-[10px] text-purple-700/80 mt-0.5">
                JPG, PNG, or WebP
              </p>
            </div>

            {/* Attached Thumbnails Strip / Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Current photos in this post:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 bg-slate-900 aspect-[4/3] flex items-center justify-center ${
                        idx === 0
                          ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-sm'
                          : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/avishkaar_poster.jpg';
                        }}
                      />

                      {/* Cover badge on first */}
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-bold shadow-xs">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMakeCover(idx)}
                          className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded-md bg-slate-900/80 hover:bg-purple-600 text-white text-[9px] font-semibold transition-all backdrop-blur-xs shadow-xs"
                          title="Set as main cover photo"
                        >
                          Make Cover
                        </button>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 text-white hover:bg-rose-700 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Order indicator */}
                      <span className="absolute bottom-1 right-1.5 text-[9px] font-mono font-bold text-white/80 bg-black/50 px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Pick from Chapter Library */}
            <div>
              <p className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                <span>Or click to add from chapter library:</span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1.5 bg-white rounded-xl border border-slate-200">
                {chapterPhotoPresets.map((preset) => {
                  const isSelected = images.includes(preset.path);
                  return (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => handleTogglePreset(preset.path)}
                      className={`relative rounded-lg overflow-hidden border-2 aspect-[4/3] group transition-all text-left ${
                        isSelected
                          ? 'border-purple-600 ring-2 ring-purple-600/30 shadow-md scale-102'
                          : 'border-slate-100 hover:border-slate-300 opacity-75 hover:opacity-100'
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
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input Field */}
            <div>
              <p className="text-[11px] font-bold text-slate-600 mb-1">
                Or add photo by URL / local path:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomUrl();
                    }
                  }}
                  placeholder="/images/... or https://..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomUrl()}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors shrink-0"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          {/* Caption / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Caption / Brief Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlights from the session, speakers, participants..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-slate-400">
              {images.length} {images.length === 1 ? 'photo' : 'photos'} attached
            </span>
            <div className="flex items-center gap-2.5">
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
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{postToEdit ? 'Save Changes' : 'Publish Post'}</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryModal;
