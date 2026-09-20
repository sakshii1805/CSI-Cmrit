import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'SIH', path: '/sih' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Floating navbar wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 md:px-10 pointer-events-none">
        <nav
          className={`flex items-center justify-between w-full max-w-7xl pointer-events-auto transition-all duration-500 ease-in-out px-5 py-2.5 rounded-2xl ${isScrolled
            ? 'bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/30 border border-slate-800/60'
            : 'bg-transparent'
            }`}
        >
          {/* Left: Logo + college info (visible at top, collapses on scroll) */}
          <Link
            to="/"
            className="flex items-center gap-3 group pointer-events-auto min-w-0"
            aria-label="CSI CMRIT Chapter Home"
          >
            {/* CSI CMRIT Logo */}
            <img
              src="/images/logos/cmrit_csi_logo.jpeg"
              alt="CSI CMRIT Logo"
              className="h-8 md:h-9 w-auto object-contain rounded-sm transition-all duration-500 shrink-0"
            />

            {/* Divider + Text block — fades out on scroll */}
            <div
              className={`flex items-center gap-2.5 transition-all duration-500 overflow-hidden ${isScrolled ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                }`}
            >
              {/* Vertical divider */}
              <div className="h-8 w-px bg-slate-600/70 shrink-0" />

              {/* Text */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] sm:text-[12px] font-semibold text-white whitespace-nowrap tracking-tight leading-none">
                  Computer Society of India
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span className="text-[9px] sm:text-[10px] font-medium text-slate-400  tracking-widest leading-none">
                    CMRIT Chapter
                  </span>
                </span>
              </div>
            </div>

            {/* CMR College Logo — fades out on scroll */}
            <div
              className={`transition-all duration-500 overflow-hidden shrink-0 ${isScrolled ? 'max-w-0 opacity-0' : 'max-w-[44px] opacity-100'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-1 backdrop-blur-sm">
                <img
                  src="/images/college-logo.png"
                  alt="CMRIT College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </Link>

          {/* Center-Right: Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-opacity duration-200 ${isActive
                    ? 'text-white opacity-100'
                    : 'text-slate-300 hover:opacity-60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: CTA + Admin + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Join Us CTA */}
            <Link
              to="/join"
              className="hidden sm:inline-flex rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap bg-white text-slate-950 px-5 py-2 hover:bg-slate-200"
            >
              Join Us
            </Link>

            {/* Admin (desktop) */}
            <Link
              to="/admin/login"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border border-slate-600 text-slate-300 px-3 py-1.5 hover:border-slate-400 hover:text-white"
              aria-label="Admin Portal"
            >

              Login
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile full-screen drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/97 backdrop-blur-xl flex flex-col pt-24 px-6 pb-10 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-widest py-3.5 border-b border-slate-800 transition-opacity ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/join"
              className="flex items-center justify-center rounded-full text-[11px] font-bold uppercase tracking-wider bg-white text-slate-950 py-3 hover:bg-slate-200 transition-all"
            >
              Join Us
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-700 text-slate-300 py-3 hover:border-slate-500 hover:text-white transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
