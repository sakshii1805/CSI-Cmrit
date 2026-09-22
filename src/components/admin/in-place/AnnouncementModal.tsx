import React, { useState, useEffect } from 'react';
import { X, Bell, Tag, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { announcementsService } from '../../../services/announcementsService';
import { AnnouncementItem, AnnouncementCategory } from '../../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementToEdit?: AnnouncementItem | null;
  onSuccess: (saved: AnnouncementItem) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcementToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (announcementToEdit) {
      setTitle(announcementToEdit.title || '');
      setCategory((announcementToEdit.category as AnnouncementCategory) || 'General');
      setSummary(announcementToEdit.summary || '');
      const contentStr = Array.isArray(announcementToEdit.content)
        ? announcementToEdit.content.join('\n\n')
        : (announcementToEdit.content || '');
      setContent(contentStr);
      setTags(Array.isArray(announcementToEdit.tags) ? announcementToEdit.tags.join(', ') : '');
      setIsUrgent(!!announcementToEdit.isUrgent);
      setIsPublished(announcementToEdit.status === 'published' || announcementToEdit.is_published !== false);
    } else {
      setTitle('');
      setCategory('General');
      setSummary('');
      setContent('');
      setTags('Notice, CSI CMRIT');
      setIsUrgent(false);
      setIsPublished(true);
    }
  }, [announcementToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      showToast('Title and summary are required.', 'error');
      return;
    }

    try {
      setLoading(true);
      const contentArray = content.trim()
        ? content.split('\n\n').filter(Boolean)
        : [summary.trim()];

      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: any = {
        title: title.trim(),
        category,
        summary: summary.trim(),
        content: contentArray,
        tags: tagArray.length > 0 ? tagArray : [category],
        isUrgent,
        priority: isUrgent ? 'high' : 'medium',
        status: isPublished ? 'published' : 'draft',
        is_published: isPublished
      };

      if (announcementToEdit) {
        const res = await announcementsService.updateAnnouncement(announcementToEdit.id, payload);
        if (res.error) throw new Error(res.error);
        showToast('Announcement updated successfully!', 'success');
        onSuccess(res.data || { ...announcementToEdit, ...payload });
      } else {
        const res = await announcementsService.createAnnouncement(payload);
        if (res.error) throw new Error(res.error);
        showToast('New announcement published successfully!', 'success');
        onSuccess(res.data!);
      }
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save announcement.', 'error');
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
            <span className="p-1.5 rounded-lg bg-amber-600/30 text-amber-400 border border-amber-500/30">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {announcementToEdit ? 'Edit Announcement' : 'New Notice / Announcement'}
              </h3>
              <p className="text-[11px] text-slate-400">Post official notices and updates directly to the chapter notice board</p>
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
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Call for Technical Submissions & Abstract Guidelines"
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
                onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="General">General</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Event">Event</option>
                <option value="Registration">Registration</option>
                <option value="Opportunity">Opportunity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Publication Status
              </label>
              <select
                value={isPublished ? 'published' : 'draft'}
                onChange={(e) => setIsPublished(e.target.value === 'published')}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="published">Published (Visible to all users)</option>
                <option value="draft">Draft (Visible only to admins)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Summary / Short Description *
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 sentences summarizing the announcement..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Full Announcement Content (Paragraphs separated by blank lines)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide complete guidelines, instructions, eligibility criteria, and details..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Notice, SIH, Registration, CMRIT"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Urgent / Pinned Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isUrgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="isUrgent" className="text-xs font-medium text-slate-700">
              Highlight as Important / Urgent (displays priority badge)
            </label>
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
                <span>{announcementToEdit ? 'Save Changes' : 'Post Announcement'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
