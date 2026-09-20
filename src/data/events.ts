import { EventItem } from '../types';

export const mockEvents: EventItem[] = [
  {
    id: 'avishkaar-2026',
    title: 'AVISHKAAR: SIH-Pattern Hackathon',
    slug: 'avishkaar-2026',
    category: 'Hackathons',
    date: '9 – 10 October 2026',
    event_date: '2026-10-09',
    time: 'Preliminary: 26 Sept 2026 | Grand Finale: 9 – 10 Oct 2026',
    venue: 'CMR Institute of Technology (UGC Autonomous), Kandlakoya, Hyderabad',
    mode: 'In-person',
    shortDescription: 'Official SIH-pattern hackathon with 20 pre-selected problem statements, ₹35,000 cash prizes, and mentorship for CMRIT students.',
    description: 'AVISHKAAR is the flagship SIH-pattern hackathon organized by the Computer Society of India (CSI) CMRIT Student Chapter. Geared towards "Ideas, Code, Impact" and "Think, Build, Solve", teams of 6 CMRIT students will tackle 20 pre-selected problem statements across technology and real-world innovation.',
    highlights: [
      'Top 3 Cash Prizes: 1st Prize ₹20,000, 1st Runner-Up ₹10,000, 2nd Runner-Up ₹5,000 (Total ₹35,000 pool)',
      '20 Pre-selected Problem Statements aligned with national SIH standards',
      'Preliminary Round: 26 September 2026 (Short 8-10 min presentation + Q&A)',
      'Grand Finale: 9 – 10 October 2026 (Only shortlisted teams advance)',
      'Registration Fee: ₹1,200 per team (Applicable only for shortlisted teams)',
      'Student Coordinators: B. Akshitha (+91 95734 69911) & Medi Sumeet (+91 80748 29165)',
      'Strict Anti-Plagiarism Policy: Copying solutions results in immediate disqualification'
    ],
    expectations: [
      'Team size: Exactly 6 members per team',
      'CMRIT students only (no inter-college teams allowed)',
      'Mandatory requirement: Minimum 1 girl member per team',
      'Registration Window: Opens 17 September 2026 | Closes 26 September 2026',
      'Preliminary Evaluation Focus: Clarity of problem understanding, innovation & feasibility, technical approach & architecture, user impact & scalability, basic prototype/demo (if ready)'
    ],
    speaker: {
      name: 'B. Akshitha & Medi Sumeet',
      role: 'Student Coordinators',
      organization: 'CSI CMRIT Chapter (+91 9573469911 / +91 8074829165)'
    },
    organizer: 'CSI CMRIT Chapter & CMRIT (UGC Autonomous)',
    image: '/images/avishkaar_poster.jpg',
    galleryImages: [
      '/images/avishkaar_poster.jpg'
    ],
    status: 'published',
    registrationOpen: true
  }
];
