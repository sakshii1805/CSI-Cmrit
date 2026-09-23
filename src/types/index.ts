// ==============================================================================
// Types for CSI CMRIT Application & Supabase Models
// ==============================================================================

// --- Content Status (shared across content types) ---
export type ContentStatus = 'draft' | 'published' | 'unpublished' | 'archived';

// --- Admin Authentication & Profile ---
export type AdminRole = 'admin' | 'super_admin';

export interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  avatar_url?: string | null;
  designation?: string;
  department?: string;
  phone?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

// --- Events ---
export type EventCategory = 
  | 'All' 
  | 'Workshop'
  | 'Hackathon'
  | 'Competition'
  | 'Technical Session'
  | 'Workshops'        // Legacy plural support
  | 'Hackathons'
  | 'Competitions'
  | 'Other';

export interface EventItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  event_date?: string;
  event_time?: string;
  venue?: string;
  description: string;
  image_url?: string | null;
  organizer?: string;
  highlights?: string[];
  registration_link?: string | null;
  status?: ContentStatus;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;

  // Frontend display aliases
  date?: string;
  time?: string;
  image?: string;
  location?: string;
  shortDescription?: string;
  mode?: 'In-person' | 'Hybrid' | 'Virtual';
  registrationOpen?: boolean;
  is_featured?: boolean;
  is_published?: boolean;
  is_pinned?: boolean;
  expectations?: string[];
  galleryImages?: string[];
  speaker?: {
    name: string;
    role?: string;
    organization?: string;
    avatar?: string;
  };
}

// --- Announcements ---
export type AnnouncementCategory = 
  | 'All'
  | 'General'
  | 'Hackathon'
  | 'Workshop'
  | 'Event'
  | 'Registration'
  | 'Opportunity';

export type AnnouncementPriority = 'high' | 'medium' | 'low' | 'normal';

export interface AnnouncementItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  summary: string;
  content: string[] | string;
  image_url?: string | null;
  attachment_url?: string | null;
  priority?: AnnouncementPriority;
  status?: ContentStatus;
  published_at?: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;

  // Frontend display aliases
  date?: string;
  author?: string;
  tags?: string[];
  isUrgent?: boolean;
  is_published?: boolean;
  is_pinned?: boolean;
}

// --- Chapter Highlights / Gallery ---
export type ChapterHighlightCategory = 
  | 'All'
  | 'Workshops'
  | 'Hackathons'
  | 'Competitions'
  | 'Technical Sessions'
  | 'Community'
  | 'Events'
  | 'Other';

export type GalleryCategory = ChapterHighlightCategory;

export interface ChapterHighlightItem {
  id: string;
  title: string;
  category: string;
  event_date?: string | null;
  caption?: string | null;
  image_url?: string;
  status?: ContentStatus;
  created_at?: string;
  updated_at?: string;

  // Frontend display aliases
  imageUrl?: string;
  images?: string[];
  date?: string;
  description?: string;
  location?: string;
  is_published?: boolean;
  is_pinned?: boolean;
}

export type GalleryItem = ChapterHighlightItem;

// --- Gallery Posts (Multi-image gallery system) ---
export interface GalleryPost {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category: string;
  cover_image?: string | null;
  event_date?: string | null;
  tags?: string[];
  status: ContentStatus;
  is_pinned?: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at?: string;
  // Joined data
  images?: GalleryImage[];
  image_count?: number;
}

export interface GalleryImage {
  id: string;
  gallery_post_id: string;
  image_url: string;
  caption?: string | null;
  display_order: number;
  created_at?: string;
}

// --- Activity Log ---
export interface ActivityLogItem {
  id: string;
  admin_id?: string | null;
  admin_name?: string | null;
  action: string;
  target_type: string;
  target_id?: string | null;
  target_title?: string | null;
  created_at: string;
}

// --- Join Us Applications ---
export interface JoinApplication {
  id: string;
  full_name?: string;
  email: string;
  year: string;
  branch: string;
  phone?: string;
  reason?: string;
  status?: 'pending' | 'approved' | 'rejected' | string;
  created_at?: string;
  updated_at?: string;

  // Frontend display aliases
  fullName?: string;
  usn?: string;
  whyJoin?: string;
  submittedAt?: string;
  interests?: string[];
}

// --- Contact Messages ---
export interface ContactMessage {
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  subject?: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
  submittedAt?: string;
}

// --- Comments System ---
export type CommentTargetType = 'highlight' | 'event' | 'announcement' | 'gallery_post';

export interface CommentItem {
  id: string;
  target_type: CommentTargetType;
  target_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface PublicComment {
  id: string;
  target_type: CommentTargetType;
  target_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface BlockedEmail {
  id: string;
  email: string;
  reason?: string | null;
  blocked_by?: string | null;
  created_at: string;
}

// Alias for admin comments
export interface AdminComment {
  id: string;
  author: string;
  email: string;
  target: string;
  content: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'pending' | 'approved' | 'rejected';
}
