import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Terminal, Sparkles, Users } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Decorative gradient glow (restrained, technical) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-blue-400 text-xs font-semibold tracking-wider uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>COMPUTER SOCIETY OF INDIA • CMRIT CHAPTER</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Learn. Build.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                Innovate.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empowering students through technology, collaboration, innovation and meaningful experiences. Build real systems, solve national challenges, and accelerate your engineering career.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/events">
                <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Events
                </Button>
              </Link>
              <Link to="/join">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-700 text-slate-200 hover:text-white hover:bg-slate-900 hover:border-slate-600"
                >
                  Join CSI
                </Button>
              </Link>
            </div>

            {/* Highlights pill row */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">Active</span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">Student Chapter</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">Hands-on</span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">Lab Workshops</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">SIH</span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">Hackathon Prep</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-quality Professional Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-elevated bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating on technology projects at CSI CMRIT"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              {/* Floating Technical Badge Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/90 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      CSI CMRIT Chapter
                    </h4>
                    <p className="text-xs text-slate-400">
                      CMR Institute of Technology • Hyderabad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle decorative technical card */}
            <div className="hidden sm:flex items-center gap-3 absolute -top-4 -right-4 bg-slate-900/95 border border-slate-800 px-4 py-2.5 rounded-xl shadow-card backdrop-blur-sm">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-200">
                Code • Collaborate • Innovate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
