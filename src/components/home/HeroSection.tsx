import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Trophy, 
  Users, 
  ChevronDown, 
  Layers, 
  Zap 
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  // Dual-view state between Front Façade and Innovation Wing
  const [activeView, setActiveView] = useState<'front' | 'wing'>('front');

  return (
    <section className="relative overflow-hidden bg-[#051122] text-white min-h-[calc(100vh-68px)] flex flex-col justify-between border-b border-slate-800/90 selection:bg-blue-600 selection:text-white">
      {/* Background Animated Cyber Mesh & Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow orbs */}
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] animate-pulse-glow" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Right/Back Campus Real Imagery with smooth organic crossfade */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] z-0 overflow-hidden pointer-events-none select-none">
        {/* Front Façade Image */}
        <img
          src="/images/cmrit_campus_front.png"
          alt="CMR Institute of Technology Main Campus Grand Façade"
          className={`absolute inset-0 w-full h-full object-cover object-center scale-100 transition-all duration-1000 ease-out ${
            activeView === 'front' 
              ? 'opacity-85 scale-100 blur-0' 
              : 'opacity-0 scale-105 blur-sm'
          }`}
        />

        {/* Innovation Wing Image */}
        <img
          src="/images/cmrit_campus_wing.png"
          alt="CMR Institute of Technology Academic & Innovation Wing"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
            activeView === 'wing' 
              ? 'opacity-85 scale-100 blur-0' 
              : 'opacity-0 scale-105 blur-sm'
          }`}
        />

        {/* Sophisticated gradient scrims blending the campus smoothly into the deep navy theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051122] via-[#051122]/90 to-transparent lg:via-[#051122]/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051122] via-[#051122]/30 to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051122]/70 via-transparent to-[#051122]/80" />
      </div>

      {/* Main Screen-Fit Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Typography & CTA (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Status Pill & Chapter Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-200 tracking-wide uppercase">
                  CSI CMRIT Chapter • 2026-27 Active
                </span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-medium">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>CMRIT Campus, Bengaluru</span>
              </div>
            </div>

            {/* Main Headline with dynamic gradient and emphasis */}
            <div className="space-y-1.5">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08]">
                Learn. Build.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
                  Innovate.
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-tight">
                The Computer Society of India Student Chapter
              </p>
            </div>

            {/* Mission Statement Description */}
            <p className="text-sm sm:text-base text-slate-300/95 leading-relaxed font-normal max-w-xl">
              Uniting student developers, designers, and innovators at CMR Institute of Technology to master cutting-edge software engineering, compete in national hackathons, and build impactful real-world systems.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3.5 flex-wrap">
              <Link
                to="/events"
                className="group relative inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/join"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-500 transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Join CSI Chapter</span>
              </Link>
            </div>

            {/* Fast Stats Row */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">1.5K+</p>
                <p className="text-[11px] text-slate-400 font-medium">Active Students</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">40+</p>
                <p className="text-[11px] text-slate-400 font-medium">Annual Events</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">Top 1%</p>
                <p className="text-[11px] text-slate-400 font-medium">SIH Finalists</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Telemetry Badges & Campus Angle Switcher (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-end justify-center min-h-[280px]">
            {/* Floating Live Badge 1: SIH Achievement */}
            <div className="w-full max-w-xs mb-4 p-3.5 rounded-2xl bg-slate-900/85 border border-blue-500/30 backdrop-blur-md shadow-xl animate-float-slow transition-transform hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Excellence</span>
                    <span className="text-[10px] text-slate-400">• National Stage</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">Smart India Hackathon Finalists</h4>
                </div>
              </div>
            </div>

            {/* Floating Live Badge 2: Community Network */}
            <div className="w-full max-w-xs mb-6 p-3.5 rounded-2xl bg-slate-900/85 border border-cyan-500/30 backdrop-blur-md shadow-xl animate-float-delayed transition-transform hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Workshops</span>
                    <span className="text-[10px] text-slate-400">• Cloud, AI & Web3</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">Continuous Hands-on Labs</h4>
                </div>
              </div>
            </div>

            {/* Interactive Campus Switcher Pill */}
            <div className="p-2 rounded-2xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-col gap-2 w-full max-w-xs">
              <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  CMRIT Campus View:
                </span>
                <span className="text-cyan-400 text-[10px] uppercase font-bold">Interactive</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveView('front')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeView === 'front'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Front Façade
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('wing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeView === 'wing'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Innovation Wing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator & Campus Location Tag */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 w-full flex items-center justify-between text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          <span className="hidden sm:inline font-medium">C.M.R. Institute of Technology, Bengaluru</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => window.scrollBy({ top: 400, behavior: 'smooth' })}>
          <span className="text-[11px] font-medium tracking-wide">Explore chapter activities</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
