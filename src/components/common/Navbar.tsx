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
            className="flex items-center gap-3 group focus:outline-none relative py-1"
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
            <div className="flex items-center gap-3 relative">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                    CSI
                  </span>
                  <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">
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
                <span className="group-hover:text-slate-300 transition-colors">Computer Society of India</span>
                <span className="text-slate-300 font-medium group-hover:text-blue-300 transition-colors">CMRIT Chapter</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 sm:gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group relative px-3 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center ${isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5">
                      {link.name}
                    </span>

                    {/* Dynamic hover and active line */}
                    <span
                      className={`absolute bottom-0 left-2.5 right-2.5 h-[2.5px] rounded-full transition-all duration-300 ease-out transform ${isActive
                          ? 'bg-blue-500 scale-x-100 shadow-[0_0_8px_rgba(59,130,246,0.8)] opacity-100'
                          : 'bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(56,189,248,0.7)] origin-center'
                        }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Section: Actions + CSI Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (Desktop) */}
            <Link
              to="/events"
              className="group relative hidden sm:inline-flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all overflow-hidden"
              title="Search events and announcements"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-gradient-to-r from-blue-500 to-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </Link>

            {/* Admin Login (Desktop) */}
            <Link
              to="/admin/login"
              className="group relative hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-sm transition-all hover:border-blue-500 overflow-hidden"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Admin</span>
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-blue-500 to-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
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
                `group relative flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                  ? 'text-white bg-blue-600/30 border border-blue-500/40'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <span>{link.name}</span>
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-500 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
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