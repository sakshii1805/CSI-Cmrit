import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, AlertCircle, BellOff, Loader2, Plus, Shield } from 'lucide-react';
import { AnnouncementCard } from '../components/announcements/AnnouncementCard';
import { AnnouncementCategory, AnnouncementItem, ContentStatus } from '../types';
import { announcementsService } from '../services/announcementsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { AnnouncementModal } from '../components/admin/in-place/AnnouncementModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const Announcements: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory>('All');

  // In-place admin modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<AnnouncementItem | null>(null);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const res = isAdmin
        ? await announcementsService.adminListAnnouncements()
        : await announcementsService.getPublishedAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();

    const handleUpdate = () => {
      loadAnnouncements();
    };
    window.addEventListener('csi_content_updated', handleUpdate);
    return () => window.removeEventListener('csi_content_updated', handleUpdate);
  }, [isAdmin]);

  const categories: AnnouncementCategory[] = [
    'All',
    'General',
    'Hackathon',
    'Workshop',
    'Event',
    'Registration',
    'Opportunity'
  ];

  const handleTogglePublish = async (item: AnnouncementItem) => {
    try {
      const current = (item.status === 'published' || item.is_published !== false) ? 'published' : 'draft';
      const res = await announcementsService.toggleAnnouncementPublish(item.id, current as ContentStatus);
      if (!res.success) throw new Error(res.error);
      const next = current === 'published' ? 'draft' : 'published';
      showToast(`Announcement status changed to ${next}`, 'success');
      loadAnnouncements();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAnnouncement) return;
    try {
      const res = await announcementsService.deleteAnnouncement(deletingAnnouncement.id);
      if (!res.success) throw new Error(res.error);
      showToast('Announcement deleted.', 'info');
      setDeletingAnnouncement(null);
      loadAnnouncements();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete announcement', 'error');
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      if (selectedCategory !== 'All' && ann.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ann.title.toLowerCase().includes(q);
        const matchesSummary = (ann.summary || '').toLowerCase().includes(q);
        const matchesTags = (ann.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesSummary || matchesTags;
      }
      return true;
    });
  }, [announcements, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Banner */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
                Notice Board
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
                Announcements
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Official updates, registration notices, and community opportunities from CSI CMRIT Chapter.
              </p>
            </div>

            {/* In-Place Admin Add Button */}
            {isAdmin && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Post Announcement</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Search & Filter bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements, topics, or keywords..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredAnnouncements.length}</span>{' '}
            {filteredAnnouncements.length === 1 ? 'announcement' : 'announcements'}
            {selectedCategory !== 'All' && (
              <span> in <strong className="text-blue-600">{selectedCategory}</strong></span>
            )}
            {isAdmin && <span className="ml-2 text-blue-600 font-semibold">(Admin View)</span>}
          </div>

          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* Announcement Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-slate-200/60 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((ann) => (
              <AnnouncementCard
                key={ann.id}
                announcement={ann}
                onEdit={(a) => {
                  setEditingAnnouncement(a);
                  setModalOpen(true);
                }}
                onDelete={(a) => setDeletingAnnouncement(a)}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-subtle my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <BellOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No announcements found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              No notices match your selected category or search filter.
            </p>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setEditingAnnouncement(null);
                  setModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shadow-sm"
              >
                + Post Announcement Now
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* In-Place Announcement Modal */}
      <AnnouncementModal
        isOpen={modalOpen}
        announcementToEdit={editingAnnouncement}
        onClose={() => {
          setModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onSuccess={() => {
          loadAnnouncements();
        }}
      />

      {/* Confirmation Dialog for Deleting Announcement */}
      <ConfirmDialog
        isOpen={!!deletingAnnouncement}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deletingAnnouncement?.title}"? This cannot be undone.`}
        confirmLabel="Delete Announcement"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingAnnouncement(null)}
      />
    </div>
  );
};
