import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HomeAboutRow: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-24 bg-white border-b border-slate-200 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Narrative Story (~65%) */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Section Tag */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wider uppercase">
              About CSI CMRIT
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Where Passionate Students Turn Ideas into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                Real Impact
              </span>
            </h2>

            {/* Narrative */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
              The <strong className="text-slate-900 font-semibold">Computer Society of India (CSI) Student Chapter</strong> at CMR Institute of Technology, Hyderabad, is a student-driven technology collective. We bridge the gap between classroom theory and industry engineering through collaborative projects, technical workshops, and mentorship.
            </p>

            {/* Action Link */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right Column: CSI Logo Showcase (~35%) */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all duration-300 max-w-xs w-full flex flex-col items-center text-center group">
              <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center p-2">
                <img
                  src="/images/logo.png"
                  alt="Computer Society of India Logo"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-wide mt-3">
                Computer Society of India
              </span>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mt-0.5">
                CMRIT Chapter
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
