import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Highlights', path: '/highlights' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'SIH', path: '/sih' },
    { name: 'Join Us', path: '/join' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-md border-b border-slate-800 py-3'
          : 'bg-slate-950 border-b border-slate-850 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Exact Brand Logo from user screenshot */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="CSI CMRIT Chapter"
          >
            {/* Circular CSI Emblem */}
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-blue-500/80 flex items-center justify-center p-1 shadow-sm group-hover:border-blue-400 transition-colors shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                <circle cx="20" cy="20" r="17" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 3"/>
                <path d="M14 20C14 16.6863 16.6863 14 20 14C22.4 14 24.4 15.4 25.3 17.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M26 20C26 23.3137 23.3137 26 20 26C17.6 26 15.6 24.6 14.7 22.5" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3.5" fill="#3b82f6"/>
              </svg>
            </div>

            {/* CSI CMRIT text block */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                    CSI
                  </span>
                  <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                    CMRIT
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                  Chapter
                </span>
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block h-7 w-[1px] bg-slate-700" />

              {/* Subtitles */}
              <div className="hidden sm:flex flex-col text-[11px] text-slate-400 leading-tight">
                <span>Computer Society of India</span>
                <span className="text-slate-300 font-medium">CMRIT Chapter</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-medium transition-all relative ${
                    isActive
                      ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-blue-500'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Search + Admin button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/events"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Search events and announcements"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-sm transition-all hover:border-slate-600"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Login</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              to="/admin/login"
              className="p-1.5 text-slate-300 hover:text-white"
              aria-label="Admin"
            >
              <Shield className="w-4 h-4 text-blue-400" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-white bg-blue-600/30 border border-blue-500/40'
                    : 'text-slate-300 hover:bg-slate-900'
                }`
              }
            >
              <span>{link.name}</span>
            </NavLink>
          ))}

          <div className="pt-3 border-t border-slate-800">
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Admin Portal Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
