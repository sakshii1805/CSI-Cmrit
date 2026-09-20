import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Compass, Award, Users, BookOpen, Laptop, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial Hero Masthead */}
      <section className="bg-[#081325] text-white py-14 sm:py-20 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-950 border border-blue-800 text-blue-300 font-mono text-[11px] font-medium tracking-wide">
              <span>INSTITUTIONAL CHARTER</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              About CSI CMRIT
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Fostering practical engineering craft, national hackathon incubation, and collaborative peer learning at CMR Institute of Technology, Hyderabad.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: National Body & Institutional Chapter */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
                // APEX BODY
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                Computer Society of India (CSI)
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Computer Society of India (CSI) is the premier association of IT professionals and computer scientists across India. Established in 1965, CSI advances theory and practice in computer engineering, facilitating national knowledge exchange, conferences, technical seminars, and student developmental chapters nationwide.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Student chapters under CSI bridge the academic syllabus with rapidly evolving industrial frameworks, enabling members to learn directly from active industry practitioners.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4 lg:border-l lg:border-slate-200 lg:pl-12">
              <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
                // STUDENT CHAPTER
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                CSI CMRIT Student Chapter
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The CSI Student Chapter at CMR Institute of Technology, Hyderabad, functions as an active student-led technical council. The chapter brings together students across CSE, IT, AI&amp;ML, and ECE who share a commitment to software development, cloud infrastructure, and competitive problem solving.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Through practical workshop series, hackathon incubation squads, and continuous code sprints, the chapter prepares students to build production-grade solutions for real problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Vision & Mission — Charter Layout (No twin card boxes) */}
      <section className="py-16 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-subtle">
            <div className="p-6 sm:p-10 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-blue-400 font-medium tracking-wide">
                  CHAPTER CHARTER
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mt-1">
                  Our Vision &amp; Operational Mission
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400">
                EXCELLENCE • ETHICS • LEADERSHIP
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 p-6 sm:p-10 gap-8 lg:gap-12">
              {/* Vision */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-wide">
                  <span>01. Chapter Vision</span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  Engineering Leaders with Practical Mastery
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To cultivate a premier, inclusive, and forward-looking collegiate technology community at CMRIT that inspires students to pursue technical excellence, solve real-world challenges with integrity, and evolve into ethical engineering leaders of tomorrow.
                </p>
              </div>

              {/* Mission */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 uppercase tracking-wide">
                  <span>02. Chapter Mission</span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  Practical Delivery &amp; National Impact
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To deliver structured hands-on workshops, facilitate competitive coding and hackathons like SIH, nurture collaborative peer research, and bridge students with industry mentors to develop high-impact software and systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Activities & Programs — Structured Initiatives */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
              // CHAPTER INITIATIVES
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-1">
              Activities &amp; Programs
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Our calendar is structured to provide holistic, continuous technical exposure throughout the academic year.
            </p>
          </div>

          {/* Cohesive Institutional Curriculum Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Track 01 */}
            <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded">
                    TRACK 01
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Cadence: Bi-Monthly
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Technical Bootcamps
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Intensive multi-day practical bootcamps on full-stack architecture, DevOps automation, cloud containers, and database systems.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100/80">
                <span className="font-mono text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-2">
                  Key Deliverables
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Production container deployment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>API microservices architecture</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Track 02 */}
            <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">
                    TRACK 02
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Cadence: Seasonal Sprints
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Hackathon Incubators
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Providing structured mentorship, prototype validation, and design review sessions for national hackathons like Smart India Hackathon.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100/80">
                <span className="font-mono text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-2">
                  Key Deliverables
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Ministry statement feasibility check</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Working prototype jury defense</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Track 03 */}
            <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded">
                    TRACK 03
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Cadence: Weekly Sessions
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Peer Study Circles
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Weekly collaborative problem-solving circles focused on data structures, algorithmic design, and system architecture fundamentals.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100/80">
                <span className="font-mono text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-2">
                  Key Deliverables
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Competitive coding contest reviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Open-source PR contributions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Student Community & Culture */}
      <section className="py-16 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-xl border border-slate-200 overflow-hidden shadow-subtle bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="CSI CMRIT student community collaborative culture"
                  className="w-full h-80 sm:h-96 object-cover opacity-95 group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>[ Student Cohort &bull; Chapter Lab 4 ]</span>
                  <span className="text-blue-400 text-[10px]">CSI CMRIT CHAPTER</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
                // STUDENT CULTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                An Inclusive, Student-Driven Community
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                At the heart of CSI CMRIT is a vibrant culture of peer knowledge sharing. Seniors mentor juniors, multidisciplinary teams combine hardware and software proficiencies, and all members are encouraged to experiment without the fear of failure.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Whether you are writing your first lines of code or building distributed microservices, our community provides the constructive environment, feedback, and encouragement you need to grow.
              </p>

              <div className="pt-2">
                <Link to="/join">
                  <Button variant="accent" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Join Our Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
