import React from 'react';
import { 
  Building2, 
  Tag, 
  Code2, 
  Cpu, 
  Calendar, 
  Bookmark, 
  BookmarkCheck,
  ArrowUpRight
} from 'lucide-react';
import { SIHProblemStatement } from '../../types';

interface SihProblemStatementCardProps {
  statement: SIHProblemStatement;
  isShortlisted: boolean;
  onToggleShortlist: (e: React.MouseEvent, id: string) => void;
  onClick: (statement: SIHProblemStatement) => void;
}

export const SihProblemStatementCard: React.FC<SihProblemStatementCardProps> = ({
  statement,
  isShortlisted,
  onToggleShortlist,
  onClick
}) => {
  return (
    <div
      onClick={() => onClick(statement)}
      className="group relative bg-[#0C172E] hover:bg-[#0E1B36] border border-slate-800/90 hover:border-blue-500/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
    >
      {/* Top Header Row: Status Dot + Code and Category Badge */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                statement.statusDot === 'green'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`}
            />
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-300 tracking-wider">
              {statement.code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Pill: Software vs Hardware */}
            {statement.category === 'Software' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/80">
                <Code2 className="w-3.5 h-3.5" />
                <span>Software</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
                <Cpu className="w-3.5 h-3.5" />
                <span>Hardware</span>
              </span>
            )}

            {/* Bookmark button for student shortlisting */}
            <button
              onClick={(e) => onToggleShortlist(e, statement.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isShortlisted
                  ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
              }`}
              title={isShortlisted ? 'Remove from team shortlist' : 'Shortlist for your team'}
              aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            >
              {isShortlisted ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-sm sm:text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
          {statement.title}
        </h3>

        {/* Ministry / Organization */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{statement.organization}</span>
        </div>

        {/* Theme Pill */}
        <div className="mt-3.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/90 text-slate-300 border border-slate-800">
            <Tag className="w-3 h-3 text-slate-500" />
            <span>{statement.theme}</span>
          </span>
        </div>

        {/* Complexity & Effort Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {/* Complexity badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              statement.complexity === 'Breakthrough'
                ? 'bg-blue-950/70 text-blue-300 border-blue-700/60'
                : statement.complexity === 'Moderate'
                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60'
                : 'bg-teal-950/70 text-teal-300 border-teal-700/60'
            }`}
          >
            • {statement.complexity}
          </span>

          {/* Effort badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              statement.effort === 'High Effort'
                ? 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                : statement.effort === 'Medium Effort'
                ? 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
            }`}
          >
            • {statement.effort}
          </span>
        </div>
      </div>

      {/* Bottom Row: Deadline & Ideas count */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-slate-600" />
          <span>{statement.deadline} ({statement.daysLeft}d left)</span>
        </div>
        <div className="font-medium text-slate-400">
          Ideas: {statement.ideasCount}/{statement.maxIdeas}
        </div>
      </div>
    </div>
  );
};
