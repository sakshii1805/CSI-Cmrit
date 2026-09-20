import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Calendar, Settings, Trophy, Lightbulb, Users, Rocket } from 'lucide-react';

export const ExploreDomains: React.FC = () => {
  const domains = [
    { name: 'Technology', icon: <Laptop className="w-6 h-6 text-blue-600" />, path: '/events?category=Workshops', bg: 'bg-blue-50' },
    { name: 'Events', icon: <Calendar className="w-6 h-6 text-purple-600" />, path: '/events', bg: 'bg-purple-50' },
    { name: 'Workshops', icon: <Settings className="w-6 h-6 text-emerald-600" />, path: '/events?category=Workshops', bg: 'bg-emerald-50' },
    { name: 'Competitions', icon: <Trophy className="w-6 h-6 text-amber-600" />, path: '/events?category=Competitions', bg: 'bg-amber-50' },
    { name: 'SIH', icon: <Lightbulb className="w-6 h-6 text-rose-500" />, path: '/sih', bg: 'bg-rose-50' },
    { name: 'Community', icon: <Users className="w-6 h-6 text-teal-600" />, path: '/gallery', bg: 'bg-teal-50' },
    { name: 'Innovation', icon: <Rocket className="w-6 h-6 text-indigo-600" />, path: '/sih', bg: 'bg-indigo-50' },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Explore Our Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Be a part of something bigger. Discover opportunities, learn new skills and connect with like-minded people.
          </p>
        </div>

        {/* 7 Domain Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {domains.map((dom, i) => (
            <Link
              key={i}
              to={dom.path}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-card transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className={`w-14 h-14 rounded-full ${dom.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {dom.icon}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {dom.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
