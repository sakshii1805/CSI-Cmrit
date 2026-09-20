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
      title: 'SIH & Hackathon Incubation',
      description: 'Exclusive mentorship, team formulation, and pitch deck validation for Smart India Hackathon and national hackathons.',
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
    <section className="py-20 lg:py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Value Proposition</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Why Join{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CSI CMRIT?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We are CMRIT’s student-led technology powerhouse. Join an active community of creators, competitive coders, and innovators shaping tomorrow’s software landscape.
          </p>
        </div>

        {/* Benefits 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-subtle hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${benefit.iconBg}`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Member Benefit</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a1b33] to-slate-950 p-8 sm:p-12 text-white border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Open to all branches &amp; years
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Ready to elevate your engineering journey?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Membership registration is open for undergraduate students of CMR Institute of Technology, Hyderabad.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center shrink-0">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/45 hover:scale-105 active:scale-95"
            >
              <span>Apply to Join CSI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-900/50"
            >
              Learn More About Us
            </Link>
          </div>
        </div>

        {/* Social Follow Strip in the middle */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
            Follow us on :
          </span>

          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/csi_cmrit/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSI CMRIT on Instagram"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 border border-slate-200/90 hover:border-transparent text-slate-800 hover:text-white text-xs font-bold transition-all duration-300 shadow-subtle hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="w-5 h-5 rounded-full bg-pink-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-current text-pink-600 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span>Instagram</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/csi-cmrit-chapter/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSI CMRIT on LinkedIn"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white hover:bg-[#0077b5] border border-slate-200/90 hover:border-transparent text-slate-800 hover:text-white text-xs font-bold transition-all duration-300 shadow-subtle hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-current text-[#0077b5] group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
