import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#07152b] text-white min-h-[440px] sm:min-h-[500px] flex items-center border-b border-slate-800">
      {/* Right-side Campus Building Photo with smooth left-fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/campus_hero.jpg"
          alt="CMR Institute of Technology Campus Building"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Gradients blending campus image into navy */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07152b] via-[#07152b]/85 to-transparent lg:via-[#07152b]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07152b] via-transparent to-transparent opacity-60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-xl space-y-5 text-left">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-800/80 text-blue-300 font-mono text-[11px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>CSI STUDENT CHAPTER • CMRIT HYDERABAD</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
            Learn. Build.{' '}
            <span className="text-blue-400">
              Innovate.
            </span>
          </h1>

          {/* Supporting Text — Stop Slop applied */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg">
            The premier computing society at CMRIT. We run hands-on engineering bootcamps, mentor Smart India Hackathon teams, and connect students with industry engineers.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-display font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-[transform,background-color] duration-150 active:scale-[0.98] shadow-subtle"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-display font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-[transform,background-color,border-color] duration-150 active:scale-[0.98]"
            >
              <span>Join CSI Chapter</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
