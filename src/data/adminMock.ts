import { JoinApplication, AdminComment } from '../types';

// All stats start at zero — this is a new website with no published content.
// When backend is connected, these will be fetched from the database.
export const mockAdminStats = {
  totalEvents: 0,
  totalAnnouncements: 0,
  galleryImages: 0,
  pendingComments: 0,
  totalApplications: 0
};

// No applications yet — will populate when students submit the Join Us form.
export const mockRecentApplications: JoinApplication[] = [];

// No comments yet — will populate when visitors interact with published content.
export const mockPendingComments: AdminComment[] = [];
