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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl w-full bg-[#0B1528] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 text-white my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Navigation Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#081020] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                statement.statusDot === 'green'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`}
            />
            <span className="font-mono text-sm font-bold text-sky-400 tracking-wider">
              {statement.code}
            </span>
            <span className="text-slate-600 font-mono">|</span>
            <span className="font-mono text-xs text-slate-400">
              Official SIH 2026 Problem Statement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(statement.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
                isShortlisted
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {isShortlisted ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-400" />
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-950/90 text-blue-300 border border-blue-800">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Software Edition</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-950/90 text-amber-300 border border-amber-800">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Hardware Edition</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-700">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>{statement.theme}</span>
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  statement.complexity === 'Breakthrough'
                    ? 'bg-blue-950/80 text-blue-300 border-blue-700'
                    : statement.complexity === 'Moderate'
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700'
                    : 'bg-teal-950/80 text-teal-300 border-teal-700'
                }`}
              >
                Complexity: {statement.complexity}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  statement.effort === 'High Effort'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                    : statement.effort === 'Medium Effort'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                }`}
              >
                Effort: {statement.effort}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {statement.title}
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-300 mt-2 font-mono">
              <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{statement.organization}</span>
            </div>
          </div>

          {/* Detailed Problem Description */}
          <div className="p-5 rounded-xl bg-[#070F1E] border border-slate-800 space-y-2">
            <h3 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Detailed Problem Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {statement.description}
            </p>
          </div>

          {/* Expected Solution */}
          <div className="p-5 rounded-xl bg-[#070F1E] border border-slate-800 space-y-2">
            <h3 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Expected Prototype Deliverables
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {statement.expectedSolution}
            </p>
          </div>

          {/* Suggested Tech Stack */}
          <div>
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Suggested Tech Stack &amp; Tools:
            </h4>
            <div className="flex flex-wrap gap-2">
              {statement.suggestedStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-700 text-sky-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Team Composition Recommendations */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              <Users className="w-4 h-4 text-purple-400" />
              Recommended Team Profile:
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-mono">
              {statement.teamCompositionGuide}
            </p>
          </div>

          {/* Evaluator Rubrics Checklist */}
          <div>
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Key Focus For Evaluation Jury:
            </h4>
            <div className="space-y-2">
              {statement.evaluatorFocus.map((focus, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#081020] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-mono font-semibold transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-sky-400 hover:bg-slate-900 transition-colors"
            >
              <span>sih.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
