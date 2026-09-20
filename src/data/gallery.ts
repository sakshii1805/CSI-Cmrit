import { GalleryItem } from '../types';

export const mockGallery: GalleryItem[] = [
  {
    id: 'gal-campus-01',
    title: 'C.M.R. Institute of Technology Main Campus Façade',
    category: 'Community',
    imageUrl: '/images/cmrit_campus_front.png',
    date: '2026 Academic Year',
    description: 'The iconic central building and manicured grounds of CMR Institute of Technology, home to the CSI CMRIT Student Chapter.',
    location: 'CMRIT Main Campus, Hyderabad'
  },
  {
    id: 'gal-campus-02',
    title: 'CMRIT Innovation & Academic Wing',
    category: 'Community',
    imageUrl: '/images/cmrit_campus_wing.png',
    date: '2026 Academic Year',
    description: 'Perspective view of the state-of-the-art campus labs and student hub where CSI workshops and hackathons take place.',
    location: 'Computing & Innovation Blocks'
  },
  {
    id: 'gal-01',
    title: 'CodeSprint 24-Hour Hackathon Collaboration Hub',
    category: 'Hackathons',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    date: 'Spring 2026',
    description: 'Teams collaborating through the night developing software prototypes during the annual chapter hackathon.',
    location: 'CMRIT Innovation Wing'
  },
  {
    id: 'gal-02',
    title: 'Hands-on Cloud & Linux System Engineering Lab',
    category: 'Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    date: 'Fall 2026',
    description: 'Students working through interactive container orchestration and networking exercises.',
    location: 'Computing Center 4'
  },
  {
    id: 'gal-03',
    title: 'Smart India Hackathon Internal Pitch Review',
    category: 'SIH',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    date: 'September 2026',
    description: 'Student finalists presenting system architecture and UX workflows to senior faculty and mentor panel.',
    location: 'CMRIT Seminar Complex'
  },
  {
    id: 'gal-04',
    title: 'CSI CMRIT Annual Induction & Chapter Orientation',
    category: 'Community',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    date: 'August 2026',
    description: 'New members connecting with domain heads, chapter office bearers, and project coordinators.',
    location: 'Main Auditorium'
  },
  {
    id: 'gal-05',
    title: 'Technical Keynote on Distributed Enterprise Systems',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    date: 'July 2026',
    description: 'Industry guest keynote exploring modern microservices architectures and fault tolerance.',
    location: 'Auditorium Hall A'
  },
  {
    id: 'gal-06',
    title: 'Rapid Prototyping & Design Sprint Workshop',
    category: 'Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
    date: 'June 2026',
    description: 'Interactive wireframing and user experience validation session conducted for upcoming hackathon teams.',
    location: 'Design Thinking Studio'
  },
  {
    id: 'gal-07',
    title: 'SIH Hardware Prototype Testing & Sensor Calibration',
    category: 'SIH',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    date: 'May 2026',
    description: 'Interdisciplinary IoT and embedded systems team conducting validation trials on smart monitoring sensors.',
    location: 'Embedded Systems Lab'
  },
  {
    id: 'gal-08',
    title: 'Competitive Coding & Algorithmic Practice Circles',
    category: 'Community',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80',
    date: 'April 2026',
    description: 'Peer-to-peer algorithmic problem discussion analyzing dynamic programming and graph structures.',
    location: 'CSI Student Lounge'
  },
  {
    id: 'gal-09',
    title: 'Cybersecurity CTF Challenge Award Ceremony',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    date: 'March 2026',
    description: 'Recognition of top capture-the-flag teams and vulnerability discovery participants.',
    location: 'Conference Hall 1'
  }
];

// Empty by default — Chapter Highlights are uploaded by administrators via the admin dashboard.
// Backend integration will populate this array from the database.
export const chapterHighlights: GalleryItem[] = [];

export default mockGallery;
