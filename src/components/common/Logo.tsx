import React, { useState } from 'react';

/**
 * Single source of truth for the CSI CMRIT logo.
 *
 * To change the logo: replace the file at public/images/logo.png
 * (or change LOGO_SRC below, e.g. to '/images/logo.svg').
 *
 * If the image fails to load, the previous SVG emblem is shown instead,
 * so the site never displays a broken image.
 */
export const LOGO_SRC = '/images/logo.png';

interface LogoMarkProps {
    /** Height of the logo in pixels. Width scales automatically. */
    size?: number;
    className?: string;
}

const FallbackEmblem: React.FC<{ size: number }> = ({ size }) => (
    <div
        className="rounded-full bg-slate-900 border-2 border-blue-500/80 flex items-center justify-center p-1 shrink-0"
        style={{ width: size, height: size }}
        role="img"
        aria-label="CSI CMRIT logo"
    >
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="17" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M14 20C14 16.6863 16.6863 14 20 14C22.4 14 24.4 15.4 25.3 17.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M26 20C26 23.3137 23.3137 26 20 26C17.6 26 15.6 24.6 14.7 22.5" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3.5" fill="#3b82f6" />
        </svg>
    </div>
);

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 40, className = '' }) => {
    const [failed, setFailed] = useState(false);

    if (failed) return <FallbackEmblem size={size} />;

    return (
        <img
            src={LOGO_SRC}
            alt="CSI CMRIT logo"
            onError={() => setFailed(true)}
            style={{ height: size, width: 'auto' }}
            className={`object-contain rounded-full shrink-0 ${className}`}
        />
    );
};