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
  photo: undefined as string | undefined,
  details: [
    'Guides the CSI CMRIT Student Chapter on academics, events, and professional ethics.',
    'Mentors student officers on workshops, hackathons, and industry outreach.',
    'Connects the chapter with CSI national programmes and campus administration.',
  ],
  email: '',
};

/** Core Team 2025–26. Names and photos can be filled from the Instagram announcement. */
export const teamLeads: TeamLead[] = [
  { name: '', role: 'Chairperson', initials: 'CH' },
  { name: '', role: 'Vice Chairperson', initials: 'VC' },
  { name: '', role: 'Secretary', initials: 'SE' },
  { name: '', role: 'Treasurer', initials: 'TR' },
  { name: '', role: 'Technical Lead', initials: 'TL' },
  { name: '', role: 'Event Lead', initials: 'EL' },
  { name: '', role: 'Design Lead', initials: 'DL' },
  { name: '', role: 'Media Lead', initials: 'ML' },
];
