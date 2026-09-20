import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Trophy, Users, UserCheck, Lightbulb, Network } from 'lucide-react';

export const HomeAboutRow: React.FC = () => {
  const cards = [
    { title: 'Technical Workshops', icon: <Monitor className="w-5 h-5 text-blue-600" /> },
    { title: 'Coding & Competitions', icon: <Trophy className="w-5 h-5 text-blue-600" /> },
    { title: 'Hackathons', icon: <Users className="w-5 h-5 text-blue-600" /> },
    { title: 'Industry Sessions', icon: <UserCheck className="w-5 h-5 text-blue-600" /> },
    { title: 'Innovation', icon: <Lightbulb className="w-5 h-5 text-blue-600" /> },
    { title: 'Community & Networking', icon: <Network className="w-5 h-5 text-blue-600" /> },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Col 1: About CSI CMRIT (~30%) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                About CSI CMRIT
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CSI CMRIT is a student chapter of the Computer Society of India, bringing together technology enthusiasts, learners and innovators to build skills, solve real-world problems and create meaningful opportunities.
              </p>
            </div>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Col 2: What We Do 6 cards (~55%) */}
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
              What We Do
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center text-center group"
                >
                  <div className="mb-2 p-2 rounded-lg bg-white shadow-xs border border-slate-200 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {card.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: CMRIT Campus Architecture & Community (~25%) */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-slate-200 flex-1 min-h-[240px] bg-slate-950 group">
              <img
                src="/images/cmrit_campus_wing.png"
                alt="CMR Institute of Technology Innovation Campus Wing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <span className="text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                    CMRIT Campus
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide block">
                    Innovation & Labs Wing
                  </span>
                  <p className="text-[10px] text-slate-300 font-normal mt-0.5">
                    Hyderabad, Telangana • NAAC A++ Hub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
