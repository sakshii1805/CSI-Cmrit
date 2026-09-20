import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lightbulb,
  Compass,
  Users,
  FileCode2,
  ArrowRight,
  Bookmark,
  Share2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { sihProblemStatements } from '../data/sihProblemStatements';
import { SIHProblemStatement, SihItem } from '../types';
import { sihService } from '../services/sihService';
import { SihHeroHeader } from '../components/sih/SihHeroHeader';
import { SihGuidanceBanner } from '../components/sih/SihGuidanceBanner';
import { SihProblemStatementCard } from '../components/sih/SihProblemStatementCard';
import { SihFilterControls, SortOption } from '../components/sih/SihFilterControls';
import { SihDetailModal } from '../components/sih/SihDetailModal';

export const SIH: React.FC = () => {
  // Live chapter updates from Supabase
  const [sihItems, setSihItems] = useState<SihItem[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('All');
  const [selectedEffort, setSelectedEffort] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('code-asc');
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState<boolean>(false);

  // Modal State
  const [activeStatement, setActiveStatement] = useState<SIHProblemStatement | null>(null);

  // Student Shortlist State (Persisted in localStorage)
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('csi_sih_shortlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function loadSihUpdates() {
      try {
        setLoadingUpdates(true);
        const res = await sihService.getPublishedSihItems();
        setSihItems(res.data || []);
      } catch (err) {
        console.error('Failed to load SIH updates:', err);
      } finally {
        setLoadingUpdates(false);
      }
    }
    loadSihUpdates();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('csi_sih_shortlist', JSON.stringify(shortlistedIds));
    } catch {
      // Ignore localStorage failure in restricted sandbox
    }
  }, [shortlistedIds]);

  const toggleShortlist = (id: string) => {
    setShortlistedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCardToggleShortlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleShortlist(id);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTheme('All');
    setSelectedComplexity('All');
    setSelectedEffort('All');
    setShowOnlyShortlisted(false);
  };

  // Scroll Helpers
  const scrollToStatements = () => {
    const el = document.getElementById('statements-hub');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGuidance = () => {
    const el = document.getElementById('guidance-session');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtering & Sorting Logic
  const filteredStatements = useMemo(() => {
    let result = [...sihProblemStatements];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ps) =>
          ps.code.toLowerCase().includes(q) ||
          ps.title.toLowerCase().includes(q) ||
          ps.organization.toLowerCase().includes(q) ||
          ps.theme.toLowerCase().includes(q)
      );
    }

    // 2. Category (Software / Hardware)
    if (selectedCategory !== 'All') {
      result = result.filter((ps) => ps.category === selectedCategory);
    }

    // 3. Theme
    if (selectedTheme !== 'All') {
      result = result.filter((ps) => ps.theme === selectedTheme);
    }

    // 4. Complexity
    if (selectedComplexity !== 'All') {
      result = result.filter((ps) => ps.complexity === selectedComplexity);
    }

    // 5. Effort
    if (selectedEffort !== 'All') {
      result = result.filter((ps) => ps.effort === selectedEffort);
    }

    // 6. Shortlisted only
    if (showOnlyShortlisted) {
      result = result.filter((ps) => shortlistedIds.includes(ps.id));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'code-asc':
          return a.code.localeCompare(b.code);
        case 'code-desc':
          return b.code.localeCompare(a.code);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'complexity': {
          const order: Record<string, number> = { Breakthrough: 3, Moderate: 2, Foundational: 1 };
          return (order[b.complexity] || 0) - (order[a.complexity] || 0);
        }
        case 'effort-desc': {
          const effortOrder: Record<string, number> = { 'High Effort': 3, 'Medium Effort': 2, 'Low Effort': 1 };
          return (effortOrder[b.effort] || 0) - (effortOrder[a.effort] || 0);
        }
        case 'effort-asc': {
          const effortOrder: Record<string, number> = { 'High Effort': 3, 'Medium Effort': 2, 'Low Effort': 1 };
          return (effortOrder[a.effort] || 0) - (effortOrder[b.effort] || 0);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedTheme,
    selectedComplexity,
    selectedEffort,
    showOnlyShortlisted,
    shortlistedIds,
    sortBy
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#070E1E] text-slate-100">
      {/* 1. Hero Header (Reference 1 Top) */}
      <SihHeroHeader
        totalCount={226}
        softwareCount={172}
        hardwareCount={54}
        onBrowseClick={scrollToStatements}
        onGuidanceClick={scrollToGuidance}
      />

      {/* 2. Guidance & Strategy Session Banner (Reference 1 Bottom) */}
      <SihGuidanceBanner />

      {/* Chapter SIH Cell Updates & Teams */}
      <section className="py-10 bg-[#070E1E] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>CMRIT Chapter Updates</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                Chapter Teams &amp; SIH Announcements
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Official notifications, team listings, and achievement milestones published by chapter administrators.
            </p>
          </div>

          {loadingUpdates ? (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              Loading chapter updates...
            </div>
          ) : sihItems.length === 0 ? (
            /* Designated empty state */
            <div className="bg-[#0B1528] rounded-2xl border border-slate-800 border-dashed p-10 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No SIH updates yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Chapter teams, mentor notices, and national round qualifiers will be posted here by chapter admins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sihItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 flex flex-col justify-between hover:border-sky-500/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 font-semibold">
                        {item.category}
                      </span>
                      {item.status && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.status}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  {(item.team_name || item.problem_code) && (
                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                      {item.team_name && <span>Team: <strong className="text-slate-200">{item.team_name}</strong></span>}
                      {item.problem_code && <span>PS: <strong className="text-sky-400">{item.problem_code}</strong></span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Problem Statements Explorer Section (Reference 2) */}
      <section id="statements-hub" className="py-12 bg-[#081226] border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-sky-400 font-mono text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Selection Workbench</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
                Official SIH 2026 Problem Statements
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl font-normal">
                Filter by theme, software vs. hardware, complexity tier, or effort level to discover and shortlist the right challenge for your team.
              </p>
            </div>

            {/* Shortlist Counter Tag */}
            {shortlistedIds.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Bookmark className="w-4 h-4 fill-amber-400" />
                <span>Your team has shortlisted <strong>{shortlistedIds.length}</strong> statement{shortlistedIds.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Filter Controls (Search, Sort, H/W & S/W, Complexity, Effort, Theme) */}
          <SihFilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedComplexity={selectedComplexity}
            setSelectedComplexity={setSelectedComplexity}
            selectedEffort={selectedEffort}
            setSelectedEffort={setSelectedEffort}
            sortBy={sortBy}
            setSortBy={setSortBy}
            shortlistCount={shortlistedIds.length}
            showOnlyShortlisted={showOnlyShortlisted}
            setShowOnlyShortlisted={setShowOnlyShortlisted}
            totalFiltered={filteredStatements.length}
            totalAvailable={226}
            onResetFilters={handleResetFilters}
          />

          {/* Cards Grid (3 columns matching Reference 2) */}
          {filteredStatements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStatements.map((statement) => (
                <SihProblemStatementCard
                  key={statement.id}
                  statement={statement}
                  isShortlisted={shortlistedIds.includes(statement.id)}
                  onToggleShortlist={handleCardToggleShortlist}
                  onClick={(ps) => setActiveStatement(ps)}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl bg-[#0B1528] border border-slate-800 space-y-4 max-w-xl mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Lightbulb className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">No problem statements match these filters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Try widening your search terms, changing the domain filter, or resetting all filters to see all available statements.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Section: CSI CMRIT & SIH Mentorship Support */}
      <section className="py-16 bg-[#070E1E] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-md border border-blue-800/60 font-mono">
              Institutional Incubator
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
              How CSI CMRIT Supports Your SIH Journey
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Our chapter acts as an incubator for CMRIT teams from problem selection to prototype presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-sky-400 border border-blue-500/20 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Problem Deconstruction</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We assist student teams in reviewing government problem statements, evaluating technical feasibility, and assessing requirements before committing to an architecture.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Internal College Screening</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hosting institutional qualification rounds with experienced faculty juries to select the most promising teams as per AICTE and MIC guidelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Architecture &amp; Deck Reviews</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Guiding teams on structuring technical documentation, system dataflow diagrams, UI wireframes, and concise executive pitch presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Composition & Guidelines */}
      <section className="py-16 bg-[#081226] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0B1528] rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                Official AICTE / MIC Mandate
              </span>
              <h3 className="text-xl font-bold text-white">Team Composition Rules</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                As per standard Smart India Hackathon requirements, student teams must adhere to official composition standards:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Each team must have exactly <strong>6 members</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>At least <strong>one female member</strong> is mandatory in every registered team.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>All team members must be enrolled undergraduate students of CMRIT.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Cross-departmental teams combining software and electronics are strongly encouraged.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0B1528] rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                Competitive Edge
              </span>
              <h3 className="text-xl font-bold text-white">Why Participate with CSI CMRIT?</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Taking part in SIH through CSI CMRIT prepares you for competitive engineering careers:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Solve authentic challenges issued directly by central government ministries.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gain rapid system prototyping and agile collaboration experience under time constraints.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct exposure to national juries, academic evaluators, and industry leaders.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Distinguished national credentials that elevate portfolio and placement visibility.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-16 bg-[#070E1E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Solutions for India?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Form your team of 6, select your shortlisted problem statement, and attend the internal CSI CMRIT review round.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link to="/join">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join Chapter &amp; SIH Cell
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToStatements}
              className="border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Explore Statements Hub
            </Button>
          </div>
        </div>
      </section>

      {/* Full Detail Modal */}
      <SihDetailModal
        statement={activeStatement}
        isOpen={activeStatement !== null}
        onClose={() => setActiveStatement(null)}
        isShortlisted={activeStatement ? shortlistedIds.includes(activeStatement.id) : false}
        onToggleShortlist={(id) => toggleShortlist(id)}
      />
    </div>
  );
};
