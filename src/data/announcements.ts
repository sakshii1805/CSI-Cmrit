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
      'Deadline for initial idea document submission is October 10, 2026. Teams can access the submission portal through the chapter portal or contact the Hackathon Council.'
    ],
    tags: ['SIH 2026', 'Hackathon', 'Internal Round', 'Innovation'],
    isUrgent: true
  },
  {
    id: 'ann-avishkar-2026',
    title: 'Avishkar 2026 — Annual Technical Festival & Hackathon',
    slug: 'avishkar-2026',
    category: 'Hackathon',
    date: 'September 20, 2026',
    author: 'CSI CMRIT',
    summary:
      'Avishkar, the annual technical festival of CMR Institute of Technology, returns in 2026 with competitions, workshops, and industry talks across 12 engineering streams. Registrations are now open for students of all years.',
    content: [
      'Avishkar 2026 will be held from October 15 to 17, 2026 on the CMRIT campus. The festival is organized by the Computer Society of India (CSI) CMRIT Student Chapter in collaboration with the college innovation cell and technical societies.',
      'The three-day event features over 30 competitions including coding marathons, circuit design challenges, robotics showcases, and hackathons across software, hardware, and AI tracks. Prizes worth ₹5 lakhs are up for grabs.',
      'Workshops will be conducted by industry mentors from Microsoft, Google, and NVIDIA, covering topics like generative AI, cloud-native development, embedded systems, and cybersecurity. Separate registration is required for workshops with limited seats.',
      'Guest speakers include alumni from top tech companies and researchers from leading institutions. The inauguration ceremony will be graced by the Director of CSIR-CEERI and the CSI National Vice-Chairperson.',
      'Student groups can register for events through the official Avishkar portal. Early-bird registration closes October 5, 2026. Visit the CSI CMRIT website or the chapter Instagram handle for the latest schedule and updates.',
    ],
    tags: ['Avishkar 2026', 'Technical Festival', 'Competitions', 'Workshops', 'Hackathon'],
    isUrgent: true,
  },
];
