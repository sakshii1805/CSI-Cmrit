import { JoinApplication, AdminComment } from '../types';

export const mockAdminStats = {
  totalEvents: 14,
  totalAnnouncements: 18,
  galleryImages: 42,
  pendingComments: 7,
  totalApplications: 36
};

export const mockRecentApplications: JoinApplication[] = [
  {
    id: 'app-101',
    fullName: 'Sai Vardhan Reddy',
    email: 'saivardhan.cmrit@example.com',
    year: '2nd Year',
    branch: 'Computer Science & Engineering',
    phone: '+91 98491 23456',
    reason: 'Deeply interested in competitive programming and cloud computing. Want to contribute to chapter open source projects and participate in SIH.',
    interests: ['Competitive Programming', 'Cloud & DevOps', 'Web Development'],
    submittedAt: 'Today at 10:30 AM',
    status: 'Pending'
  },
  {
    id: 'app-102',
    fullName: 'Pooja Kulkarni',
    email: 'pooja.k@example.com',
    year: '3rd Year',
    branch: 'Artificial Intelligence & Data Science',
    phone: '+91 97012 34567',
    reason: 'Working on natural language processing models. Looking to mentor juniors and collaborate on innovative AI research challenges.',
    interests: ['AI & Machine Learning', 'Technical Writing'],
    submittedAt: 'Yesterday at 4:15 PM',
    status: 'Pending'
  },
  {
    id: 'app-103',
    fullName: 'Karthik Ramanujan',
    email: 'karthik.r@example.com',
    year: '1st Year',
    branch: 'Information Technology',
    phone: '+91 94401 87654',
    reason: 'Eager to build a strong foundation in full stack development and get guidance from senior peers.',
    interests: ['Web Development', 'Open Source'],
    submittedAt: 'Sep 18, 2026',
    status: 'Approved'
  },
  {
    id: 'app-104',
    fullName: 'Meghana Rao',
    email: 'meghana.rao@example.com',
    year: '2nd Year',
    branch: 'Electronics & Communication',
    phone: '+91 91234 56789',
    reason: 'Passionate about IoT hardware integration and embedded systems for Smart India Hackathon problem statements.',
    interests: ['Hardware & IoT', 'Hackathons'],
    submittedAt: 'Sep 16, 2026',
    status: 'Pending'
  }
];

export const mockPendingComments: AdminComment[] = [
  {
    id: 'comm-01',
    author: 'Aditya Verma',
    email: 'aditya.v@example.com',
    target: 'Cloud Native Workshop',
    content: 'Will prerequisites like Docker desktop be configured on lab workstations, or should we bring our own setup pre-installed?',
    date: 'Sep 19, 2026',
    status: 'Pending'
  },
  {
    id: 'comm-02',
    author: 'Neha Singhania',
    email: 'neha.s@example.com',
    target: 'SIH 2026 Internal Screening',
    content: 'Can 1st-year students form mixed teams with 3rd-year seniors for the internal screening round?',
    date: 'Sep 18, 2026',
    status: 'Pending'
  },
  {
    id: 'comm-03',
    author: 'Rohit Balaji',
    email: 'rohit.b@example.com',
    target: 'CodeSprint 2026',
    content: 'Are hardware kits provided for IoT tracks or do teams need to supply sensors?',
    date: 'Sep 17, 2026',
    status: 'Pending'
  }
];
