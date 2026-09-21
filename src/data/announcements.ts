import { AnnouncementItem } from '../types';

export const mockAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann-01',
    title: 'SIH 2026 Internal College Screening & Team Registration Open',
    slug: 'sih-2026-internal-screening',
    category: 'Hackathon',
    date: 'September 18, 2026',
    author: 'CSI CMRIT Hackathon Council',
    summary: 'CMRIT internal ideation round nominations are now open for all undergraduate teams aiming for the national Smart India Hackathon shortlist.',
    content: [
      'The Computer Society of India (CSI) CMRIT Chapter, in coordination with the college innovation cell, invites student teams to submit their problem statement preferences and architectural proposals for the upcoming Smart India Hackathon internal evaluation.',
      'Teams must consist of 6 members including at least one female candidate as per national SIH guidelines. Shortlisted teams will receive dedicated mentorship from faculty guides and domain alumni.',
      'Evaluation criteria emphasize technical novelty, feasibility of prototype completion, UI/UX conceptualization, and alignment with national challenges across software and hardware streams.',
      'Deadline for initial idea document submission is October 10, 2026. Teams can access the submission portal through the SIH page on this chapter portal.'
    ],
    tags: ['SIH 2026', 'Hackathon', 'Internal Round', 'Innovation'],
    isUrgent: true
  }
];
