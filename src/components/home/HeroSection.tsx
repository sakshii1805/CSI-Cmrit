import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#071325] text-white min-h-[460px] sm:min-h-[520px] flex items-center border-b border-slate-800">
      {/* Right-side Campus Building Photo with gentle, minimal fade so building is clearly visible */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/campus_hero.jpg"
          alt="CMR Institute of Technology Campus Building"
          className="w-full h-full object-cover object-center scale-100 brightness-[0.95] contrast-[1.02]"
        />
        {/* Soft, gentle gradient only at the left transition edge to preserve full building visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071325] via-[#071325]/50 to-transparent lg:via-[#071325]/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-xl space-y-5 text-left">
          {/* Label */}
          <p className="text-[11px] sm:text-xs font-bold text-blue-400 tracking-[0.2em] uppercase">
            COMPUTER SOCIETY OF INDIA • CMRIT CHAPTER
          </p>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Learn. Build.{' '}
            <span className="text-blue-500">
              Innovate.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg">
            Empowering students through technology, collaboration, innovation and meaningful experiences.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3.5 flex-wrap">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-600/70 hover:border-slate-400 transition-all duration-200 shadow-sm active:scale-95 backdrop-blur-sm"
            >
              <span>Join CSI</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
