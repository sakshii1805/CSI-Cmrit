import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Compass, Award, Users, BookOpen, Laptop, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
              About Chapter
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
              About CSI CMRIT
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Fostering a culture of technological innovation, peer mentorship, and practical engineering at CMR Institute of Technology, Hyderabad.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: About CSI & About Chapter */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  National Apex Body
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Computer Society of India (CSI)
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The Computer Society of India (CSI) is the premier association of IT professionals and computer scientists across India. Dedicated to advancing theory and practice in computer science and information technology, CSI facilitates national knowledge exchange, conferences, technical seminars, and student developmental programs across academic institutions.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Student chapters under CSI bridge the classroom syllabus with rapidly evolving industrial frameworks, allowing student members to engage directly with working practitioners and research initiatives.
              </p>
            </div>

            <div className="space-y-6 lg:border-l lg:border-slate-200 lg:pl-12">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Institutional Chapter
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  CSI CMRIT Chapter
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The CSI Student Chapter at CMR Institute of Technology, Hyderabad, operates as a student-led technical council. The chapter brings together students across various engineering disciplines who share an enthusiasm for software development, cloud infrastructure, artificial intelligence, cybersecurity, and open-source collaboration.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Through interactive project teams, technical workshops, competitive hackathons, and ideation clinics, the chapter prepares students to build tangible solutions for real problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Vision & Mission */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Vision</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  To cultivate a premier, inclusive, and forward-looking collegiate technology community at CMRIT that inspires students to pursue technical excellence, solve real-world challenges with integrity, and evolve into ethical engineering leaders of tomorrow.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Excellence • Ethics • Leadership</span>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Mission</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  To deliver structured hands-on workshops, facilitate competitive coding and hackathons like SIH, nurture collaborative peer research, and bridge students with industry mentors to develop high-impact software and systems.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mentorship • Innovation • Collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What We Do & Activities */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Initiatives & Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Activities & Programs
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Our calendar is structured to provide holistic, continuous technical exposure throughout the academic year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <Laptop className="w-8 h-8 text-blue-600" />
              <h4 className="text-base font-bold text-slate-900">Technical Bootcamps</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Intensive multi-day practical bootcamps on full-stack architecture, DevOps automation, cloud containers, and database systems.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <Award className="w-8 h-8 text-indigo-600" />
              <h4 className="text-base font-bold text-slate-900">Hackathon Incubators</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Providing structured mentorship, prototype validation, and design review sessions for national hackathons like Smart India Hackathon.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <Users className="w-8 h-8 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900">Peer Study Circles</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Weekly collaborative problem-solving circles focused on data structures, algorithmic design, and system architecture fundamentals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Student Community & Culture */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="CSI CMRIT student community collaborative culture"
                className="rounded-2xl border border-slate-200 shadow-card w-full h-80 sm:h-96 object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Our Culture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                An Inclusive, Student-Driven Community
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                At the heart of CSI CMRIT is a vibrant culture of peer-to-peer knowledge sharing. Seniors mentor juniors, multidisciplinary teams combine hardware and software proficiencies, and all members are encouraged to experiment without the fear of failure.
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
