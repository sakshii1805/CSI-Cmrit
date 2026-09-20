import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Compass,
  FileCode2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { mockGallery } from '../data/gallery';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { LightboxModal } from '../components/gallery/LightboxModal';
import { GalleryItem } from '../types';

export const SIH: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const sihPhotos = mockGallery.filter((g) => g.category === 'SIH' || g.category === 'Hackathons').slice(0, 3);

  const focusThemes = [
    {
      title: 'Smart Healthcare & Diagnostics',
      desc: 'Formulating assistive health tech, automated diagnostics, telemetry, and hospital workflow optimization software.',
      icon: <Target className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Agriculture & Rural Innovation',
      desc: 'Developing precision crop health analyzers, supply-chain transparency, and smart irrigation controllers.',
      icon: <Layers className="w-5 h-5 text-emerald-600" />
    },
    {
      title: 'Clean Energy & Smart Infrastructure',
      desc: 'IoT-enabled electrical grid monitoring, waste segregation telemetry, and civic problem reporting systems.',
      icon: <Cpu className="w-5 h-5 text-cyan-600" />
    },
    {
      title: 'Cybersecurity & Public Safety',
      desc: 'Secure distributed ledger architectures, privacy-preserving communications, and identity verification frameworks.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              National Flagship Hackathon
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smart India Hackathon
            </h1>
            <p className="text-xl sm:text-2xl text-blue-400 font-medium">
              From ideas to solutions.
            </p>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal pt-2">
              Empowering CMRIT engineering students to transform academic theoretical knowledge into deployable national technological solutions for central ministries, state departments, and industry sectors.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/join">
                <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Join SIH Working Groups
                </Button>
              </Link>
              <Link to="/announcements">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-700 text-slate-200 hover:text-white hover:bg-slate-900"
                >
                  View Screening Notices
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: What is SIH? */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                National Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                What is Smart India Hackathon?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Smart India Hackathon (SIH) is a nationwide initiative organized by the Ministry of Education&apos;s Innovation Cell (MIC), AICTE, and the Government of India. It provides students with a nationwide platform to solve some of the pressing problems faced in daily governance, industries, and social sectors.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The hackathon comprises two distinct editions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Software Edition</h4>
                  <p className="text-xs text-slate-600">
                    A non-stop 36-hour coding marathon building production-grade web systems, mobile applications, and AI pipelines.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Hardware Edition</h4>
                  <p className="text-xs text-slate-600">
                    A multi-day intensive sprint fabricating physical hardware prototypes, embedded sensors, robotics, and IoT frameworks.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating on prototype hardware and software"
                className="rounded-2xl border border-slate-200 shadow-card w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: CSI CMRIT & SIH */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60">
              Chapter Mentorship
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              CSI CMRIT & Smart India Hackathon
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Our chapter acts as an incubator for CMRIT teams from problem selection to prototype presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Problem Deconstruction</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We assist student teams in reviewing government problem statements, evaluating technical feasibility, and assessing requirements before committing to an architecture.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Internal College Hackathons</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hosting institutional qualification rounds with experienced faculty juries to select the most promising teams as per AICTE and MIC guidelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Architecture & Deck Reviews</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guiding teams on structuring technical documentation, system dataflow diagrams, UI wireframes, and concise executive pitch presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Focus Themes */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Innovation Verticals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Key Focus Areas & Projects
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Sample innovation domains where our student teams explore practical engineering applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {focusThemes.map((theme, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    {theme.icon}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{theme.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
                  {theme.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Team Guidelines & Why Participate */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Guidelines
              </span>
              <h3 className="text-xl font-bold text-slate-900">Team Composition Rules</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As per standard Smart India Hackathon requirements, student teams must adhere to official composition standards:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Each team must have exactly <strong>6 members</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>At least <strong>one female member</strong> is mandatory in every registered team.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>All team members must be enrolled undergraduate students of CMRIT.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Cross-departmental teams combining software and electronics are encouraged.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Growth
              </span>
              <h3 className="text-xl font-bold text-slate-900">Why Participate?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Taking part in SIH through CSI CMRIT prepares you for competitive engineering careers:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Solve authentic challenges issued directly by central government ministries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Gain rapid system prototyping and agile collaboration experience under time constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct exposure to national juries, academic evaluators, and industry leaders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Distinguished national credentials that elevate portfolio and placement visibility.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Gallery Preview */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Visual Archives
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                SIH & Hackathon Memories
              </h2>
            </div>
            <Link to="/gallery">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Photos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sihPhotos.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setSelectedPhoto(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Solutions for India?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Form your team, explore open problem statements, and participate in the next CSI CMRIT internal screening round.
          </p>
          <div className="pt-2">
            <Link to="/join">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join Chapter & SIH Cell
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <LightboxModal
        isOpen={!!selectedPhoto}
        item={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
};
