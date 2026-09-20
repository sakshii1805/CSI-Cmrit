import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Search } from 'lucide-react';
import { LogoMark } from './Logo';

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
    { name: 'Gallery', path: '/gallery' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'SIH', path: '/sih' },
    { name: 'Join Us', path: '/join' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-md border-b border-slate-800 py-3'
          : 'bg-slate-950 border-b border-slate-850 py-3.5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo (College Logo) */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="CSI CMRIT Chapter"
          >
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm border border-slate-700/60 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/images/college-logo.png"
                alt="CMR Logo"
                className="w-full h-full object-cover rounded-full"
              />
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
                  `px-3 py-1.5 text-xs font-medium transition-all relative ${isActive
                    ? 'text-white font-semibold after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-blue-500'
                    : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Section: Actions + CSI Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (Desktop) */}
            <Link
              to="/events"
              className="hidden sm:inline-flex p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Search events and announcements"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Admin Login (Desktop) */}
            <Link
              to="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-sm transition-all hover:border-slate-600"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin</span>
            </Link>

            {/* CSI Chapter Logo */}
            <a
              href="https://csi-india.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center p-0.5 shadow-sm border border-slate-700/60 transition-all hover:scale-105 shrink-0 overflow-hidden"
              title="Computer Society of India (CSI)"
              aria-label="Computer Society of India (CSI)"
            >
              <img
                src="/images/logo.png"
                alt="CSI Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </a>

            {/* Mobile Admin Icon */}
            <Link
              to="/admin/login"
              className="p-1.5 text-slate-300 hover:text-white sm:hidden"
              aria-label="Admin"
            >
              <Shield className="w-4 h-4 text-blue-400" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none xl:hidden"
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
                `flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive
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