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

export type ChapterHighlightCategory = 
  | 'All'
  | 'Events'
  | 'Workshops'
  | 'Hackathons'
  | 'SIH'
  | 'Community';

// Alias for backward compatibility
export type GalleryCategory = ChapterHighlightCategory;

export interface ChapterHighlightItem {
  id: string;
  title: string;
  category: Exclude<ChapterHighlightCategory, 'All'>;
  imageUrl: string;
  date: string;
  description: string;
  location?: string;
}

// Alias for backward compatibility
export type GalleryItem = ChapterHighlightItem;

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

export type SIHCategory = 'Software' | 'Hardware';
export type SIHComplexity = 'Breakthrough' | 'Moderate' | 'Foundational';
export type SIHEffort = 'High Effort' | 'Medium Effort' | 'Low Effort';

export interface SIHProblemStatement {
  id: string;
  code: string;
  title: string;
  organization: string;
  category: SIHCategory;
  theme: string;
  complexity: SIHComplexity;
  effort: SIHEffort;
  statusDot: 'green' | 'yellow' | 'blue';
  deadline: string;
  daysLeft: number;
  ideasCount: number;
  maxIdeas: number;
  description: string;
  expectedSolution: string;
  suggestedStack: string[];
  teamCompositionGuide: string;
  evaluatorFocus: string[];
}

