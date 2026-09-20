import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Trophy, Users, UserCheck, Lightbulb, GitBranch } from 'lucide-react';

export const HomeAboutRow: React.FC = () => {
  const pillars = [
    {
      title: 'Technical Bootcamps',
      desc: 'Hands-on labs on full-stack web, cloud infrastructure, and AI engineering.',
      icon: <Terminal className="w-4 h-4 text-blue-600" />
    },
    {
      title: 'Competitive Coding',
      desc: 'Weekly algorithm circles and contest preparation for regional rounds.',
      icon: <Trophy className="w-4 h-4 text-amber-600" />
    },
    {
      title: 'Hackathon Incubation',
      desc: 'Dedicated mentorship from ideation to prototype for Smart India Hackathon.',
      icon: <Lightbulb className="w-4 h-4 text-emerald-600" />
    },
    {
      title: 'Industry Tech Talks',
      desc: 'Direct sessions with working software engineers and engineering leads.',
      icon: <UserCheck className="w-4 h-4 text-indigo-600" />
    },
    {
      title: 'Open Source Building',
      desc: 'Student squads building collaborative software solutions and tooling.',
      icon: <GitBranch className="w-4 h-4 text-cyan-600" />
    },
    {
      title: 'Peer Mentorship Network',
      desc: 'Seniors guiding juniors through coursework, projects, and placement prep.',
      icon: <Users className="w-4 h-4 text-purple-600" />
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: About CSI CMRIT narrative (~40%) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-2">
              <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
                // ABOUT THE CHAPTER
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                Bridging academic theory with real engineering.
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              CSI CMRIT is the student chapter of the Computer Society of India at CMR Institute of Technology, Hyderabad. We run a peer-driven technical community where students build real projects, compete nationally, and prepare for modern software engineering careers.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span>Read our chapter charter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Editorial Discipline Matrix (~60%) */}
          <div className="lg:col-span-8">
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="px-5 py-3.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                <span className="font-display text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Chapter Programs &amp; Focus Areas
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  06 ACTIVE TRACKS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
                {/* Column 1: Items 0, 1, 2 */}
                <div className="divide-y divide-slate-200">
                  {pillars.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-5 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                          {item.icon}
                        </div>
                        <h3 className="font-display text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-8">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Column 2: Items 3, 4, 5 */}
                <div className="divide-y divide-slate-200">
                  {pillars.slice(3, 6).map((item, idx) => (
                    <div key={idx} className="p-5 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                          {item.icon}
                        </div>
                        <h3 className="font-display text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-8">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
