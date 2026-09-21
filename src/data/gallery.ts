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
  }
];

export const chapterHighlights: GalleryItem[] = [];
export default mockGallery;
