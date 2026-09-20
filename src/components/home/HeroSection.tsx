import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

const heroImages = [
  { src: '/images/cmrit_campus.png', alt: 'CMR Institute of Technology Campus' },
  { src: '/images/campus_hero.jpg', alt: 'CMRIT Campus Building' }
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen h-screen flex items-center justify-center bg-[#060f1e] overflow-hidden">

      {/* ── Full-bleed background image slideshow ── */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, idx) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
          >
            <img
              className="object-cover object-center w-full h-full brightness-[0.4]"
              src={image.src}
              alt={image.alt}
              style={{ animation: 'slowZoom 18s ease-in-out infinite alternate' }}
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060f1e] via-[#060f1e]/25 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-blue-950/20 z-[1]" />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">

          {/* Label */}
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-400/40"
            style={{ animation: 'fadeSlideUp 0.5s ease both' }}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-blue-400 tracking-[0.2em] uppercase">
              Computer Society of India - Student Chapter
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-white select-none tracking-tight"
            style={{ animation: 'fadeSlideUp 0.5s ease 0.12s both' }}
          >
            <span className="block font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white leading-tight">
              Learn, Build,
            </span>
            <span className="block font-display font-black text-4xl sm:text-6xl lg:text-7xl text-blue-500 mt-1 sm:mt-2 leading-tight">
              Innovate
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="font-sans text-sm sm:text-base lg:text-lg font-normal text-slate-200/85 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            style={{ animation: 'fadeSlideUp 0.5s ease 0.24s both' }}
          >
            Empowering the next generation of technologists through collaboration,
            hands-on projects, and meaningful experiences at CMRIT
          </p>

          {/* CTA Buttons */}
          <div
            className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-3"
            style={{ animation: 'fadeSlideUp 0.5s ease 0.36s both' }}
          >
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 px-7 py-3 font-sans text-sm sm:text-base font-semibold rounded-full bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 shadow-xl shadow-white/15 hover:shadow-white/25 hover:scale-105 active:scale-95"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/join"
              className="inline-flex items-center px-7 py-3 font-sans text-sm sm:text-base font-semibold rounded-full border border-white/35 text-white hover:bg-white hover:text-slate-950 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md bg-white/5"
            >
              Join Us
            </Link>
          </div>

        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 ${idx === currentSlide
              ? 'w-6 bg-blue-400 shadow-sm shadow-blue-400/50'
              : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 z-10">
        <span className="text-[9px] text-white/35 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/35 animate-bounce" />
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
};
