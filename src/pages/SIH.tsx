import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Activity,
  Terminal,
  FileCode2,
  Inbox,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const SIH: React.FC = () => {
  const focusThemes = [
    {
      code: 'THEME_01',
      title: 'Smart Healthcare & Diagnostics',
      desc: 'Assistive medical devices, automated radiology diagnostics, hospital telemetry, and triage optimization software.',
      icon: <Activity className="w-5 h-5 text-blue-600" />
    },
    {
      code: 'THEME_02',
      title: 'Agriculture & Rural Innovation',
      desc: 'Precision crop health telemetry, algorithmic supply-chain routing, and sensor-driven automated irrigation controllers.',
      icon: <Layers className="w-5 h-5 text-emerald-600" />
    },
    {
      code: 'THEME_03',
      title: 'Clean Energy & Smart Infrastructure',
      desc: 'IoT-enabled micro-grid monitoring, predictive waste logistics telemetry, and civic municipal reporting frameworks.',
      icon: <Cpu className="w-5 h-5 text-cyan-600" />
    },
    {
      code: 'THEME_04',
      title: 'Cybersecurity & Public Infrastructure',
      desc: 'Fault-tolerant distributed ledgers, privacy-preserving zero-knowledge auth, and tamper-evident auditing systems.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />
    }
  ];

  const incubationPhases = [
    {
      num: '01',
      title: 'Problem Deconstruction & Feasibility',
      desc: 'We dissect central ministry and industry problem statements, vet technical requirements, and define system boundaries before any line of code is written.'
    },
    {
      num: '02',
      title: 'Internal Screening & Jury Evaluations',
      desc: 'Institutional qualifying rounds conducted under AICTE & MIC rubric standards, with cross-department faculty evaluating architecture depth.'
    },
    {
      num: '03',
      title: 'System Architecture & Pitch Polish',
      desc: 'End-to-end guidance structuring system dataflow diagrams, API specifications, UX wireframes, and high-impact jury defense decks.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sleek Masthead */}
      <section className="bg-[#081325] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-blue-500/30 bg-blue-950/50 text-blue-400 font-mono text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>National Flagship Hackathon</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smart India <span className="text-blue-400">Hackathon</span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-blue-300/90 mt-3 tracking-wide">
              Translating engineering principles into deployable public-sector systems.
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl">
              CSI CMRIT serves as the institutional incubator preparing student teams for India's premier nationwide hackathon organized by the Ministry of Education&apos;s Innovation Cell (MIC) and AICTE.
            </p>

            <div className="pt-8 flex flex-wrap gap-4 items-center">
              <Link to="/join">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Join SIH Working Groups
                </Button>
              </Link>
              <Link to="/announcements">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800/60"
                >
                  Screening Notices
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The National Mandate & Dual Editions */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  National Overview
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  What is Smart India Hackathon?
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Smart India Hackathon is the Government of India&apos;s apex student innovation competition. It challenges young technologists to devise production-ready solutions for complex operational bottlenecks submitted by central ministries, state departments, and premier enterprises.
              </p>

              {/* Dual Edition Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Track 01
                    </span>
                    <h4 className="font-display text-sm font-bold text-slate-900">Software Edition</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A non-stop 36-hour sprint engineering resilient distributed software systems, cloud APIs, native mobile platforms, and AI models.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Track 02
                    </span>
                    <h4 className="font-display text-sm font-bold text-slate-900">Hardware Edition</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A 5-day continuous sprint fabricating physical prototypes, custom PCB layouts, embedded sensor networks, and robotic assemblies.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter Mandate Box */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#081325] border border-slate-800 p-7 text-white space-y-4 shadow-elevated">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">CSI CMRIT Incubation Cell</h3>
                    <p className="font-mono text-xs text-blue-400">Institutional Gateway</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Our chapter provides internal screening committees, mentorship from past national finalists, technical reviews, and fabrication workspace support for CMRIT participants.
                </p>

                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono leading-relaxed flex items-start gap-2">
                  <span className="text-blue-400 font-bold">INFO:</span>
                  <span>Internal qualifiers are announced each academic cycle in accordance with the official MIC schedule.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Incubation Process (3-Phase Step Progression) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Incubation Lifecycle
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              How We Prepare CMRIT Teams
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From the release of national problem statements to the final presentation before ministry jurors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {incubationPhases.map((phase) => (
              <div 
                key={phase.num}
                className="p-6 rounded-xl bg-white border border-slate-200 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 w-fit mb-4">
                    PHASE {phase.num}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Track Standard</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Focus Themes (Editorial Grid) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Problem Domains
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Key Focus Areas
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              High-impact engineering verticals frequently targeted by CMRIT teams in SIH rounds.
            </p>
          </div>

          {/* Unified Engineering Quadrant Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-slate-100">
            {focusThemes.map((theme, idx) => (
              <div 
                key={theme.code} 
                className={`p-6 sm:p-8 hover:bg-slate-50/60 transition-colors relative flex flex-col justify-between group ${
                  idx % 2 === 0 ? 'md:border-r border-slate-100' : ''
                } ${idx < 2 ? 'md:border-b border-slate-100' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-blue-600 tracking-wider">
                      //{theme.code}
                    </span>
                    <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                      {theme.icon}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {theme.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {theme.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>SIH Innovation Vertical</span>
                  <span className="text-slate-500 font-medium">Standard MIC Track</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Regulatory Rules & Participant Growth */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Guidelines Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Compliance
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                  Team Composition Rules
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As per official Smart India Hackathon guidelines, every participating team must satisfy strict statutory formation rules:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 pt-1">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">01</span>
                  <span><strong>Exactly 6 members:</strong> Teams cannot exceed or fall short of the 6-student cohort rule.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">02</span>
                  <span><strong>Mandatory female representation:</strong> At least 1 female engineer must be on the registered team.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">03</span>
                  <span><strong>Active CMRIT enrollment:</strong> All participants must be active undergraduate students of the institution.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">04</span>
                  <span><strong>Interdisciplinary teams:</strong> Combining software, electronics, and mechanical disciplines is recommended.</span>
                </li>
              </ul>
            </div>

            {/* Growth & Benefits */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-semibold text-emerald-600 uppercase tracking-widest">
                  Impact
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                  Why Compete in SIH?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Participation provides intense engineering rigor and real-world system delivery validation:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 pt-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Real Ministerial Problem Sets:</strong> Build software and hardware directly targeting live government challenges.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>High-Pressure Delivery:</strong> Experience agile teamwork and non-stop production sprints under strict time constraints.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>National Jury Scrutiny:</strong> Defend technical choices before senior scientists, bureaucrats, and tech executives.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Career Trajectory:</strong> Winners and finalists gain high-credibility credentials for research fellowships and top engineering jobs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: SIH Chapter Archive / Registry */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Chapter Registry
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              SIH at CSI CMRIT
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Teams, qualifying records, and official submissions from our chapter&apos;s SIH cohorts.
            </p>
          </div>

          {/* Clean Institutional Empty State */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center max-w-lg">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-4 shadow-subtle">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status: Inactive Cycle
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 mb-2">
              No Published Teams for Active Period
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Cohort assignments and qualification rosters will be updated once institutional screening wraps up.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Footer Action Strip */}
      <section className="py-14 bg-[#081325] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Form Your Team. Solve for India.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Connect with peers across computer science, electronics, and information science to begin early problem deconstruction.
          </p>
          <div className="pt-2">
            <Link to="/join">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join Chapter &amp; Working Groups
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

