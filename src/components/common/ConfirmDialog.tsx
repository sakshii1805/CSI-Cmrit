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
      {/* Backdrop with soft modern frosted blur matching website theme */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Dialog Card - matching website theme white rounded card with elegant shadow */}
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl shadow-slate-900/15 overflow-hidden transform transition-all z-10 animate-scaleUp bg-white border border-slate-200/90 text-slate-900"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            {/* Icon badge matching website theme pastel squircle */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs bg-blue-50 text-blue-600 border border-blue-100"
            >
              {isDanger ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {title}
              </h3>
              {message ? (
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-slate-600 font-normal">
                  {message}
                </p>
              ) : itemName ? (
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-slate-600 font-normal">
                  Are you sure you want to permanently delete <strong className="font-semibold text-slate-900">&ldquo;{itemName}&rdquo;</strong>? This action cannot be undone.
                </p>
              ) : (
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-slate-600 font-normal">
                  Are you sure you want to proceed with this deletion?
                </p>
              )}
            </div>

            {/* Close Cross */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 -mt-1 -mr-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/80"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:shadow-lg disabled:opacity-50"
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
