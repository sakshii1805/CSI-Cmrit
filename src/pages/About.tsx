import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  ExternalLink,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { facultyCoordinator, teamLeads } from '../data/aboutTeam';

const csiIndiaStats = [
  { value: '1965', label: 'Founded' },
  { value: '72+', label: 'Chapters' },
  { value: '488+', label: 'Student Branches' },
  { value: '1L+', label: 'Members' },
];

const PortraitPlaceholder: React.FC<{
  initials: string;
  className?: string;
}> = ({ initials, className = '' }) => (
  <div
    className={`flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 text-white ${className}`}
    aria-hidden
  >
    <span className="font-extrabold tracking-wide text-white/90">{initials}</span>
  </div>
);

export const About: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleLeads = showAll ? teamLeads : teamLeads.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
              About
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
              CSI India &amp; CSI CMRIT
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              The national body for computing professionals, and the student chapter that brings that mission to CMR Institute of Technology.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  National Body
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Computer Society of India
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Computer Society of India (CSI) is the first and largest body of computer professionals in India. It was started on 6 March 1965 by a small group of practitioners and has grown into the national association representing the computing community.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                CSI is the only member in India of the International Federation for Information Processing (IFIP). It recognises innovation and indigenous work in ICT through awards, conferences, student contests, and certification programmes run from its Educational Directorate.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                With chapters across the country and hundreds of student branches, CSI exists to spread knowledge and open professional opportunities to as many students and practitioners as possible.
              </p>
              <a
                href="https://csiindia.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Visit csiindia.org
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-subtle text-center">
                <img
                  src="/images/logo.png"
                  alt="Computer Society of India logo"
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain mx-auto"
                />
                <p className="mt-4 text-sm font-bold text-slate-900">Computer Society of India</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Only IFIP member from India
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {csiIndiaStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white px-5 py-6 text-center shadow-subtle"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Student Chapter
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              CSI CMRIT Chapter
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
              The CSI Student Branch at CMR Institute of Technology is a student-led chapter of CSI. It runs events, competitions, and workshops so students can go beyond the syllabus and practise computer science with peers and mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
              <Globe2 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900">National affiliation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Members belong to CSI as well as the campus chapter, with access to national contests, seminars, and student programmes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
              <Users className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900">Student-led work</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Core team leads plan workshops, hackathons, talks, and community projects with faculty guidance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
              <Award className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900">Build and compete</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Hands-on sessions, coding contests, and hackathon-style problem solving are the chapter&apos;s year-round focus.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-subtle flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-4"> OurVision</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 flex-1">
                A strong, inclusive technology community at CMRIT where students pursue excellence, solve real problems with integrity, and grow into ethical engineering leaders.
              </p>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Excellence · Ethics · Leadership</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-subtle flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-4"> Our Mission</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 flex-1">
                Run structured workshops, coding and hackathon tracks, peer learning, and industry mentorship so students can ship useful software and systems.
              </p>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mentorship · Innovation · Collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Faculty
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Faculty Coordinator
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Academic leadership and mentorship for the CSI CMRIT Student Chapter.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden shadow-subtle">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-4 lg:col-span-3">
                {facultyCoordinator.photo ? (
                  <img
                    src={facultyCoordinator.photo}
                    alt={facultyCoordinator.name}
                    className="w-full h-72 md:h-full object-cover object-top"
                  />
                ) : (
                  <PortraitPlaceholder
                    initials={facultyCoordinator.initials}
                    className="w-full h-72 md:h-full text-5xl"
                  />
                )}
              </div>
              <div className="md:col-span-8 lg:col-span-9 p-6 sm:p-8 lg:p-10 space-y-5">
                <div>
                  <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                    {facultyCoordinator.role}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                    {facultyCoordinator.name}
                  </h3>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</dt>
                      <dd className="text-sm font-semibold text-slate-800 mt-0.5">{facultyCoordinator.department}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Institution</dt>
                      <dd className="text-sm font-semibold text-slate-800 mt-0.5">{facultyCoordinator.institution}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Chapter</dt>
                      <dd className="text-sm font-semibold text-slate-800 mt-0.5">
                        CSI Student Chapter, CMRIT
                      </dd>
                    </div>
                  </div>
                </dl>
                <ul className="space-y-2">
                  {facultyCoordinator.details.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {facultyCoordinator.email ? (
                  <a
                    href={`mailto:${facultyCoordinator.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    {facultyCoordinator.email}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Core Team 2026-27
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Team Leads
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Student officers who lead, plan, and run CSI CMRIT through the year.
              </p>
            </div>
            {teamLeads.length > 4 && (
              showAll ? (
                <button
                  onClick={() => setShowAll(false)}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  View Less
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(true)}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View More Team Leads
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleLeads.map((member, index) => (
              <article
                key={`${member.role}-${index}`}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-subtle hover:shadow-card transition-shadow"
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    className="w-full aspect-[3/4] object-cover object-top"
                  />
                ) : (
                  <PortraitPlaceholder
                    initials={member.initials}
                    className="w-full aspect-[3/4] text-3xl sm:text-4xl"
                  />
                )}
                <div className="p-4">
                  {member.name ? (
                    <>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{member.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{member.role}</p>
                    </>
                  ) : (
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{member.role}</h3>
                  )}
                </div>
              </article>
            ))}
          </div>
          </div>
        </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-950 text-white px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Join CSI CMRIT</h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                Workshops, contests, and a campus community around computing. Apply to become a student member.
              </p>
            </div>
            <Link to="/join">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Become a member
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
