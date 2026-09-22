import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Tag, 
  Code2, 
  Cpu, 
  Calendar, 
  Users, 
  Layers, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  ExternalLink,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { SIHProblemStatement } from '../../types';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

interface SihDetailModalProps {
  statement: SIHProblemStatement | null;
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
}

export const SihDetailModal: React.FC<SihDetailModalProps> = ({
  statement,
  isOpen,
  onClose,
  isShortlisted,
  onToggleShortlist
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !statement) return null;

  const handleCopy = () => {
    const textToCopy = `[${statement.code}] ${statement.title} (${statement.category} | ${statement.theme})\nOrg: ${statement.organization}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Problem Statement details copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl w-full bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 animate-scaleUp text-slate-900 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Navigation Bar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                statement.statusDot === 'green'
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                  : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
              }`}
            />
            <span className="font-mono text-sm font-bold text-blue-600 tracking-wider">
              {statement.code}
            </span>
            <span className="text-slate-300 font-mono">|</span>
            <span className="text-xs text-slate-500 font-medium">
              Official SIH 2026 Problem Statement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(statement.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isShortlisted
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isShortlisted ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Shortlisted</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Shortlist for Team</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Header & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {statement.category === 'Software' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Software Edition</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Hardware Edition</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Tag className="w-3 h-3 text-slate-500" />
                <span>{statement.theme}</span>
              </span>

              <span
                className={`px-3.5 py-1 rounded-full text-xs font-semibold border ${
                  statement.complexity === 'Breakthrough'
                    ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                    : statement.complexity === 'Moderate'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                    : 'bg-teal-50 text-teal-700 border-teal-200/60'
                }`}
              >
                Complexity: {statement.complexity}
              </span>

              <span
                className={`px-3.5 py-1 rounded-full text-xs font-semibold border ${
                  statement.effort === 'High Effort'
                    ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                    : statement.effort === 'Medium Effort'
                    ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                }`}
              >
                Effort: {statement.effort}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {statement.title}
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2 font-medium">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{statement.organization}</span>
            </div>
          </div>

          {/* Detailed Problem Description */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Detailed Problem Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {statement.description}
            </p>
          </div>

          {/* Expected Solution */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Expected Prototype Deliverables
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {statement.expectedSolution}
            </p>
          </div>

          {/* Suggested Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Suggested Tech Stack &amp; Tools:
            </h4>
            <div className="flex flex-wrap gap-2">
              {statement.suggestedStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-white border border-slate-200 text-blue-700 shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Team Composition Recommendations */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-950 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              <Users className="w-4 h-4 text-indigo-600" />
              Recommended Team Profile:
            </div>
            <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
              {statement.teamCompositionGuide}
            </p>
          </div>

          {/* Evaluator Rubrics Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Key Focus For Evaluation Jury:
            </h4>
            <div className="space-y-2.5">
              {statement.evaluatorFocus.map((focus, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all border border-slate-200 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Reference</span>
                </>
              )}
            </button>
            <a
              href="https://sih.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              <span>sih.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
