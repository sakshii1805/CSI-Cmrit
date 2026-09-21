import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  isDarkMode = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Dialog Card */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all z-10 animate-scaleUp ${
          isDarkMode
            ? 'bg-[#0b1329] border border-slate-800 text-white'
            : 'bg-white border border-slate-200 text-slate-900'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isDanger
                  ? isDarkMode
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                  : isDarkMode
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}
            >
              {isDanger ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {title}
              </h3>
              {message ? (
                <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {message}
                </p>
              ) : itemName ? (
                <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Are you sure you want to permanently delete <strong className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>&ldquo;{itemName}&rdquo;</strong>? This action cannot be undone.
                </p>
              ) : (
                <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Are you sure you want to proceed with this deletion?
                </p>
              )}
            </div>

            {/* Close Cross */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`p-1 -mt-1 -mr-1 rounded-lg transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className={`mt-6 flex items-center justify-end gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 ${
                isDarkMode
                  ? 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750'
                  : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 ${
                isDanger
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-rose-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-amber-600/20'
              } disabled:opacity-50`}
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
