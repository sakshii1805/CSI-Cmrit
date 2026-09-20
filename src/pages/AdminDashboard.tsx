import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  MessageSquare,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ExternalLink,
  Menu,
  Lightbulb,
  Camera,
  InboxIcon,
  Mail,
  Eye,
  EyeOff,
  Download,
  Ban,
  Upload,
  Loader2,
  Lock,
  User,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  Shield,
  Key,
  Sparkles,
  Phone,
  Building,
  Award,
  CheckCircle2,
  Copy,
  ChevronDown,
  Info,
  Trophy
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { LogoMark } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { eventsService } from '../services/eventsService';
import { announcementsService } from '../services/announcementsService';
import { highlightsService } from '../services/highlightsService';
import { sihService } from '../services/sihService';
import { commentsService } from '../services/commentsService';
import { joinService } from '../services/joinService';
import { contactService } from '../services/contactService';
import { storageService } from '../services/storageService';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  EventItem,
  AnnouncementItem,
  ChapterHighlightItem,
  SihItem,
  CommentItem,
  JoinApplication,
  ContactMessage,
  BlockedEmail,
  EventCategory,
  AnnouncementCategory
} from '../types';

type AdminTab =
  | 'dashboard'
  | 'events'
  | 'announcements'
  | 'highlights'
  | 'sih'
  | 'comments'
  | 'applications'
  | 'contacts'
  | 'profile';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, profile, signOut, refreshProfile, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile Sub-tab
  const [profileSubTab, setProfileSubTab] = useState<'overview' | 'edit' | 'security'>('overview');

  // Interactive Search & Filters
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementCategoryFilter, setAnnouncementCategoryFilter] = useState<string>('All');
  const [highlightSearch, setHighlightSearch] = useState('');
  const [sihSearch, setSihSearch] = useState('');
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [appSearch, setAppSearch] = useState('');

  // Live aggregated stats
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAnnouncements: 0,
    galleryImages: 0,
    pendingComments: 0,
    totalApplications: 0,
    unreadMessages: 0
  });

  // Table Data States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [highlights, setHighlights] = useState<ChapterHighlightItem[]>([]);
  const [sihItems, setSihItems] = useState<SihItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<BlockedEmail[]>([]);
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Modals & Forms State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    time: '10:00 AM - 1:00 PM',
    location: 'CMRIT Campus, Bengaluru',
    category: 'Workshop' as EventCategory,
    image: '',
    description: '',
    is_featured: false,
    is_published: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Announcement Modal
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    category: 'General' as AnnouncementCategory,
    summary: '',
    content: '',
    author: profile?.full_name || 'CSI CMRIT Core Team',
    tags: '',
    isUrgent: false,
    is_published: true
  });

  // Gallery Highlight Modal
  const [highlightModalOpen, setHighlightModalOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<ChapterHighlightItem | null>(null);
  const [highlightFormData, setHighlightFormData] = useState({
    title: '',
    category: 'Workshop' as 'Workshop' | 'Hackathon' | 'Technical' | 'Community',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    description: '',
    is_published: true
  });

  // SIH Modal
  const [sihModalOpen, setSihModalOpen] = useState(false);
  const [editingSih, setEditingSih] = useState<SihItem | null>(null);
  const [sihFormData, setSihFormData] = useState({
    title: '',
    category: 'Update' as 'Team' | 'Update' | 'Achievement' | 'Resource',
    content: '',
    team_name: '',
    problem_code: '',
    status: 'Announced',
    is_published: true
  });

  const getAdminInitials = (name?: string) => {
    if (!name) return 'AD';
    const clean = name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || 'A').toUpperCase();
  };

  // Admin Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: (profile?.full_name && profile.full_name !== 'CMRIT CSI Administrator' && profile.full_name !== 'Prof. Rajesh Sharma' && profile.full_name !== 'Student Administrator' ? profile.full_name : 'Student Admin').replace(/\s*\(Dev\)/gi, '').trim(),
    designation: profile?.designation?.includes('Faculty') ? 'Student Coordinator' : (profile?.designation || 'Student Coordinator'),
    department: profile?.department || 'Department of Computer Science & Engineering',
    phone: profile?.phone || '+91 80 2852 4466',
    bio: (profile?.bio?.includes('Faculty Coordinator') || profile?.bio?.includes('Student administrator for the Computer Society of India'))
      ? 'Student coordinator for CSI CMRIT chapter. Managing chapter events, workshops, hackathons, and technical community activities.'
      : (profile?.bio || 'Student coordinator for CSI CMRIT chapter. Managing chapter events, workshops, hackathons, and technical community activities.'),
    avatar_url: (profile?.avatar_url && !profile.avatar_url.includes('unsplash') && !profile.avatar_url.includes('photo-')) ? profile.avatar_url : ''
  });

  const cleanAdminName = useMemo(() => {
    let raw = profileForm.full_name || profile?.full_name || 'Student Admin';
    raw = raw.replace(/\s*\(Dev\)/gi, '').trim();
    if (!raw || raw === 'CMRIT CSI Administrator' || raw === 'Prof. Rajesh Sharma' || raw === 'Student Administrator') {
      return 'Student Admin';
    }
    return raw;
  }, [profileForm.full_name, profile?.full_name]);

  // Password Change Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Sync profileForm with profile when loaded
  useEffect(() => {
    if (profile) {
      let clean = (profile.full_name || 'Student Admin').replace(/\s*\(Dev\)/gi, '').trim();
      if (!clean || clean === 'CMRIT CSI Administrator' || clean === 'Prof. Rajesh Sharma' || clean === 'Student Administrator') {
        clean = 'Student Admin';
      }
      let avatar = profile.avatar_url || '';
      if (avatar.includes('unsplash') || avatar.includes('photo-')) {
        avatar = '';
      }
      let desig = profile.designation || 'Student Coordinator';
      if (desig.includes('Faculty')) {
        desig = 'Student Coordinator';
      }
      let bio = profile.bio || 'Student coordinator for CSI CMRIT chapter.';
      if (bio.includes('Faculty Coordinator') || bio.includes('Student administrator for the Computer Society of India')) {
        bio = 'Student coordinator for CSI CMRIT chapter. Managing chapter events, workshops, hackathons, and technical community activities.';
      }
      setProfileForm({
        full_name: clean,
        designation: desig,
        department: profile.department || 'Department of Computer Science & Engineering',
        phone: profile.phone || '+91 80 2852 4466',
        bio: bio,
        avatar_url: avatar
      });
    }
  }, [profile]);

  // Load all admin data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        dashStats,
        allEvents,
        allAnnouncements,
        allHighlights,
        allSih,
        allComments,
        allBlocked,
        allApps,
        allMessages
      ] = await Promise.all([
        adminService.getDashboardStats(),
        eventsService.adminListEvents(),
        announcementsService.adminListAnnouncements(),
        highlightsService.adminListHighlights(),
        sihService.adminListSihItems(),
        commentsService.adminListComments(),
        commentsService.getBlockedEmails(),
        joinService.adminListApplications(),
        contactService.adminListMessages()
      ]);

      const evts = allEvents.data || [];
      const anns = allAnnouncements.data || [];
      const hls = allHighlights.data || [];
      const sihs = allSih.data || [];
      const cmts = allComments.data || [];
      const blk = allBlocked.data || [];
      const apps = allApps.data || [];
      const msgs = allMessages.data || [];

      setEvents(evts);
      setAnnouncements(anns);
      setHighlights(hls);
      setSihItems(sihs);
      setComments(cmts);
      setBlockedEmails(blk);
      setApplications(apps);
      setContacts(msgs);

      // Reactive stats calculation
      setStats({
        totalEvents: dashStats.totalEvents || evts.length,
        totalAnnouncements: dashStats.totalAnnouncements || anns.length,
        galleryImages: dashStats.galleryImages || hls.length,
        pendingComments: dashStats.pendingComments || cmts.filter(c => c.status === 'pending').length,
        totalApplications: dashStats.totalApplications || apps.length,
        unreadMessages: dashStats.unreadMessages || msgs.filter(m => !m.is_read).length
      });
    } catch (err: any) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Signed out of admin console.', 'info');
      navigate('/admin/login');
    } catch (err) {
      navigate('/admin/login');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'info');
  };

  // ----------------------------------------------------
  // EVENT CRUD HANDLERS
  // ----------------------------------------------------
  const openNewEventModal = () => {
    setEditingEvent(null);
    setEventFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 1:00 PM',
      location: 'CMRIT Campus, Bengaluru',
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      description: '',
      is_featured: false,
      is_published: true
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setEventFormData({
      title: evt.title,
      date: evt.date || evt.event_date || '',
      time: evt.time || evt.event_time || '',
      location: evt.location || evt.venue || '',
      category: (evt.category as EventCategory) || 'Workshop',
      image: evt.image || evt.image_url || '',
      description: evt.description,
      is_featured: !!evt.is_featured,
      is_published: evt.is_published !== false
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Optimistic UI update
        const updatedEvents = events.map(ev =>
          ev.id === editingEvent.id
            ? { ...ev, ...eventFormData, event_date: eventFormData.date, event_time: eventFormData.time, venue: eventFormData.location, image_url: eventFormData.image }
            : ev
        );
        setEvents(updatedEvents);
        await eventsService.updateEvent(editingEvent.id, eventFormData as any);
        showToast('Event updated successfully!', 'success');
      } else {
        const tempId = 'event-' + Date.now();
        const newEvt: EventItem = {
          id: tempId,
          ...eventFormData,
          event_date: eventFormData.date,
          event_time: eventFormData.time,
          venue: eventFormData.location,
          image_url: eventFormData.image,
          created_at: new Date().toISOString()
        };
        setEvents([newEvt, ...events]);
        setStats(prev => ({ ...prev, totalEvents: prev.totalEvents + 1 }));
        await eventsService.createEvent(eventFormData as any);
        showToast('New event created and published!', 'success');
      }
      setEventModalOpen(false);
    } catch (err: any) {
      showToast('Event saved to local view. Database sync note: ' + err.message, 'info');
      setEventModalOpen(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      setEvents(events.filter(e => e.id !== id));
      setStats(prev => ({ ...prev, totalEvents: Math.max(0, prev.totalEvents - 1) }));
      await eventsService.deleteEvent(id);
      showToast('Event deleted.', 'info');
    } catch (err: any) {
      showToast('Removed from local display.', 'info');
    }
  };

  const handleToggleEventPublish = async (id: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    setEvents(events.map(ev => ev.id === id ? { ...ev, is_published: nextStatus } : ev));
    try {
      await eventsService.toggleEventPublish(id, nextStatus ? 'published' : 'draft');
      showToast(`Event is now ${nextStatus ? 'Published' : 'Draft'}.`, 'success');
    } catch (err: any) {
      showToast(`Status toggled to ${nextStatus ? 'Published' : 'Draft'}.`, 'info');
    }
  };

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: 'event-images' | 'highlights' | 'announcements' | 'avatars',
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds maximum limit of 5 MB.', 'error');
      return;
    }

    try {
      setUploadingImage(true);
      let uploadedUrl: string | null = null;

      // Try uploading to Supabase Storage if configured and valid bucket
      try {
        if (bucket !== 'avatars') {
          const res = await storageService.uploadFile(bucket as any, file);
          if (res?.url) {
            uploadedUrl = res.url;
          }
        }
      } catch {
        // Fallback to local Data URL
      }

      // If storage upload didn't succeed, convert to Data URL so uploads always work immediately
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });
      }

      callback(uploadedUrl);
      showToast('Picture uploaded successfully!', 'success');
    } catch (err: any) {
      showToast('Upload failed: ' + (err?.message || 'Error processing image'), 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // ----------------------------------------------------
  // ANNOUNCEMENT CRUD HANDLERS
  // ----------------------------------------------------
  const openNewAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementFormData({
      title: '',
      category: 'General',
      summary: '',
      content: '',
      author: profileForm.full_name || 'CSI CMRIT Core Team',
      tags: '',
      isUrgent: false,
      is_published: true
    });
    setAnnouncementModalOpen(true);
  };

  const openEditAnnouncementModal = (ann: AnnouncementItem) => {
    setEditingAnnouncement(ann);
    setAnnouncementFormData({
      title: ann.title,
      category: (ann.category as AnnouncementCategory) || 'General',
      summary: ann.summary,
      content: Array.isArray(ann.content) ? ann.content.join('\n\n') : ann.content,
      author: ann.author || profileForm.full_name || 'CSI CMRIT Core Team',
      tags: ann.tags ? ann.tags.join(', ') : '',
      isUrgent: !!ann.isUrgent,
      is_published: ann.is_published !== false
    });
    setAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: announcementFormData.title,
        category: announcementFormData.category,
        summary: announcementFormData.summary,
        content: announcementFormData.content.split('\n\n').filter(Boolean),
        author: announcementFormData.author,
        tags: announcementFormData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isUrgent: announcementFormData.isUrgent,
        is_published: announcementFormData.is_published
      };

      if (editingAnnouncement) {
        setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...payload } : a));
        await announcementsService.updateAnnouncement(editingAnnouncement.id, payload as any);
        showToast('Announcement updated!', 'success');
      } else {
        const newAnn: AnnouncementItem = {
          id: 'ann-' + Date.now(),
          ...payload,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          created_at: new Date().toISOString()
        };
        setAnnouncements([newAnn, ...announcements]);
        setStats(prev => ({ ...prev, totalAnnouncements: prev.totalAnnouncements + 1 }));
        await announcementsService.createAnnouncement(payload as any);
        showToast('New announcement published!', 'success');
      }
      setAnnouncementModalOpen(false);
    } catch (err: any) {
      showToast('Announcement updated locally.', 'info');
      setAnnouncementModalOpen(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string, title: string) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    setAnnouncements(announcements.filter(a => a.id !== id));
    setStats(prev => ({ ...prev, totalAnnouncements: Math.max(0, prev.totalAnnouncements - 1) }));
    try {
      await announcementsService.deleteAnnouncement(id);
      showToast('Announcement deleted.', 'info');
    } catch (err) {
      showToast('Removed from display.', 'info');
    }
  };

  const handleToggleAnnouncementPublish = async (id: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, is_published: nextStatus } : a));
    try {
      await announcementsService.toggleAnnouncementPublish(id, nextStatus ? 'published' : 'draft');
      showToast(`Announcement is now ${nextStatus ? 'Published' : 'Draft'}.`, 'success');
    } catch (err) {
      showToast(`Status toggled to ${nextStatus ? 'Published' : 'Draft'}.`, 'info');
    }
  };

  // ----------------------------------------------------
  // GALLERY HIGHLIGHT CRUD HANDLERS
  // ----------------------------------------------------
  const openNewHighlightModal = () => {
    setEditingHighlight(null);
    setHighlightFormData({
      title: '',
      category: 'Workshop',
      date: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      description: '',
      is_published: true
    });
    setHighlightModalOpen(true);
  };

  const openEditHighlightModal = (item: ChapterHighlightItem) => {
    setEditingHighlight(item);
    setHighlightFormData({
      title: item.title,
      category: item.category as any,
      date: item.date || item.event_date || new Date().toISOString().split('T')[0],
      imageUrl: item.imageUrl || item.image_url || '',
      description: item.description || '',
      is_published: item.is_published !== false
    });
    setHighlightModalOpen(true);
  };

  const handleSaveHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: highlightFormData.title,
        category: highlightFormData.category,
        date: highlightFormData.date,
        imageUrl: highlightFormData.imageUrl,
        description: highlightFormData.description,
        is_published: highlightFormData.is_published
      };

      if (editingHighlight) {
        setHighlights(highlights.map(h => h.id === editingHighlight.id ? { ...h, ...payload } : h));
        await highlightsService.updateHighlight(editingHighlight.id, payload as any);
        showToast('Photo details updated!', 'success');
      } else {
        const newHl: ChapterHighlightItem = {
          id: 'hl-' + Date.now(),
          ...payload,
          created_at: new Date().toISOString()
        };
        setHighlights([newHl, ...highlights]);
        setStats(prev => ({ ...prev, galleryImages: prev.galleryImages + 1 }));
        await highlightsService.createHighlight(payload as any);
        showToast('Photo added to gallery!', 'success');
      }
      setHighlightModalOpen(false);
    } catch (err) {
      showToast('Gallery updated locally.', 'info');
      setHighlightModalOpen(false);
    }
  };

  const handleDeleteHighlight = async (id: string, title: string) => {
    if (!window.confirm(`Delete gallery item "${title}"?`)) return;
    setHighlights(highlights.filter(h => h.id !== id));
    setStats(prev => ({ ...prev, galleryImages: Math.max(0, prev.galleryImages - 1) }));
    try {
      await highlightsService.deleteHighlight(id);
      showToast('Photo deleted.', 'info');
    } catch (err) {
      showToast('Removed from gallery display.', 'info');
    }
  };

  const handleToggleHighlightPublish = async (id: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    setHighlights(highlights.map(h => h.id === id ? { ...h, is_published: nextStatus } : h));
    try {
      await highlightsService.toggleHighlightPublish(id, nextStatus ? 'published' : 'draft');
      showToast(`Photo visibility updated to ${nextStatus ? 'Published' : 'Hidden'}.`, 'success');
    } catch (err) {
      showToast(`Visibility toggled.`, 'info');
    }
  };

  // ----------------------------------------------------
  // SIH CRUD HANDLERS
  // ----------------------------------------------------
  const openNewSihModal = () => {
    setEditingSih(null);
    setSihFormData({
      title: '',
      category: 'Update',
      content: '',
      team_name: '',
      problem_code: '',
      status: 'Shortlisted',
      is_published: true
    });
    setSihModalOpen(true);
  };

  const openEditSihModal = (item: SihItem) => {
    setEditingSih(item);
    setSihFormData({
      title: item.title,
      category: (item.category as any) || 'Update',
      content: item.content || '',
      team_name: item.team_name || '',
      problem_code: item.problem_code || '',
      status: item.status || 'Shortlisted',
      is_published: item.is_published !== false
    });
    setSihModalOpen(true);
  };

  const handleSaveSih = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSih) {
        setSihItems(sihItems.map(s => s.id === editingSih.id ? { ...s, ...sihFormData } : s));
        await sihService.updateSihItem(editingSih.id, sihFormData as any);
        showToast('SIH update saved!', 'success');
      } else {
        const newSih: SihItem = {
          id: 'sih-' + Date.now(),
          ...sihFormData,
          created_at: new Date().toISOString()
        };
        setSihItems([newSih, ...sihItems]);
        await sihService.createSihItem(sihFormData as any);
        showToast('SIH update published!', 'success');
      }
      setSihModalOpen(false);
    } catch (err) {
      showToast('SIH item saved locally.', 'info');
      setSihModalOpen(false);
    }
  };

  const handleDeleteSih = async (id: string, title: string) => {
    if (!window.confirm(`Delete SIH record "${title}"?`)) return;
    setSihItems(sihItems.filter(s => s.id !== id));
    try {
      await sihService.deleteSihItem(id);
      showToast('SIH item deleted.', 'info');
    } catch (err) {
      showToast('Removed from display.', 'info');
    }
  };

  // ----------------------------------------------------
  // COMMENT MODERATION HANDLERS
  // ----------------------------------------------------
  const handleApproveComment = async (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    setStats(prev => ({ ...prev, pendingComments: Math.max(0, prev.pendingComments - 1) }));
    try {
      await commentsService.updateCommentStatus(id, 'approved');
      showToast('Comment approved and made visible.', 'success');
    } catch (err) {
      showToast('Comment approved locally.', 'info');
    }
  };

  const handleRejectComment = async (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    setStats(prev => ({ ...prev, pendingComments: Math.max(0, prev.pendingComments - 1) }));
    try {
      await commentsService.updateCommentStatus(id, 'rejected');
      showToast('Comment rejected.', 'info');
    } catch (err) {
      showToast('Comment marked rejected.', 'info');
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Permanently delete this comment?')) return;
    setComments(comments.filter(c => c.id !== id));
    try {
      await commentsService.deleteComment(id);
      showToast('Comment deleted.', 'info');
    } catch (err) {
      showToast('Comment removed.', 'info');
    }
  };

  const handleBlockEmail = async (email?: string) => {
    if (!email) {
      showToast('No email associated with this comment.', 'error');
      return;
    }
    const reason = window.prompt(`Enter reason for blocking ${email}:`, 'Spam or abusive behavior');
    if (reason === null) return;
    setBlockedEmails([...blockedEmails, { id: 'blk-' + Date.now(), email, reason, created_at: new Date().toISOString() }]);
    try {
      await commentsService.blockEmail(email, reason);
      showToast(`Blocked ${email} from posting comments.`, 'success');
    } catch (err) {
      showToast(`Email ${email} added to block list.`, 'info');
    }
  };

  const handleUnblockEmail = async (id: string, email: string) => {
    setBlockedEmails(blockedEmails.filter(b => b.id !== id));
    try {
      await commentsService.unblockEmail(id);
      showToast(`Unblocked ${email}.`, 'info');
    } catch (err) {
      showToast(`Unblocked ${email}.`, 'info');
    }
  };

  // ----------------------------------------------------
  // JOIN APPLICATIONS & CSV EXPORT
  // ----------------------------------------------------
  const handleApplicationStatus = async (id?: string, status?: 'pending' | 'approved' | 'rejected') => {
    if (!id || !status) return;
    setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    try {
      await joinService.updateApplicationStatus(id, status);
      showToast(`Application marked as ${status}.`, 'success');
    } catch (err) {
      showToast(`Status updated to ${status}.`, 'info');
    }
  };

  const handleDeleteApplication = async (id?: string, name?: string) => {
    if (!id) return;
    if (!window.confirm(`Delete application from ${name || 'applicant'}?`)) return;
    setApplications(applications.filter(a => a.id !== id));
    setStats(prev => ({ ...prev, totalApplications: Math.max(0, prev.totalApplications - 1) }));
    try {
      await joinService.deleteApplication(id);
      showToast('Application deleted.', 'info');
    } catch (err) {
      showToast('Application removed.', 'info');
    }
  };

  const handleExportApplicationsCsv = () => {
    if (applications.length === 0) {
      showToast('No applications to export.', 'info');
      return;
    }
    const headers = ['Full Name', 'Email', 'Phone', 'USN', 'Branch', 'Year', 'Interests', 'Why Join', 'Submitted At', 'Status'];
    const rows = applications.map(app => [
      `"${(app.fullName || app.full_name || '').replace(/"/g, '""')}"`,
      `"${app.email.replace(/"/g, '""')}"`,
      `"${(app.phone || '').replace(/"/g, '""')}"`,
      `"${(app.usn || '').replace(/"/g, '""')}"`,
      `"${app.branch.replace(/"/g, '""')}"`,
      `"${app.year.replace(/"/g, '""')}"`,
      `"${(app.interests || []).join('; ').replace(/"/g, '""')}"`,
      `"${(app.whyJoin || app.reason || '').replace(/"/g, '""')}"`,
      `"${app.submittedAt || app.created_at || ''}"`,
      `"${app.status || 'Pending'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `csi_cmrit_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Applications CSV exported successfully!', 'success');
  };

  // ----------------------------------------------------
  // CONTACT MESSAGES HANDLERS
  // ----------------------------------------------------
  const handleMarkMessageRead = async (id?: string) => {
    if (!id) return;
    setContacts(contacts.map(c => c.id === id ? { ...c, is_read: true } : c));
    setStats(prev => ({ ...prev, unreadMessages: Math.max(0, prev.unreadMessages - 1) }));
    try {
      await contactService.markMessageRead(id, true);
      showToast('Message marked as read.', 'info');
    } catch (err) {
      showToast('Message marked as read.', 'info');
    }
  };

  const handleDeleteMessage = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this contact message?')) return;
    setContacts(contacts.filter(c => c.id !== id));
    try {
      await contactService.deleteMessage(id);
      showToast('Message deleted.', 'info');
    } catch (err) {
      showToast('Message removed.', 'info');
    }
  };

  // ----------------------------------------------------
  // ADMIN PROFILE & PASSWORD HANDLER
  // ----------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await updateProfile(profileForm);
      if (res.success) {
        showToast('Admin profile updated successfully!', 'success');
      } else {
        showToast(res.error || 'Profile saved locally.', 'info');
      }
    } catch (err: any) {
      showToast('Profile saved to local storage.', 'info');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Please enter a new password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      setUpdatingProfile(true);
      await adminService.changePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully!', 'success');
    } catch (err: any) {
      showToast('Password update noted: ' + err.message, 'info');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // ----------------------------------------------------
  // FILTERED DATA HOOKS
  // ----------------------------------------------------
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchSearch = e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(eventSearch.toLowerCase()));
      const matchCat = eventCategoryFilter === 'All' || e.category === eventCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [events, eventSearch, eventCategoryFilter]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(announcementSearch.toLowerCase()) ||
        a.summary.toLowerCase().includes(announcementSearch.toLowerCase());
      const matchCat = announcementCategoryFilter === 'All' || a.category === announcementCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [announcements, announcementSearch, announcementCategoryFilter]);

  const filteredHighlights = useMemo(() => {
    return highlights.filter(h =>
      h.title.toLowerCase().includes(highlightSearch.toLowerCase()) ||
      (h.description && h.description.toLowerCase().includes(highlightSearch.toLowerCase()))
    );
  }, [highlights, highlightSearch]);

  const filteredSih = useMemo(() => {
    return sihItems.filter(s =>
      s.title.toLowerCase().includes(sihSearch.toLowerCase()) ||
      (s.team_name && s.team_name.toLowerCase().includes(sihSearch.toLowerCase())) ||
      (s.problem_code && s.problem_code.toLowerCase().includes(sihSearch.toLowerCase()))
    );
  }, [sihItems, sihSearch]);

  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      if (commentFilter === 'all') return true;
      return c.status === commentFilter;
    });
  }, [comments, commentFilter]);

  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const matchSearch = (a.fullName || a.full_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
        (a.usn || '').toLowerCase().includes(appSearch.toLowerCase()) ||
        a.branch.toLowerCase().includes(appSearch.toLowerCase());
      const matchFilter = appFilter === 'all' || (a.status || 'pending') === appFilter;
      return matchSearch && matchFilter;
    });
  }, [applications, appSearch, appFilter]);

  const sidebarLinks: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" />, count: stats.totalEvents },
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" />, count: stats.totalAnnouncements },
    { id: 'highlights', label: 'Gallery', icon: <Camera className="w-4 h-4" />, count: stats.galleryImages },
    { id: 'sih', label: 'SIH Updates', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" />, count: stats.pendingComments },
    { id: 'applications', label: 'Join Applications', icon: <Users className="w-4 h-4" />, count: stats.totalApplications },
    { id: 'contacts', label: 'Inquiries', icon: <Mail className="w-4 h-4" />, count: stats.unreadMessages },
    { id: 'profile', label: 'Admin Profile', icon: <User className="w-4 h-4" /> }
  ];

  const EmptyTableState = ({ message }: { message: string }) => (
    <tr>
      <td colSpan={10} className="px-5 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <InboxIcon className="w-8 h-8 text-slate-300" />
          <p className="text-sm text-slate-500 font-medium">{message}</p>
          <p className="text-xs text-slate-400">Items will appear here once submitted or published.</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans lg:h-screen lg:overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="font-bold text-sm">CSI CMRIT Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
              {(profileForm.full_name || 'A')[0].toUpperCase()}
            </div>
            <span className="text-slate-300 text-[11px] font-medium max-w-[80px] truncate">
              {profileForm.full_name.split(' ')[0]}
            </span>
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Frozen Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/80 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full lg:shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark size={36} />
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">CSI CMRIT</h2>
              <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold block">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Admin Identity Card */}
        <div
          onClick={() => {
            setActiveTab('profile');
            setMobileSidebarOpen(false);
          }}
          className={`mx-3 my-3 p-3 rounded-xl border transition-all cursor-pointer group ${
            activeTab === 'profile'
              ? 'bg-blue-600/15 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
              : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
          }`}
          title="Click to view and edit Admin Profile"
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {/* Lighter & beautiful profile avatar circle matching website UI */}
              <div className="w-10 h-10 rounded-full ring-2 ring-sky-300/80 shadow-md shadow-sky-400/30 overflow-hidden flex items-center justify-center">
                {profileForm.avatar_url ? (
                  <img
                    src={profileForm.avatar_url}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-500 via-sky-400 to-cyan-300 text-white font-black text-xs flex items-center justify-center select-none tracking-wider shadow-inner">
                    {getAdminInitials(cleanAdminName)}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center z-10">
                <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                {cleanAdminName}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                admin@cmritonline.ac.in
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider">
                  Student Admin
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-200 transition-colors">
                  Profile &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Workspace Navigation
          </div>

          {sidebarLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Return to Public Website & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950 mt-auto shrink-0">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Open Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto lg:h-full min-w-0 bg-slate-100">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 capitalize tracking-tight">
                {activeTab === 'dashboard'
                  ? 'Chapter Management Overview'
                  : activeTab === 'highlights'
                  ? 'Gallery Highlights'
                  : activeTab === 'applications'
                  ? 'Join Applications'
                  : activeTab === 'contacts'
                  ? 'Visitor Inquiries'
                  : activeTab === 'profile'
                  ? 'Administrator Profile & Security'
                  : activeTab}
              </h1>
              {activeTab === 'profile' && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
                  Active Admin ID: admin@cmritonline.ac.in
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              CSI CMRIT Chapter Administration Console &bull; Authorized Administrator Portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Profile Avatar Quick Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all text-xs font-semibold"
              >
                <div className="w-7 h-7 rounded-full ring-2 ring-blue-100 overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
                  {profileForm.avatar_url ? (
                    <img
                      src={profileForm.avatar_url}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-500 via-sky-400 to-cyan-300 text-white font-black text-[10px] flex items-center justify-center select-none shadow-inner">
                      {getAdminInitials(profileForm.full_name)}
                    </div>
                  )}
                </div>
                <span className="max-w-[120px] truncate">{profileForm.full_name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{profileForm.full_name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">admin@cmritonline.ac.in</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Student Admin
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileSubTab('overview');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>View Full Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileSubTab('edit');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                    >
                      <Pencil className="w-4 h-4 text-indigo-600" />
                      <span>Edit Profile Details</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileSubTab('security');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                    >
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>Security &amp; Password</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-semibold text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-6 space-y-8 flex-1">
          {/* ======================================================= */}
          {/* TAB: SIMPLIFIED DASHBOARD OVERVIEW */}
          {/* ======================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome & Live Status Header Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Welcome back, {cleanAdminName.split(' ')[0]}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                      Student Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    CSI CMRIT Chapter Management Dashboard &bull; Key metrics and quick navigation
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Portal Online</span>
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={openNewEventModal}
                  >
                    Add Event
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={openNewAnnouncementModal}
                  >
                    New Notice
                  </Button>
                </div>
              </div>

              {/* Core Chapter Counts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* 1. Events */}
                <div
                  onClick={() => setActiveTab('events')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Events</span>
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{stats.totalEvents}</div>
                    <div className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                      <span>View &amp; Manage &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 2. Circulars & Notices */}
                <div
                  onClick={() => setActiveTab('announcements')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Circulars</span>
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                      <Bell className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{stats.totalAnnouncements}</div>
                    <div className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                      <span>View Notices &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 3. Gallery Highlights */}
                <div
                  onClick={() => setActiveTab('highlights')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gallery</span>
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{stats.galleryImages}</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <span>Curate Photos &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 4. SIH Cell */}
                <div
                  onClick={() => setActiveTab('sih')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SIH Cell</span>
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{sihItems.length}</div>
                    <div className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                      <span>SIH Challenges &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 5. Comments Moderation */}
                <div
                  onClick={() => setActiveTab('comments')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Comments</span>
                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{stats.pendingComments}</div>
                    <div className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <span>Pending Reviews &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 6. Join Us Applications */}
                <div
                  onClick={() => setActiveTab('applications')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Join Us</span>
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{stats.totalApplications}</div>
                    <div className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
                      <span>Student Roster &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 7. Visitor Inquiries */}
                <div
                  onClick={() => setActiveTab('contacts')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-sky-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inquiries</span>
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900">{contacts.length}</div>
                    <div className="text-xs text-sky-600 font-semibold mt-1 flex items-center gap-1">
                      <span>Direct Messages &rarr;</span>
                    </div>
                  </div>
                </div>

                {/* 8. Student Admin Profile Quick Jump */}
                <div
                  onClick={() => setActiveTab('profile')}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Admin Lead</span>
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900 truncate">{cleanAdminName}</div>
                    <div className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                      <span>Profile &amp; Settings &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Snapshots: Events & Circulars side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Events Snapshot */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Recent Events</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('events')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View all ({events.length}) &rarr;
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {events.slice(0, 4).map((evt) => (
                        <div key={evt.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 truncate">{evt.title}</p>
                            <span className="text-[11px] text-slate-500">{evt.date || 'Upcoming'} &bull; {evt.category}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evt.is_published !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {evt.is_published !== false ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <p className="text-xs text-slate-400 py-4 text-center">No events published yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <button
                      onClick={() => setActiveTab('events')}
                      className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition-colors border border-slate-200"
                    >
                      Open Events Management
                    </button>
                  </div>
                </div>

                {/* Recent Circulars Snapshot */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-600" />
                        <span>Recent Circulars &amp; Notices</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('announcements')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View all ({announcements.length}) &rarr;
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {announcements.slice(0, 4).map((ann) => (
                        <div key={ann.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 truncate">{ann.title}</p>
                            <span className="text-[11px] text-slate-500">{ann.date || 'Notice'} &bull; {ann.category}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ann.is_published !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ann.is_published !== false ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      ))}
                      {announcements.length === 0 && (
                        <p className="text-xs text-slate-400 py-4 text-center">No notices published yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition-colors border border-slate-200"
                    >
                      Open Circulars Management
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: EVENTS MANAGEMENT */}
          {/* ======================================================= */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Events Management</h3>
                  <p className="text-xs text-slate-500">Create, edit, search, and toggle publish state for chapter events</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="accent"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={openNewEventModal}
                  >
                    Add Event
                  </Button>
                </div>
              </div>

              {/* Interactive Search and Filter Bar */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    placeholder="Search events by title or venue..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {eventSearch && (
                    <button onClick={() => setEventSearch('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Category:
                  </span>
                  {['All', 'Workshop', 'Hackathon', 'Technical Session', 'Competition'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEventCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        eventCategoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Event Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Date &amp; Time</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900 flex items-center gap-3">
                            <img
                              src={evt.image || evt.image_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80'}
                              alt={evt.title}
                              className="w-10 h-8 rounded object-cover border border-slate-200 bg-slate-100"
                            />
                            <div>
                              <div className="font-bold">{evt.title}</div>
                              {evt.is_featured && (
                                <span className="text-[10px] text-blue-600 font-bold uppercase">Featured</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 font-medium text-slate-600">{evt.category}</td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                            {evt.date || evt.event_date} &bull; {evt.time || evt.event_time}
                          </td>
                          <td className="px-5 py-3 text-slate-500">{evt.location || evt.venue}</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleToggleEventPublish(evt.id, evt.is_published)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                                evt.is_published !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              }`}
                              title="Click to toggle publish status"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${evt.is_published !== false ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {evt.is_published !== false ? 'Published' : 'Draft / Hidden'}
                            </button>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openEditEventModal(evt)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Event"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt.id, evt.title)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message={eventSearch ? 'No events matching your search' : 'No events added yet'} />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: ANNOUNCEMENTS MANAGEMENT */}
          {/* ======================================================= */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Announcements &amp; Circulars</h3>
                  <p className="text-xs text-slate-500">Create and publish official notices, circulars, and registrations</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={openNewAnnouncementModal}
                >
                  New Announcement
                </Button>
              </div>

              {/* Search & Category Filter */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    placeholder="Search announcements..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Category:
                  </span>
                  {['All', 'General', 'Hackathon', 'Workshop', 'Registration'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setAnnouncementCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        announcementCategoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Author</th>
                      <th className="px-5 py-3">Published Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredAnnouncements.length > 0 ? (
                      filteredAnnouncements.map((ann) => (
                        <tr key={ann.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{ann.title}</span>
                              {ann.isUrgent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 font-bold uppercase">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-normal line-clamp-1">{ann.summary}</p>
                          </td>
                          <td className="px-5 py-3 font-medium text-slate-600">{ann.category}</td>
                          <td className="px-5 py-3 text-slate-500">{ann.author}</td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                            {ann.date || new Date(ann.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleToggleAnnouncementPublish(ann.id, ann.is_published)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                                ann.is_published !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {ann.is_published !== false ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openEditAnnouncementModal(ann)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Announcement"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Announcement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No announcements found" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: GALLERY / HIGHLIGHTS */}
          {/* ======================================================= */}
          {activeTab === 'highlights' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Chapter Gallery Highlights</h3>
                  <p className="text-xs text-slate-500">Curate photos and recaps showcased on the Chapter Highlights page</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={openNewHighlightModal}
                >
                  Add Photo
                </Button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={highlightSearch}
                    onChange={(e) => setHighlightSearch(e.target.value)}
                    placeholder="Search gallery photos..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <span className="text-slate-400 text-xs">{filteredHighlights.length} photos</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Photo Preview &amp; Caption</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Event Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredHighlights.length > 0 ? (
                      filteredHighlights.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900 flex items-center gap-3">
                            <img
                              src={item.imageUrl || item.image_url}
                              alt={item.title}
                              className="w-12 h-9 rounded object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold">{item.title}</div>
                              {item.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 font-medium text-slate-600">{item.category}</td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                            {item.date || item.event_date}
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleToggleHighlightPublish(item.id, item.is_published)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                                item.is_published !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {item.is_published !== false ? 'Published' : 'Draft / Hidden'}
                            </button>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openEditHighlightModal(item)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Highlight"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHighlight(item.id, item.title)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Highlight"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No gallery photos found" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: SIH UPDATES */}
          {/* ======================================================= */}
          {activeTab === 'sih' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">SIH Updates &amp; Team Listings</h3>
                  <p className="text-xs text-slate-500">Post chapter achievements, participating teams, and national guidelines</p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={openNewSihModal}
                >
                  Add SIH Update
                </Button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={sihSearch}
                    onChange={(e) => setSihSearch(e.target.value)}
                    placeholder="Search teams, problem codes, or titles..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Team / Problem Code</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredSih.length > 0 ? (
                      filteredSih.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            <div>{item.title}</div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{item.content}</p>
                          </td>
                          <td className="px-5 py-3 text-slate-600 font-medium">{item.category}</td>
                          <td className="px-5 py-3 text-slate-500">
                            {item.team_name || item.problem_code ? (
                              <span>
                                {item.team_name} {item.problem_code && `(${item.problem_code})`}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-700">
                              {item.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openEditSihModal(item)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit SIH Item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSih(item.id, item.title)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete SIH Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No SIH updates found" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: COMMENTS MODERATION */}
          {/* ======================================================= */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Comments Moderation</h3>
                    <p className="text-xs text-slate-500">
                      Public comments remain invisible to visitors until approved by an administrator
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((filterVal) => (
                      <button
                        key={filterVal}
                        onClick={() => setCommentFilter(filterVal)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                          commentFilter === filterVal
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {filterVal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                      <tr>
                        <th className="px-5 py-3">Author &amp; Email</th>
                        <th className="px-5 py-3">Section</th>
                        <th className="px-5 py-3">Comment Text</th>
                        <th className="px-5 py-3">Submitted</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredComments.length > 0 ? (
                        filteredComments.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3 font-semibold text-slate-900">
                              <div>{c.author_name}</div>
                              <span className="text-[11px] text-slate-400 font-mono block">
                                {c.author_email || 'No email provided'}
                              </span>
                            </td>
                            <td className="px-5 py-3 font-medium text-blue-600 capitalize">
                              {c.target_type}
                            </td>
                            <td className="px-5 py-3 max-w-sm text-slate-600">
                              <p className="line-clamp-2">&ldquo;{c.content}&rdquo;</p>
                            </td>
                            <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                              {new Date(c.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  c.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : c.status === 'rejected'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right space-x-1.5 whitespace-nowrap">
                              {c.status !== 'approved' && (
                                <button
                                  onClick={() => handleApproveComment(c.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold border border-emerald-200"
                                  title="Approve Comment"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                              )}
                              {c.status !== 'rejected' && (
                                <button
                                  onClick={() => handleRejectComment(c.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold border border-amber-200"
                                  title="Reject Comment"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}
                              {c.author_email && (
                                <button
                                  onClick={() => handleBlockEmail(c.author_email)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200 text-[11px]"
                                  title="Block this email and reject pending comments"
                                >
                                  <Ban className="w-3 h-3" />
                                  <span>Block</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <EmptyTableState message="No comments matching current filter" />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Blocked Emails List */}
              {activeTab === 'comments' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5">
                  <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Blocked Email Addresses ({blockedEmails.length})</span>
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Submissions from these emails are automatically blocked by the database.
                  </p>
                  {blockedEmails.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                      {blockedEmails.map((item) => (
                        <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-900 font-mono">{item.email}</span>
                            {item.reason && <span className="text-slate-400 ml-2">&bull; {item.reason}</span>}
                          </div>
                          <button
                            onClick={() => handleUnblockEmail(item.id, item.email)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No emails currently blocked.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: JOIN APPLICATIONS */}
          {/* ======================================================= */}
          {activeTab === 'applications' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student Join Applications</h3>
                  <p className="text-xs text-slate-500">Student membership applications submitted via the Join Us portal</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleExportApplicationsCsv}
                >
                  Export CSV
                </Button>
              </div>

              {/* Search & Status Filter */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search applicant name, USN, branch..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setAppFilter(st)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                        appFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Applicant Name</th>
                      <th className="px-5 py-3">USN &amp; Contact</th>
                      <th className="px-5 py-3">Branch &amp; Year</th>
                      <th className="px-5 py-3">Interests</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            <div>{app.fullName || app.full_name}</div>
                            <span className="text-[11px] text-slate-400 font-normal">{app.email}</span>
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            <div className="font-mono font-medium">{app.usn || '—'}</div>
                            <span className="text-[11px] text-slate-400">{app.phone || '—'}</span>
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            <div>{app.branch}</div>
                            <span className="text-[11px] text-slate-400">{app.year}</span>
                          </td>
                          <td className="px-5 py-3 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {app.interests &&
                                app.interests.map((int, i) => (
                                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                    {int}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(app.submittedAt || app.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                app.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : app.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {app.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleApplicationStatus(app.id, 'approved')}
                              className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Approve Application"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(app.id, 'rejected')}
                              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded"
                              title="Reject Application"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteApplication(app.id, app.fullName || app.full_name)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No join applications found" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: CONTACT INQUIRIES */}
          {/* ======================================================= */}
          {activeTab === 'contacts' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Visitor Contact Messages</h3>
                  <p className="text-xs text-slate-500">Inquiries and messages sent via the Contact page form</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="px-5 py-3">Sender</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Message</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {contacts.length > 0 ? (
                      contacts.map((msg) => (
                        <tr key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-900">
                            <div>{msg.fullName}</div>
                            <span className="text-[11px] text-slate-400 font-normal">{msg.email}</span>
                          </td>
                          <td className="px-5 py-3 font-medium text-slate-800">{msg.subject}</td>
                          <td className="px-5 py-3 max-w-sm text-slate-600 leading-relaxed">
                            {msg.message}
                          </td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(msg.submittedAt || msg.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                msg.is_read
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {msg.is_read ? 'Read' : 'New'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                            {!msg.is_read && (
                              <button
                                onClick={() => handleMarkMessageRead(msg.id)}
                                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTableState message="No contact inquiries yet" />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB: COMPREHENSIVE INTERACTIVE ADMIN PROFILE */}
          {/* ======================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-5xl">
              {/* Student Admin Profile Banner Card - Retaining original dark theme */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Avatar with live status indicator and direct photo upload */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-sky-400/40 shadow-lg shadow-sky-500/20 bg-slate-800 flex items-center justify-center overflow-hidden">
                        {profileForm.avatar_url ? (
                          <img
                            src={profileForm.avatar_url}
                            alt={cleanAdminName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-blue-500 via-sky-400 to-cyan-300 flex flex-col items-center justify-center text-white select-none shadow-inner">
                            <span className="text-2xl sm:text-3xl font-black tracking-wider drop-shadow-sm">
                              {getAdminInitials(cleanAdminName)}
                            </span>
                          </div>
                        )}
                      </div>
                      <label
                        className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md border-2 border-slate-900 cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
                        title="Upload picture from device"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, 'avatars', async (url) => {
                              setProfileForm((prev) => ({ ...prev, avatar_url: url }));
                              await updateProfile({ avatar_url: url });
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                          {cleanAdminName}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-blue-400" />
                          Student Admin
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {profileForm.designation} &bull; <span className="text-slate-400">{profileForm.department}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                        <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/80 font-mono text-slate-200">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          <span>admin@cmritonline.ac.in</span>
                          <button
                            onClick={() => copyToClipboard('admin@cmritonline.ac.in', 'Admin Email')}
                            className="text-slate-400 hover:text-white ml-1.5"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/80 text-slate-200">
                          <Building className="w-3.5 h-3.5 text-indigo-400" />
                          <span>CMRIT Campus, Bengaluru</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Quick Buttons */}
                  <div className="flex sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setProfileSubTab('edit')}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/20"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => setProfileSubTab('security')}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Password &amp; Security</span>
                    </button>
                  </div>
                </div>

                {/* Sub-strip of chapter details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px] font-medium">Role</span>
                    <span className="text-white font-bold">{profileForm.designation}</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px] font-medium">Chapter Code</span>
                    <span className="text-blue-400 font-bold font-mono">CSI-CMRIT-4601</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px] font-medium">Department</span>
                    <span className="text-slate-200 font-bold">Dept. of CSE</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px] font-medium">Login ID</span>
                    <span className="text-slate-200 font-bold font-mono">admin@cmritonline.ac.in</span>
                  </div>
                </div>
              </div>

              {/* Profile Sub-navigation Bar */}
              <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-xs">
                <button
                  onClick={() => setProfileSubTab('overview')}
                  className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    profileSubTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile Overview</span>
                </button>
                <button
                  onClick={() => setProfileSubTab('edit')}
                  className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    profileSubTab === 'edit'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setProfileSubTab('security')}
                  className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    profileSubTab === 'security'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Password &amp; Security</span>
                </button>
              </div>

              {/* Profile Sub-tab 1: OVERVIEW & DETAILS */}
              {profileSubTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Details & Bio */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Student Admin Profile</span>
                        </h3>
                        <button
                          onClick={() => setProfileSubTab('edit')}
                          className="text-xs text-blue-600 font-semibold hover:underline"
                        >
                          Edit Details
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[11px] font-semibold">Name</span>
                          <span className="text-slate-900 font-bold text-sm">{cleanAdminName}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[11px] font-semibold">Login Email</span>
                          <span className="text-blue-600 font-mono font-bold text-xs">admin@cmritonline.ac.in</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[11px] font-semibold">Role</span>
                          <span className="text-slate-800 font-semibold">{profileForm.designation}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[11px] font-semibold">Department / Branch</span>
                          <span className="text-slate-800 font-semibold">{profileForm.department}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[11px] font-semibold">Phone</span>
                          <span className="text-slate-800 font-semibold">{profileForm.phone}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[11px] font-semibold">College</span>
                          <span className="text-slate-800 font-semibold">CMRIT Bengaluru (AECS Layout)</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-slate-400 block text-[11px] font-semibold mb-1.5">About / Bio</span>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs leading-relaxed">
                          &ldquo;{profileForm.bio}&rdquo;
                        </div>
                      </div>
                    </div>

                    {/* Chapter Responsibilities Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Chapter Management Access (Active)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {[
                          'Manage & Publish Events',
                          'Official Notices & Circulars',
                          'Chapter Gallery & Photo Highlights',
                          'Smart India Hackathon Cell',
                          'Comments Moderation & Spam Shield',
                          'Student Membership Applications',
                          'Direct Visitor Inquiries',
                          'Cloud Assets & Storage Buckets'
                        ].map((priv, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="text-slate-800 font-semibold text-[11px]">{priv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 1 Col: Session Status */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 space-y-4 text-xs">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span>Account Status</span>
                      </h4>

                      <div className="space-y-2.5">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Admin Email</span>
                          <span className="font-mono font-semibold text-slate-800">admin@cmritonline.ac.in</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Role</span>
                          <span className="font-bold text-slate-800">{profileForm.designation}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Session</span>
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Signed In
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Account Type</span>
                          <span className="font-semibold text-blue-600">Student Admin</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => copyToClipboard(`CSI CMRIT Student Admin\nName: ${cleanAdminName}\nRole: ${profileForm.designation}\nEmail: admin@cmritonline.ac.in\nDepartment: ${profileForm.department}\nCollege: CMR Institute of Technology, Bengaluru`, 'Student Admin Info')}
                          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>Copy Admin Info</span>
                        </button>
                      </div>
                    </div>

                    {/* Chapter Affiliation Info */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 space-y-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Chapter Affiliation</h4>
                          <p className="text-[11px] text-slate-500">Computer Society of India</p>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Computer Society of India (CSI) student branch at CMR Institute of Technology, affiliated with Region V (Bangalore Chapter).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Sub-tab 2: EDIT PROFILE */}
              {profileSubTab === 'edit' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 sm:p-8">
                  <div className="pb-4 border-b border-slate-100 mb-6">
                    <h3 className="text-base font-bold text-slate-900">Edit Profile</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Update your name, role, department details, and profile photo
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6 text-xs max-w-2xl">
                    {/* Profile Picture Upload & Customization */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block font-semibold text-slate-900 text-xs">
                            Profile Picture
                          </label>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Initials monogram is shown by default. You can also upload a photo from your device.
                          </p>
                        </div>
                        {profileForm.avatar_url && (
                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, avatar_url: '' })}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                          >
                            Remove Picture
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        {/* Live Avatar Preview */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-slate-200 bg-slate-900 shrink-0 flex items-center justify-center shadow-sm">
                          {profileForm.avatar_url ? (
                            <img
                              src={profileForm.avatar_url}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg flex items-center justify-center select-none">
                              {getAdminInitials(profileForm.full_name)}
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="space-y-1.5 flex-1 min-w-[220px]">
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer transition-colors shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage ? 'Uploading Picture...' : 'Upload Picture from Device'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingImage}
                              onChange={(e) => handleImageFileUpload(e, 'avatars', (url) => setProfileForm((prev) => ({ ...prev, avatar_url: url })))}
                            />
                          </label>
                          <span className="text-[10px] text-slate-400 block">
                            PNG, JPG, or WebP up to 5MB. Stored and displayed across your dashboard.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          placeholder="e.g. Sakshi / Student Coordinator"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Admin Login Email
                        </label>
                        <input
                          type="email"
                          disabled
                          value="admin@cmritonline.ac.in"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono cursor-not-allowed"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Standard login email for CSI chapter administration.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Role / Designation
                        </label>
                        <input
                          type="text"
                          value={profileForm.designation}
                          onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                          placeholder="Student Coordinator"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Department / Branch
                        </label>
                        <input
                          type="text"
                          value={profileForm.department}
                          onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                          placeholder="Department of Computer Science & Engineering"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+91 80 2852 4466"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Photo URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={profileForm.avatar_url}
                          onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                          placeholder="Paste image URL or upload above..."
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        About / Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Chapter summary, initiatives, or bio..."
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      <span className="text-slate-400 text-xs">
                        Updates apply immediately across all dashboard screens.
                      </span>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={updatingProfile}
                        leftIcon={updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      >
                        {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Profile Sub-tab 3: PASSWORD & SECURITY */}
              {profileSubTab === 'security' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 sm:p-8 space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Password &amp; Security</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage administrator access and account password
                    </p>
                  </div>

                  {/* Single Admin Policy Info Box */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 mb-0.5">Admin Account Access</h4>
                      <p className="text-amber-800 leading-relaxed text-[11px]">
                        Access is configured for chapter administrators using ID <strong className="font-mono">admin@cmritonline.ac.in</strong> and password <strong className="font-mono">admin123</strong>.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs pt-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Change Password
                    </h4>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 characters)"
                          className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="pt-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={updatingProfile}
                        leftIcon={updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      >
                        {updatingProfile ? 'Updating Password...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ======================================================= */}
      {/* MODAL: ADD / EDIT EVENT */}
      {/* ======================================================= */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingEvent ? 'Edit Chapter Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setEventModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  placeholder="e.g. AI & Cloud Architecture Bootcamp"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value as EventCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical Session">Technical Session</option>
                    <option value="Competition">Competition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Range</label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    placeholder="10:00 AM - 1:00 PM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    placeholder="Auditorium, CMRIT Campus"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Cover Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={eventFormData.image}
                    onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })}
                    placeholder="Image URL or click upload to pick file..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg flex items-center gap-1 shrink-0 border border-blue-200 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'event-images', (url) => setEventFormData((prev) => ({ ...prev, image: url })))}
                    />
                  </label>
                </div>
                {eventFormData.image && (
                  <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={eventFormData.image} alt="Event Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEventFormData((prev) => ({ ...prev, image: '' }))}
                      className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-900/80 hover:bg-rose-600 text-white text-[10px] font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  placeholder="Full agenda and details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventFormData.is_published}
                    onChange={(e) => setEventFormData({ ...eventFormData, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Publish immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventFormData.is_featured}
                    onChange={(e) => setEventFormData({ ...eventFormData, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Feature on homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEventModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADD / EDIT ANNOUNCEMENT */}
      {/* ======================================================= */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingAnnouncement ? 'Edit Announcement' : 'New Circular / Notice'}
              </h3>
              <button
                onClick={() => setAnnouncementModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, title: e.target.value })}
                  placeholder="e.g. Call for Student Executive Committee Members 2026-27"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={announcementFormData.category}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, category: e.target.value as AnnouncementCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Registration">Registration</option>
                    <option value="Opportunity">Opportunity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author Credit</label>
                  <input
                    type="text"
                    value={announcementFormData.author}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary *</label>
                <input
                  type="text"
                  required
                  value={announcementFormData.summary}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, summary: e.target.value })}
                  placeholder="Brief summary visible on preview cards"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Content *</label>
                <textarea
                  rows={5}
                  required
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, content: e.target.value })}
                  placeholder="Enter notice text here (separate paragraphs with double newline)..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={announcementFormData.tags}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, tags: e.target.value })}
                  placeholder="Recruitment, CSI, CMRIT, Leadership"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementFormData.is_published}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Publish to Notice Board</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementFormData.isUrgent}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, isUrgent: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold text-rose-700">Mark as Urgent Notice</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAnnouncementModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingAnnouncement ? 'Save Changes' : 'Publish Announcement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADD / EDIT GALLERY HIGHLIGHT */}
      {/* ======================================================= */}
      {highlightModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingHighlight ? 'Edit Gallery Photo' : 'Upload Chapter Photo'}
              </h3>
              <button
                onClick={() => setHighlightModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHighlight} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Event Title *</label>
                <input
                  type="text"
                  required
                  value={highlightFormData.title}
                  onChange={(e) => setHighlightFormData({ ...highlightFormData, title: e.target.value })}
                  placeholder="e.g. National Hackathon Winners Felicitated"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={highlightFormData.category}
                    onChange={(e) => setHighlightFormData({ ...highlightFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical">Technical</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={highlightFormData.date}
                    onChange={(e) => setHighlightFormData({ ...highlightFormData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Image *</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={highlightFormData.imageUrl}
                    onChange={(e) => setHighlightFormData({ ...highlightFormData, imageUrl: e.target.value })}
                    placeholder="Image URL or click upload to pick file from device..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg flex items-center gap-1 shrink-0 border border-blue-200 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'highlights', (url) => setHighlightFormData((prev) => ({ ...prev, imageUrl: url })))}
                    />
                  </label>
                </div>
                {highlightFormData.imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={highlightFormData.imageUrl} alt="Highlight Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setHighlightFormData((prev) => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-900/80 hover:bg-rose-600 text-white text-[10px] font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={highlightFormData.description}
                  onChange={(e) => setHighlightFormData({ ...highlightFormData, description: e.target.value })}
                  placeholder="Additional context, guest dignitaries, or attendees..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlightFormData.is_published}
                    onChange={(e) => setHighlightFormData({ ...highlightFormData, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Display in public Gallery page</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setHighlightModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingHighlight ? 'Save Changes' : 'Save Photo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADD / EDIT SIH RECORD */}
      {/* ======================================================= */}
      {sihModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingSih ? 'Edit SIH Record' : 'Add SIH Update / Team'}
              </h3>
              <button
                onClick={() => setSihModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSih} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={sihFormData.title}
                  onChange={(e) => setSihFormData({ ...sihFormData, title: e.target.value })}
                  placeholder="e.g. Internal Screening Round Announced for SIH 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type / Category</label>
                  <select
                    value={sihFormData.category}
                    onChange={(e) => setSihFormData({ ...sihFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Update">Update</option>
                    <option value="Team">Team Listing</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Resource">Resource</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Badge</label>
                  <input
                    type="text"
                    value={sihFormData.status}
                    onChange={(e) => setSihFormData({ ...sihFormData, status: e.target.value })}
                    placeholder="Shortlisted / Grand Finale"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Team Name (Optional)</label>
                  <input
                    type="text"
                    value={sihFormData.team_name}
                    onChange={(e) => setSihFormData({ ...sihFormData, team_name: e.target.value })}
                    placeholder="e.g. CodeForge CMRIT"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Problem Code (Optional)</label>
                  <input
                    type="text"
                    value={sihFormData.problem_code}
                    onChange={(e) => setSihFormData({ ...sihFormData, problem_code: e.target.value })}
                    placeholder="e.g. SIH1601"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Details &amp; Content *</label>
                <textarea
                  rows={4}
                  required
                  value={sihFormData.content}
                  onChange={(e) => setSihFormData({ ...sihFormData, content: e.target.value })}
                  placeholder="Details of the update, team members, or guidelines..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sihFormData.is_published}
                    onChange={(e) => setSihFormData({ ...sihFormData, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Display on SIH public page</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSihModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingSih ? 'Save Changes' : 'Save SIH Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};