import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Users, BookOpen } from 'lucide-react';

export const HomeAboutRow: React.FC = () => {
  return (
    <section className="relative py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left Column: Narrative Story (~65%) */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6 text-left">

            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>About CSI CMRIT</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Where Passionate Students Turn Ideas into{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Real Impact
              </span>
            </h2>

            {/* Narrative */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
              The <strong className="text-slate-900 font-semibold">Computer Society of India (CSI) Student Chapter</strong> at CMR Institute of Technology, Hyderabad, is a student-driven technology collective. We bridge the gap between classroom theory and industry engineering through collaborative projects, technical workshops, and mentorship.
            </p>

            {/* Quick Chapter Highlights / Metrics Bar (Matching Event Section Style) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-600 shrink-0" />
                  Affiliation
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 mt-1 block truncate">CSI National Body</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-indigo-600 shrink-0" />
                  Campus Branch
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 mt-1 block truncate">CMRIT, Hyderabad</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-600 shrink-0" />
                  Community
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 mt-1 block truncate">Active Tech Chapter</span>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 shadow-md shadow-slate-900/10 hover:shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>

          {/* Right Column: CSI Logo Showcase (~35%) */}
          <div className="lg:col-span-4 flex items-center justify-center w-full">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all duration-300 max-w-xs sm:max-w-sm w-full flex flex-col items-center text-center group">
              <div className="w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center p-2">
                <img
                  src="/images/logo.png"
                  alt="Computer Society of India Logo"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide mt-3">
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

