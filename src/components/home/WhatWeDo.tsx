import React from 'react';
import {
  Wrench,
  Code2,
  Trophy,
  Briefcase,
  Lightbulb,
  Users2
} from 'lucide-react';

export const WhatWeDo: React.FC = () => {
  const pillars = [
    {
      icon: <Wrench className="w-6 h-6 text-blue-600" />,
      title: 'Technical Workshops',
      description: 'Hands-on practical labs covering Cloud Native, Docker, Kubernetes, Linux system internals, cybersecurity, and full-stack development.'
    },
    {
      icon: <Code2 className="w-6 h-6 text-indigo-600" />,
      title: 'Coding & Competitions',
      description: 'Algorithmic programming rounds, speed coding contests, and peer practice circles that build problem-solving muscle.'
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      title: 'Hackathons',
      description: 'Sprint-based development hackathons including chapter CodeSprint and nationwide Smart India Hackathon internal mentoring.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      title: 'Industry Sessions',
      description: 'Insightful talks and masterclasses with practicing software architects, engineering leads, and technology practitioners.'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-cyan-600" />,
      title: 'Innovation & Research',
      description: 'Turning academic concepts into functional prototypes, research publications, and open-source contributions.'
    },
    {
      icon: <Users2 className="w-6 h-6 text-purple-600" />,
      title: 'Community & Networking',
      description: 'A close-knit peer network fostering mentorship between seniors and juniors, collaboration on projects, and career guidance.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60">
            Core Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            What We Do
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Bridging academic curricula with real-world industry engineering through practical experiences.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-blue-300 hover:bg-white transition-all duration-300 shadow-subtle hover:shadow-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
