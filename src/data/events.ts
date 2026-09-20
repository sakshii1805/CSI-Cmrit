import { EventItem } from '../types';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-01',
    title: 'Hands-on Workshop: Cloud Native Architecture & Containers',
    slug: 'cloud-native-containers-workshop',
    category: 'Workshops',
    date: 'October 12, 2026',
    isoDate: '2026-10-12',
    time: '10:00 AM – 4:00 PM IST',
    venue: 'Computing Lab 4, Tech Block, CMRIT',
    mode: 'In-person',
    shortDescription: 'Deep-dive into containerization with Docker and multi-cluster orchestration with Kubernetes for scalable modern systems.',
    description: 'Join the CSI CMRIT Chapter for an intensive, practical workshop focused on modern cloud-native system design. Students will build, package, and deploy microservices inside lightweight Linux containers, configure multi-node clusters, and understand production deployment patterns.',
    highlights: [
      'Containerizing multi-tier web applications with Docker',
      'Deploying pods, services, and ingresses on Kubernetes',
      'Zero-downtime rolling deployments and load balancing',
      'Certificate of Participation issued by CSI CMRIT'
    ],
    expectations: [
      'Laptop with at least 8GB RAM (Docker Desktop / Podman installed)',
      'Basic familiarity with command line interface (CLI) and Git',
      'Pre-installed VS Code or JetBrains IDE',
      'Active participation in live lab challenges'
    ],
    speaker: {
      name: 'V. Sundaram',
      role: 'Senior Cloud Architect',
      organization: 'CloudScale Technologies',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    organizer: 'CSI CMRIT Cloud & DevOps Domain',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'upcoming',
    registrationOpen: true
  },
  {
    id: 'evt-02',
    title: 'CMRIT CodeSprint 2026: 24-Hour Chapter Hackathon',
    slug: 'cmrit-codesprint-2026',
    category: 'Hackathons',
    date: 'November 5-6, 2026',
    isoDate: '2026-11-05',
    time: 'Starts 9:00 AM IST (24 Hours)',
    venue: 'Auditorium & Innovation Wing, CMRIT Campus',
    mode: 'In-person',
    shortDescription: 'The flagship hackathon of CSI CMRIT bringing together aspiring developers to build functional prototypes solving real-world challenges.',
    description: 'CodeSprint 2026 is an intense 24-hour sprint where interdisciplinary student teams collaborate, brainstorm, design, and construct innovative software solutions. Tracks span Smart Campus, FinTech, Healthcare Informatics, and Sustainable Technology.',
    highlights: [
      'Live mentorship rounds with senior industry software engineers',
      'Multiple tracks: Web3, HealthTech, AI/ML & Smart Governance',
      'Cash prizes, merit certificates, and incubation opportunities',
      'High-speed networking and industry recruitment visibility'
    ],
    expectations: [
      'Teams of 3 to 4 undergraduate students',
      'Working prototypes must be demonstrated live to the jury',
      'Original code written exclusively during the 24-hour duration',
      'Adherence to academic integrity and collaborative spirit'
    ],
    speaker: {
      name: 'Hackathon Advisory Panel',
      role: 'Technical Mentors & Evaluators',
      organization: 'CSI Hyderabad Chapter & CMRIT Faculty',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    organizer: 'CSI CMRIT Executive Committee',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'upcoming',
    registrationOpen: true
  },
  {
    id: 'evt-03',
    title: 'Smart India Hackathon (SIH) Ideation & Validation Bootcamp',
    slug: 'sih-ideation-bootcamp',
    category: 'Workshops',
    date: 'September 28, 2026',
    isoDate: '2026-09-28',
    time: '2:00 PM – 5:30 PM IST',
    venue: 'Seminar Hall 2, CMRIT Hyderabad',
    mode: 'Hybrid',
    shortDescription: 'Guidance and mentorship session for formulating high-impact problem statements, architectural design, and submission pitch decks for SIH.',
    description: 'Designed specifically for SIH aspirants, this bootcamp walks teams through problem selection, feasibility study, technical architecture formulation, and pitching skills that impress national evaluators.',
    highlights: [
      'Deconstructing official SIH ministry and department problem statements',
      'Crafting bulletproof solution architecture and data flow diagrams',
      'Interactive pitch review by past SIH finalist mentors',
      'Guidelines for submission decks and video prototype demonstrations'
    ],
    expectations: [
      'Open to all CMRIT students across all branches and academic years',
      'Bring draft ideas or problem statements for direct feedback',
      'Notebook or laptop for collaborative ideation'
    ],
    speaker: {
      name: 'Dr. K. R. Sharma & Senior Mentors',
      role: 'CSI Faculty Sponsor & Tech Mentors',
      organization: 'CMRIT Tech Council',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    organizer: 'CSI CMRIT SIH Steering Committee',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    registrationOpen: true
  },
  {
    id: 'evt-04',
    title: 'National Algorithmic Challenge & Competitive Coding Quest',
    slug: 'national-algorithmic-challenge',
    category: 'Competitions',
    date: 'August 18, 2026',
    isoDate: '2026-08-18',
    time: '6:00 PM – 9:00 PM IST',
    venue: 'Online Platform (CSI CMRIT Portal)',
    mode: 'Virtual',
    shortDescription: 'A rapid competitive programming contest assessing dynamic programming, graph theory, mathematical logic, and time efficiency.',
    description: 'A 3-hour fast-paced algorithmic contest designed to test core computer science fundamentals, optimal time complexity algorithms, and edge-case handling under strict time constraints.',
    highlights: [
      '6 algorithm problems ranging from intermediate to hard',
      'Live real-time scoreboard and automated test suite evaluation',
      'Post-contest live editorial and code walkthrough',
      'Top 10 leaderboard recognition on CSI CMRIT social handles'
    ],
    expectations: [
      'Languages supported: C++, Java, Python 3, Go',
      'Stable internet connection and modern web browser',
      'Individual participation only'
    ],
    speaker: {
      name: 'Algorithm Domain Leads',
      role: 'Competitive Programming Cell',
      organization: 'CSI CMRIT Chapter',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    organizer: 'Competitive Coding Wing',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    status: 'completed',
    registrationOpen: false
  },
  {
    id: 'evt-05',
    title: 'Industry Speaker Session: High-Throughput Distributed Microservices',
    slug: 'distributed-microservices-session',
    category: 'Technical Sessions',
    date: 'July 14, 2026',
    isoDate: '2026-07-14',
    time: '11:00 AM – 1:00 PM IST',
    venue: 'Virtual Keynote (Live Stream)',
    mode: 'Virtual',
    shortDescription: 'An insider session on designing distributed databases, event-driven messaging pipelines, and resilient microservices at enterprise scale.',
    description: 'Gain insights directly from principal engineers on how large-scale consumer applications handle millions of transactions per second, manage eventual consistency, and mitigate cascading network failures.',
    highlights: [
      'Synchronous vs asynchronous event bus patterns (Kafka, RabbitMQ)',
      'CAP theorem trade-offs in real-world distributed state machines',
      'Observability: Distributed tracing, OpenTelemetry, metrics',
      'Live Q&A session on software engineering career trajectories'
    ],
    expectations: [
      'Interest in backend systems, databases, and enterprise architecture',
      'Familiarity with REST APIs or RPC concepts is advantageous'
    ],
    speaker: {
      name: 'Ananya Raghavan',
      role: 'Staff Infrastructure Engineer',
      organization: 'Stripe Ecosystem Partner',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    organizer: 'CSI CMRIT Industry Relations Cell',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    status: 'completed',
    registrationOpen: false
  },
  {
    id: 'evt-06',
    title: 'Foundations of Modern Web Security & OWASP Top 10 Hands-on',
    slug: 'web-security-owasp-workshop',
    category: 'Workshops',
    date: 'December 2, 2026',
    isoDate: '2026-12-02',
    time: '1:30 PM – 5:00 PM IST',
    venue: 'Information Security Lab, CMRIT',
    mode: 'In-person',
    shortDescription: 'Understand application attack vectors, secure coding standards, authentication flaws, and defensive programming.',
    description: 'Explore the foundations of ethical application defense. Through live sandbox labs, attendees inspect vulnerabilities like SQL injection, CSRF, broken access controls, and learn defensive mitigations.',
    highlights: [
      'Interactive hands-on sandbox penetration testing environment',
      'Defense-in-depth: Secure header configuration, sanitization, hashing',
      'JWT best practices and session security',
      'Certificate of achievement for top capture-the-flag scorers'
    ],
    expectations: [
      'Laptop with Chromium browser and terminal access',
      'Curiosity for cybersecurity and defensive programming'
    ],
    speaker: {
      name: 'Rohan Deshmukh',
      role: 'Lead Security Consultant',
      organization: 'CyberSec Shield Labs',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
    },
    organizer: 'CSI CMRIT InfoSec Interest Group',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    registrationOpen: true
  }
];
