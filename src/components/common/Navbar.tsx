import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EditProfileModal } from '../admin/in-place/EditProfileModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { isAdmin, signOut, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Floating navbar wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-4 px-3 sm:px-4 md:px-8 pointer-events-none">
        <nav
          className={`flex items-center justify-between w-full max-w-7xl pointer-events-auto transition-all duration-300 ease-in-out px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border ${
            isScrolled
              ? 'bg-slate-950/95 backdrop-blur-md border-slate-800/80 shadow-xl shadow-black/40'
              : isHomePage
                ? 'bg-transparent border-transparent'
                : 'bg-slate-950/90 backdrop-blur-md border-slate-800/80 shadow-lg shadow-black/30'
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
              {/* Text */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] sm:text-[12px] font-semibold text-white whitespace-nowrap tracking-tight leading-none">
                  Computer Society of India
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span className="text-[8px] sm:text-[9px] font-medium text-slate-400 tracking-widest leading-none whitespace-nowrap">
                    CMRIT Student Chapter
                  </span>
                </span>
              </div>
            </div>

            {/* CMR College Logo + label — fades out on scroll */}
            <div
              className={`flex items-center gap-2 transition-all duration-500 overflow-hidden ${isScrolled ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                }`}
            >
              {/* Second vertical divider */}
              <div className="h-8 w-px bg-slate-600/70 shrink-0" />

              {/* Logo square */}
              <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0">
                <img
                  src="/images/logos/cmr_new_logo.png"
                  alt="CMRIT College Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* College name + tagline */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 whitespace-nowrap tracking-tight leading-none">
                  CMR Institute of Technology
                </span>
                <span className="text-[8px] sm:text-[9px] font-medium text-slate-400 tracking-widest leading-none whitespace-nowrap">
                  Explore to Invent
                </span>
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

          {/* Right: CTA + Admin Profile / Login + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Join Us CTA */}
            <Link
              to="/join"
              className="hidden sm:inline-flex rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap bg-white text-slate-950 px-5 py-2 hover:bg-slate-200"
            >
              Join Us
            </Link>

            {/* Admin Circular Profile or Login */}
            {isAdmin ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-blue-500/50 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white shadow-md cursor-pointer overflow-hidden"
                  aria-label="Admin Profile Menu"
                  aria-expanded={profileDropdownOpen}
                  title={profile?.full_name || 'Admin Profile'}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Admin'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-[11px] font-bold tracking-wider uppercase select-none">
                      {getInitials(profile?.full_name)}
                    </span>
                  )}
                  {/* Active status indicator dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name || 'Admin'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{getInitials(profile?.full_name)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {profile?.full_name || 'Student Admin'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {profile?.email || 'admin@cmritonline.ac.in'}
                          </p>
                          <span className="inline-block mt-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {profile?.designation || 'Administrator'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <UserCog className="w-4 h-4 text-blue-400" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          await signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border border-slate-600 text-slate-300 px-3 py-1.5 hover:border-slate-400 hover:text-white"
                aria-label="Admin Portal"
              >
                Login
              </Link>
            )}

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

            {isAdmin ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Admin" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(profile?.full_name)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{profile?.full_name || 'Student Admin'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{profile?.email || 'admin@cmritonline.ac.in'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 py-2.5 hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <UserCog className="w-3.5 h-3.5 text-blue-400" />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold bg-rose-600/20 border border-rose-500/30 text-rose-300 py-2.5 hover:bg-rose-600/30 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-700 text-slate-300 py-3 hover:border-slate-500 hover:text-white transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
};

