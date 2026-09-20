import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const SihFeature: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background accents */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute top-1/2 -right-40 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Image / Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-elevated bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Smart India Hackathon teams at work"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  National Hackathon Initiative
                </div>
                <p className="text-sm font-bold text-white">
                  Smart India Hackathon (SIH) Support Cell
                </p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              Smart India Hackathon Focus
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Innovation That Solves Real Problems
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Smart India Hackathon is India&apos;s premier nationwide open-innovation platform where students formulate viable solutions for pressing challenges presented by government ministries, departments, and industry leaders.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              At CSI CMRIT, our chapter coordinates internal college screening rounds, conducts ideation workshops, provides domain mentorship, and assists teams in refining architectures, prototypes, and pitch decks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Internal idea evaluation & vetting</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Architecture & prototype guidance</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-disciplinary team building</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pitch preparation & mock juries</span>
              </div>
            </div>

            <div className="pt-3">
              <Link to="/sih">
                <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore SIH
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
