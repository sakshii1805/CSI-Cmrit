import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Laptop,
  Users2,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const WhyJoinCsi: React.FC = () => {
  const benefits = [
    {
      icon: <Laptop className="w-6 h-6 text-blue-600" />,
      title: 'Hands-on Tech Bootcamps',
      description: 'Go beyond theoretical coursework with practical workshops in Full-Stack Web, AI/ML, Cloud computing, and DevOps.',
      bgClass: 'bg-blue-50/70 border-blue-100',
      iconBg: 'bg-blue-100/80 text-blue-600'
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      title: 'Hackathon Incubation',
      description: 'Exclusive mentorship, team formulation, and pitch deck validation for national hackathons.',
      bgClass: 'bg-amber-50/70 border-amber-100',
      iconBg: 'bg-amber-100/80 text-amber-600'
    },
    {
      icon: <Users2 className="w-6 h-6 text-emerald-600" />,
      title: 'Senior & Alumni Mentorship',
      description: 'Direct guidance from experienced seniors and chapter alumni placed at premier tech companies on placement prep and coding.',
      bgClass: 'bg-emerald-50/70 border-emerald-100',
      iconBg: 'bg-emerald-100/80 text-emerald-600'
    },
    {
      icon: <Code className="w-6 h-6 text-indigo-600" />,
      title: 'Leadership & Real Impact',
      description: 'Lead technical domains, organize flagship college events, and build a credible engineering portfolio that stands out.',
      bgClass: 'bg-indigo-50/70 border-indigo-100',
      iconBg: 'bg-indigo-100/80 text-indigo-600'
    }
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Value Proposition</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Why Join{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CSI CMRIT?
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
            We are CMRIT’s student-led technology powerhouse. Join an active community of creators, competitive coders, and innovators shaping tomorrow’s software landscape.
          </p>
        </div>

        {/* Benefits 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch mb-10 sm:mb-14">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-subtle hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${benefit.iconBg}`}>
                  {benefit.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="pt-3.5 mt-5 sm:pt-4 sm:mt-6 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Member Benefit</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner (Clean Light Institutional Theme) */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-center md:text-left">
          {/* Subtle accent light ambient glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Ready to elevate your engineering journey?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              Join CMRIT's official computer science student chapter to collaborate, build real-world projects, and lead.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0">
            <Link
              to="/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
            >
              <span>Apply to Join CSI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs hover:border-slate-300 w-full sm:w-auto"
            >
              Learn More About Us
            </Link>
          </div>
        </div>

        {/* Social Follow Strip */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Follow us on :
          </span>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/csi_cmrit/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSI CMRIT on Instagram"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-pink-50/60 border border-slate-200 hover:border-pink-200 text-slate-700 hover:text-pink-600 text-xs font-medium transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current text-pink-500 shrink-0" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/csi-cmrit-chapter/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSI CMRIT on LinkedIn"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600 text-xs font-medium transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current text-[#0077b5] shrink-0" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
