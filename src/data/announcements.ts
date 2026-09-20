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
  },
  {
    id: 'ann-02',
    title: 'CSI Student Membership Drive Open for Academic Year 2026–27',
    slug: 'membership-drive-2026-27',
    category: 'Registration',
    date: 'September 10, 2026',
    author: 'Executive Committee',
    summary: 'Join CSI CMRIT Chapter to gain access to exclusive hands-on technical bootcamps, project groups, hackathons, and networking sessions.',
    content: [
      'We are delighted to announce the annual student membership drive for CSI CMRIT Chapter. As an official member, students gain priority registration for all chapter workshops, access to exclusive coding contests, technical mentorship circles, and international CSI events.',
      'Eligible students from 1st, 2nd, 3rd, and 4th years across all branches (CSE, IT, ECE, AI/ML, Data Science, etc.) are invited to submit their application.',
      'To register, navigate to the "Join Us" section and complete the chapter induction form. Our coordinator team will reach out with orientation details.'
    ],
    tags: ['Membership', 'Orientation', 'CSI Community', 'Registration'],
    isUrgent: false
  },
  {
    id: 'ann-03',
    title: 'Call for Core Student Coordinators: Technical & Design Wings',
    slug: 'student-coordinator-recruitment',
    category: 'Opportunity',
    date: 'August 29, 2026',
    author: 'CSI Student Body Lead',
    summary: 'Passionate about community leadership, web engineering, graphic design, or event organization? Apply for chapter coordinator roles.',
    content: [
      'The CSI CMRIT Executive Board is seeking enthusiastic student coordinators to join our specialized functional wings for the 2026–2027 academic session.',
      'Wings open for recruitment include: Web & Software Development, Competitive Programming, Graphic Design & Media, Content & Technical Writing, and Event Logistics.',
      'Selected coordinators work closely with industry mentors, organize national-tier technical symposiums, and earn valuable leadership recognition for their portfolios.'
    ],
    tags: ['Recruitment', 'Core Team', 'Leadership', 'Opportunities'],
    isUrgent: false
  },
  {
    id: 'ann-04',
    title: 'Workshop Alert: Cloud Native Containers & Orchestration Lab',
    slug: 'workshop-alert-cloud-native',
    category: 'Workshop',
    date: 'August 15, 2026',
    author: 'DevOps Working Group',
    summary: 'Practical weekend lab on Dockerizing modern multi-tier web applications and orchestrating microservices on Kubernetes.',
    content: [
      'Registration is officially live for the hands-on Cloud Native Architecture Workshop scheduled for next month. Seating is capped at 60 participants to guarantee one-on-one lab guidance.',
      'All attendees must bring personal laptops with container virtualization enabled in BIOS. Prerequisites and software installation guides have been uploaded to the event page.'
    ],
    tags: ['DevOps', 'Docker', 'Kubernetes', 'Cloud'],
    isUrgent: false
  },
  {
    id: 'ann-05',
    title: 'CSI CodeSprint 2026 Official Rules & Problem Track Preview',
    slug: 'codesprint-rules-track-preview',
    category: 'General',
    date: 'July 30, 2026',
    author: 'Technical Steering Cell',
    summary: 'Detailed evaluation rubric, permitted technology stacks, and hardware/software guidelines released for CodeSprint 2026.',
    content: [
      'Ahead of the flagship 24-hour hackathon, the rules committee has published the official guidelines document detailing project submission workflows, API usage policies, and presentation criteria.',
      'Please review the guidelines in advance to ensure your team setup satisfies all open-source attribution requirements.'
    ],
    tags: ['Rules', 'CodeSprint', 'Hackathon Guidelines'],
    isUrgent: false
  }
];
