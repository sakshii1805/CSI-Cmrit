import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { evaluatePasswordSecurity, PasswordValidationResult } from '../../lib/passwordSecurity';

interface PasswordStrengthIndicatorProps {
  password: string;
  confirmPassword?: string;
  showRequirements?: boolean;
  isDarkMode?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  confirmPassword,
  showRequirements = true,
  isDarkMode = true
}) => {
  if (!password && !confirmPassword) return null;

  const result: PasswordValidationResult = evaluatePasswordSecurity(password);
  const passwordsMatch = confirmPassword !== undefined && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword !== undefined && confirmPassword.length > 0 && password !== confirmPassword;

  // Segment colors based on score (1 to 5)
  const getSegmentColor = (segmentIndex: number) => {
    if (segmentIndex > result.score) {
      return isDarkMode ? 'bg-slate-800' : 'bg-slate-200';
    }
    if (result.score <= 2) return 'bg-rose-500';
    if (result.score === 3) return 'bg-amber-500';
    if (result.score === 4) return 'bg-sky-500';
    return 'bg-emerald-500';
  };

  const getStrengthTextColor = () => {
    if (result.score <= 2) return 'text-rose-400';
    if (result.score === 3) return 'text-amber-400';
    if (result.score === 4) return 'text-sky-400';
    return 'text-emerald-400';
  };

  return (
    <div className="space-y-3 pt-1 text-xs">
      {/* Strength Bar & Label */}
      {password.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
              Password Strength:
            </span>
            <span className={`font-semibold flex items-center gap-1 ${getStrengthTextColor()}`}>
              {result.isValid ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : result.score <= 2 ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <Shield className="w-3.5 h-3.5" />
              )}
              <span>{result.strengthLabel}</span>
            </span>
          </div>

          {/* 5-segment meter */}
          <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4, 5].map((segmentIndex) => (
              <div
                key={segmentIndex}
                className={`rounded-full transition-all duration-300 ${getSegmentColor(segmentIndex)}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Requirements Checklist */}
      {showRequirements && (
        <div
          className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
            isDarkMode
              ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Security Requirements</span>
            <span className="font-mono text-slate-500">{result.score}/5 met</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
            {result.requirements.map((req) => (
              <div
                key={req.id}
                className={`flex items-center gap-1.5 transition-colors ${
                  req.met
                    ? 'text-emerald-400 font-medium'
                    : isDarkMode
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    req.met
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-slate-200 text-slate-400 border border-slate-300'
                  }`}
                >
                  {req.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2 h-2" />}
                </div>
                <span className="text-[11px] leading-tight">{req.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Match Status */}
      {confirmPassword !== undefined && confirmPassword.length > 0 && (
        <div
          className={`flex items-center gap-1.5 text-[11px] font-medium transition-all ${
            passwordsMatch
              ? 'text-emerald-400'
              : passwordsMismatch
              ? 'text-rose-400'
              : 'text-slate-400'
          }`}
        >
          {passwordsMatch ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Passwords match perfectly</span>
            </>
          ) : (
            <>
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Passwords do not match yet</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
