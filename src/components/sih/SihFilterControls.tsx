import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  RotateCcw, 
  Code2, 
  Cpu, 
  Layers, 
  Bookmark,
  Check
} from 'lucide-react';
import { sihThemes, sihComplexities, sihEfforts, sihCategories } from '../../data/sihProblemStatements';

export type SortOption = 'code-asc' | 'code-desc' | 'title-asc' | 'complexity' | 'effort-desc' | 'effort-asc';

interface SihFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  selectedComplexity: string;
  setSelectedComplexity: (comp: string) => void;
  selectedEffort: string;
  setSelectedEffort: (effort: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  shortlistCount: number;
  showOnlyShortlisted: boolean;
  setShowOnlyShortlisted: (val: boolean) => void;
  totalFiltered: number;
  totalAvailable: number;
  onResetFilters: () => void;
}

export const SihFilterControls: React.FC<SihFilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTheme,
  setSelectedTheme,
  selectedComplexity,
  setSelectedComplexity,
  selectedEffort,
  setSelectedEffort,
  sortBy,
  setSortBy,
  shortlistCount,
  showOnlyShortlisted,
  setShowOnlyShortlisted,
  totalFiltered,
  totalAvailable,
  onResetFilters
}) => {
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(true);

  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedTheme !== 'All' ||
    selectedComplexity !== 'All' ||
    selectedEffort !== 'All' ||
    showOnlyShortlisted;

  return (
    <div className="space-y-4">
      {/* Top Disclaimer Line (from Reference 2) */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <p>
          * Referenced from official SIH problem statement directory. Data sourced from <span className="text-sky-400 underline underline-offset-2">sih.gov.in</span>
        </p>
        <p className="text-slate-500">
          Updated for SIH 2026 Season
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, org, theme or PS number..."
            className="w-full pl-11 pr-10 py-3 bg-[#0B1528] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-mono text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none w-full md:w-auto pl-4 pr-10 py-3 bg-[#0B1528] border border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="code-asc">Sort: PS Number (Low to High)</option>
            <option value="code-desc">Sort: PS Number (High to Low)</option>
            <option value="title-asc">Sort: Title (A – Z)</option>
            <option value="complexity">Sort: Breakthrough First</option>
            <option value="effort-desc">Sort: High Effort First</option>
            <option value="effort-asc">Sort: Low Effort First</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            isFilterPanelExpanded || hasActiveFilters
              ? 'bg-blue-600/20 text-sky-400 border-blue-500/50 hover:bg-blue-600/30'
              : 'bg-[#0B1528] text-slate-300 border-slate-800 hover:bg-slate-800/80'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          )}
        </button>

        {/* Shortlist Filter Tab */}
        <button
          onClick={() => setShowOnlyShortlisted(!showOnlyShortlisted)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            showOnlyShortlisted
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-[#0B1528] text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Filter to shortlisted problem statements"
        >
          <Bookmark className={`w-4 h-4 ${showOnlyShortlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>Shortlisted</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300">
            {shortlistCount}
          </span>
        </button>
      </div>

      {/* Expanded Filter Panel */}
      {isFilterPanelExpanded && (
        <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Filter 1: H/W vs S/W Category (Requested by User) */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              1. Type (Hardware / Software):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedCategory('Software')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'Software'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-blue-400 hover:bg-blue-950/40 border border-blue-900/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Software (S/W)
              </button>
              <button
                onClick={() => setSelectedCategory('Hardware')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'Hardware'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900 text-amber-400 hover:bg-amber-950/40 border border-amber-900/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Hardware (H/W)
              </button>
            </div>
          </div>

          {/* Filter 2: Complexity & Effort (Requested by User) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            {/* Complexity */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                2. Complexity Tier:
              </span>
              <div className="flex flex-wrap gap-2">
                {sihComplexities.map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setSelectedComplexity(comp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedComplexity === comp
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            {/* Effort */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                3. Effort Requirement:
              </span>
              <div className="flex flex-wrap gap-2">
                {sihEfforts.map((effort) => (
                  <button
                    key={effort}
                    onClick={() => setSelectedEffort(effort)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedEffort === effort
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {effort}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter 3: Themes / Domains (Requested by User) */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                4. Theme / Domain:
              </span>
              {selectedTheme !== 'All' && (
                <button
                  onClick={() => setSelectedTheme('All')}
                  className="text-[11px] font-mono text-sky-400 hover:underline"
                >
                  Clear Theme Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
              {sihThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                    selectedTheme === theme
                      ? 'bg-blue-500 text-white font-semibold shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters Footer */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Filters currently active
              </span>
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors border border-rose-900/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result Counter (from Reference 2) */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 px-1 pt-1 font-mono">
        <div>
          Showing <span className="font-bold text-white">{totalFiltered}</span> of{' '}
          <span className="font-bold text-white">{totalAvailable}</span> problem statements
        </div>

        {showOnlyShortlisted && (
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
            Filtered by My Team Shortlist
          </span>
        )}
      </div>
    </div>
  );
};
