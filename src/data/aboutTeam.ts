export interface TeamLead {
  name: string;
  role: string;
  initials: string;
  /** Local photo path once Instagram portraits are added. */
  photo?: string;
}

export const facultyCoordinator = {
  name: 'P. Sathish Kumar Reddy',
  role: 'Faculty Coordinator',
  department: 'Computer Science & Engineering',
  institution: 'CMR Institute of Technology, Hyderabad',
  initials: 'SR',
  photo: '/images/Team/faculty.jpeg',
  details: [
    'Guides the CSI CMRIT Student Chapter on academics, events, and professional ethics.',
    'Mentors student officers on workshops, hackathons, and industry outreach.',
    'Connects the chapter with CSI national programmes and campus administration.',
  ],
  email: '',
};

/** Core Team 2025–26. Names and photos can be filled from the Instagram announcement. */
export const teamLeads: TeamLead[] = [
  { name: 'Akshitha B', role: 'President', initials: 'PR', photo: '/images/Team/president.jpeg' },
  { name: 'Medi Sumeet', role: 'Vice President', initials: 'VP', photo: '/images/Team/vice president.jpeg' },
  { name: 'Hasini Reddy', role: 'Secretary', initials: 'SE', photo: '/images/Team/secretary.jpeg' },
  { name: 'Rithika Reddy ', role: 'Treasurer', initials: 'TR', photo: '/images/Team/treasurer.jpeg' },
  { name: 'Sakshi Mala', role: 'Technical Lead', initials: 'TL', photo: '/images/Team/technical_lead.jpeg' },
  { name: 'Ganesh K', role: 'Event Lead', initials: 'EL', photo: '/images/Team/event_lead.jpeg' },
  { name: 'Karthikeya P', role: 'Design Lead', initials: 'DL', photo: '/images/Team/documentation lead.jpeg' },
  { name: 'Hansika', role: 'Media Lead', initials: 'SM', photo: '/images/Team/social_media_lead.jpeg' },
  { name: 'N Harshith', role: 'Joint Secretary', initials: 'JS', photo: '/images/Team/joint_secretary.jpeg' },
  { name: 'Meghana Reddy', role: 'Volunteer Coordinator', initials: 'VC', photo: '/images/Team/volunteer_coordinator.jpeg' },
];
