import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'slate' | 'emerald' | 'amber' | 'purple' | 'rose';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
  size = 'md'
}) => {
  const variantStyles = {
    blue: 'bg-blue-50/90 text-blue-700 border-blue-200/90',
    slate: 'bg-slate-100/90 text-slate-700 border-slate-200/90',
    emerald: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90',
    amber: 'bg-amber-50/90 text-amber-800 border-amber-200/90',
    purple: 'bg-purple-50/90 text-purple-700 border-purple-200/90',
    rose: 'bg-rose-50/90 text-rose-700 border-rose-200/90'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-0.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-mono font-medium tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
