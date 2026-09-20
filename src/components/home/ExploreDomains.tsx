import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Calendar, Settings, Trophy, Lightbulb, Users, Rocket } from 'lucide-react';

export const ExploreDomains: React.FC = () => {
  const domains = [
    { name: 'Technology', desc: 'DevOps, Web & AI', icon: <Laptop className="w-4 h-4 text-blue-600" />, path: '/events?category=Workshops' },
    { name: 'Events', desc: 'Calendar & Schedules', icon: <Calendar className="w-4 h-4 text-purple-600" />, path: '/events' },
    { name: 'Workshops', desc: 'Practical Lab Sessions', icon: <Settings className="w-4 h-4 text-emerald-600" />, path: '/events?category=Workshops' },
    { name: 'Competitions', desc: 'Coding Contests', icon: <Trophy className="w-4 h-4 text-amber-600" />, path: '/events?category=Competitions' },
    { name: 'SIH Flagship', desc: 'National Hackathon', icon: <Lightbulb className="w-4 h-4 text-rose-500" />, path: '/sih' },
    { name: 'Community', desc: 'Photo Archive', icon: <Users className="w-4 h-4 text-teal-600" />, path: '/highlights' },
    { name: 'Innovation', desc: 'Project Incubation', icon: <Rocket className="w-4 h-4 text-indigo-600" />, path: '/sih' },
  ];

  return (
    <section className="py-14 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="font-mono text-xs text-blue-600 font-medium tracking-tight">
              // CHAPTER VERTICALS
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight mt-1">
              Explore Chapter Domains
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Direct navigation across workshop series, contest calendars, and national hackathon initiatives.
          </p>
        </div>

        {/* Architectural Domain Directory Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 divide-slate-100 sm:divide-x">
          {domains.map((dom, i) => (
            <Link
              key={i}
              to={dom.path}
              className="p-4 flex flex-col justify-between group hover:bg-slate-50/80 transition-colors duration-150 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-semibold text-slate-400 tracking-wider">
                  0{i + 1}
                </span>
                <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                  {dom.icon}
                </span>
              </div>
              <div>
                <span className="text-xs font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                  {dom.name}
                </span>
                <span className="text-[11px] text-slate-500 font-normal tracking-tight block mt-0.5 leading-snug">
                  {dom.desc}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
