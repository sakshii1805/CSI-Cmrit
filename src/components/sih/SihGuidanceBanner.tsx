import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  Trophy, 
  Compass, 
  FileText, 
  AlertTriangle, 
  MessageSquare, 
  ZoomIn, 
  CheckCircle2, 
  Calendar,
  X
} from 'lucide-react';
import { Button } from '../common/Button';

interface SihGuidanceBannerProps {
  onJoinClick?: () => void;
}

export const SihGuidanceBanner: React.FC<SihGuidanceBannerProps> = ({ onJoinClick }) => {
  const [isFlyerZoomOpen, setIsFlyerZoomOpen] = useState(false);

  return (
    <section id="guidance-session" className="py-10 bg-[#070E1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0C172E] to-[#0A1325] border border-blue-900/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle glow behind card */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
              ★ Featured Guidance Session
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono">
              <Users className="w-3.5 h-3.5" />
              Mentored by SIH Finalists
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              CSI Member Exclusive
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  SIH 2026 Guidance &amp; Strategy Session
                </h2>
                <p className="font-mono text-sm text-sky-400 mt-1 font-semibold">
                  Fast-Track Your Hackathon Journey
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                A dedicated mentorship and guidance session hosted by CSI CMRIT. Connect with past national SIH finalists and student leads to learn how to pick winning problem statements, formulate architectural blueprints, and impress the evaluation panel.
              </p>

              {/* 4 Feature Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-sky-400 shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      Strategic PS Selection:
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed block">
                      How to shortlist a problem statement that aligns with your team&apos;s core technical strengths and evaluator expectations.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-sky-400 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      Winning Pitch Decks:
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed block">
                      What evaluators look for in architecture diagrams, workflow models, and feasibility metrics.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-sky-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      Elimination Traps:
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed block">
                      Pitfalls that disqualify teams during initial screening rounds and how to bypass them.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-sky-400 shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      Live Interactive Q&amp;A:
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed block">
                      Ask questions directly to seniors with national podium finishes at Smart India Hackathon.
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Internal Orientation • Session Materials Archived
                </span>
                <button
                  onClick={() => setIsFlyerZoomOpen(true)}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-4"
                >
                  View Session Poster
                </button>
              </div>
            </div>

            {/* Right Flyer Graphic */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => setIsFlyerZoomOpen(true)}
                className="group relative cursor-pointer rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl transition-all duration-300 hover:border-sky-500/60 hover:shadow-sky-500/10"
              >
                {/* Simulated Poster Design */}
                <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/40 p-6 text-slate-900 min-h-[300px] flex flex-col justify-between select-none">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="font-bold text-[11px] text-slate-800 tracking-tight uppercase">
                          CMR Institute of Technology
                        </div>
                        <div className="text-[9px] text-slate-500">
                          Computer Society of India Student Chapter
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px]">
                        CSI
                      </div>
                    </div>

                    <div className="text-center py-5">
                      <div className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                        SIH 101
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        From Problem <span className="text-blue-600 font-serif italic">to</span> Prototype
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-xs mx-auto">
                        A fast-track blueprint to evaluate problem statements, architect workable MVPs, and win judge approval.
                      </p>
                    </div>

                    {/* Step pills on poster */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div className="p-1.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                        1. Deconstruct
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                        2. Architecture
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                        3. Pitch Deck
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800">CSI CMRIT</span> SIH Mentorship Wing
                    </div>
                    <div className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified Session
                    </div>
                  </div>
                </div>

                {/* Hover overlay with Click to Zoom button */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                    Click to Zoom
                  </span>
                </div>

                {/* Bottom static zoom tag like in reference */}
                <div className="absolute bottom-3 right-3 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-white text-[11px] font-medium shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    Click to Zoom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal for Flyer */}
      {isFlyerZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsFlyerZoomOpen(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-200/90 animate-scaleUp p-6 sm:p-8 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFlyerZoomOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              aria-label="Close flyer view"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  CMR INSTITUTE OF TECHNOLOGY • CSI CHAPTER
                </span>
                <h3 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
                  SIH 101: From Problem to Prototype
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                CSI
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Host:</strong> Department of Computer Science &amp; Engineering in association with CSI CMRIT Student Chapter.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">
                  Session Curriculum Breakdown:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                  <li><strong>Domain Feasibility:</strong> How to benchmark problem statements from 30+ central ministries.</li>
                  <li><strong>Hardware vs Software:</strong> Selecting viable prototyping stacks within a 36-hour sprint.</li>
                  <li><strong>Scoring Matrix:</strong> What MIC &amp; AICTE evaluators look for in preliminary idea submissions.</li>
                  <li><strong>Q&amp;A:</strong> Previous year finalists review live student ideas.</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Resource decks, evaluation rubrics, and team matching forums are available to active CSI CMRIT members.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <Button variant="primary" onClick={() => setIsFlyerZoomOpen(false)}>
                Done Viewing
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
