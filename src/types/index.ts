export type EventCategory = 
  | 'All' 
  | 'Workshops' 
  | 'Hackathons' 
  | 'Competitions' 
  | 'Technical Sessions' 
  | 'Other';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: Exclude<EventCategory, 'All'>;
  date: string;
  isoDate: string;
  time: string;
  venue: string;
  mode: 'In-person' | 'Hybrid' | 'Virtual';
  shortDescription: string;
  description: string;
  highlights: string[];
  expectations: string[];
  speaker?: {
    name: string;
    role: string;
    organization?: string;
    image?: string;
  };
  organizer: string;
  image: string;
  galleryImages?: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationOpen: boolean;
}

export type AnnouncementCategory = 
  | 'All'
  | 'General'
  | 'Hackathon'
  | 'Workshop'
  | 'Registration'
  | 'Opportunity';

export interface AnnouncementItem {
  id: string;
  title: string;
  slug: string;
  category: Exclude<AnnouncementCategory, 'All'>;
  date: string;
  author: string;
  summary: string;
  content: string[];
  tags: string[];
  isUrgent?: boolean;
}

export type GalleryCategory = 
  | 'All'
  | 'Events'
  | 'Workshops'
  | 'Hackathons'
  | 'SIH'
  | 'Community';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  imageUrl: string;
  date: string;
  description: string;
  location?: string;
}

export interface JoinApplication {
  id: string;
  fullName: string;
  email: string;
  year: string;
  branch: string;
  phone: string;
  reason: string;
  interests: string[];
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface AdminComment {
  id: string;
  author: string;
  email: string;
  target: string;
  content: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
