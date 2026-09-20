import React from 'react';
import { Sparkles, Code2, Cpu, Building2, Layers, ArrowDown } from 'lucide-react';
import { Button } from '../common/Button';

interface SihHeroHeaderProps {
  totalCount: number;
  softwareCount: number;
  hardwareCount: number;
  onBrowseClick: () => void;
  onGuidanceClick: () => void;
}

export const SihHeroHeader: React.FC<SihHeroHeaderProps> = ({
  totalCount,
  softwareCount,
  hardwareCount,
  onBrowseClick,
  onGuidanceClick
}) => {
  return (
    <section className="bg-[#070E1E] text-white pt-14 pb-16 border-b border-slate-800/80 relative overflow-hidden">
      {/* Glow / gradient background effects */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        {/* Top institutional pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-500/30 bg-blue-950/60 text-blue-400 font-mono text-xs font-semibold tracking-wider uppercase mb-5 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>CSI CMRIT PRESENTS</span>
        </div>

        {/* Hero Titles */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Smart India Hackathon 2026
        </h1>
        <p className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent mt-2">
          Problem Statements Hub
        </p>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
          All 226 official SIH 2026 problem statements — each with domain analysis, innovation tier scoring, evaluator prep questions, and a 36-hour roadmap.
        </p>

        {/* Big Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8 py-4 px-6 rounded-2xl bg-[#0B1528]/80 border border-slate-800/90 shadow-xl backdrop-blur-sm">
          <div className="text-center py-2 border-r border-slate-800/80 last:border-r-0">
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">226</div>
            <div className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Problem Statements</div>
          </div>
          <div className="text-center py-2 border-r border-slate-800/80 last:border-r-0">
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">18</div>
            <div className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Domains</div>
          </div>
          <div className="text-center py-2 border-r border-slate-800/80 last:border-r-0">
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">30</div>
            <div className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Ministries</div>
          </div>
          <div className="text-center py-2">
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-sky-400">
              172 <span className="text-slate-500 font-normal">/</span> <span className="text-amber-400">54</span>
            </div>
            <div className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Software / Hardware</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={onBrowseClick}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 px-6"
            rightIcon={<ArrowDown className="w-4 h-4" />}
          >
            Browse All Statements
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onGuidanceClick}
            className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            Guidance Session Deck
          </Button>
        </div>
      </div>
    </section>
  );
};
