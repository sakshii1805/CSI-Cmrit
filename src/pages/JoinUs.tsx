import React, { useState } from 'react';
import {
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Users2,
  Users,
  Code
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { joinService } from '../services/joinService';
import { useAuth } from '../context/AuthContext';

export const JoinUs: React.FC = () => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    year: '2nd Year',
    branch: 'Computer Science & Engineering',
    phone: '',
    reason: '',
    interests: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const interestOptions = [
    'Competitive Programming',
    'Full Stack Web Development',
    'Cloud Computing & DevOps',
    'Artificial Intelligence & ML',
    'Cybersecurity & Ethical Hacking',
    'National Hackathons',
    'Event Management & Media'
  ];

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.reason.trim()) {
      errs.reason = 'Please explain why you wish to join CSI CMRIT';
    } else if (formData.reason.trim().length < 15) {
      errs.reason = 'Please provide at least 15 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await joinService.submitApplication({
        fullName: formData.fullName,
        email: formData.email,
        year: formData.year,
        branch: formData.branch,
        phone: formData.phone,
        reason: formData.reason,
      });

      if (!res.success) {
        setErrors({ form: res.error || 'Failed to submit application. Please try again.' });
        return;
      }

      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrors({ form: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
    setFormData({
      fullName: '',
      email: '',
      year: '2nd Year',
      branch: 'Computer Science & Engineering',
      phone: '',
      reason: '',
      interests: []
    });
    setErrors({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white pt-24 sm:pt-28 pb-12 sm:pb-16 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
                Membership Drive 2026
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-3">
                Join CSI CMRIT
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Become part of a forward-thinking student engineering network. Elevate your technical proficiencies, contribute to hackathons, and build lifelong professional connections.
              </p>
            </div>

            {isAdmin && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('csi_open_submissions_drawer', { detail: { tab: 'applications' } }))}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
                >
                  <Users className="w-4 h-4" />
                  <span>Review Join Applications</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Application Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Student Application Form
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Open to all undergraduate students of CMR Institute of Technology, Hyderabad.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sravan Kumar"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 ${errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                        }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-rose-600 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@student.cmritonline.ac.in"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 ${errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                          }`}
                      />
                    </div>
                    {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 ${errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                          }`}
                      />
                    </div>
                    {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Year & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Academic Year
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Department / Branch
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Eng (CSE)</option>
                        <option value="Artificial Intelligence & Machine Learning">CSE (AI & ML)</option>
                        <option value="Data Science">CSE (Data Science)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="Electronics & Communication">Electronics & Comm (ECE)</option>
                        <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary Areas of Interest */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Primary Areas of Interest (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((item) => {
                      const isSelected = formData.interests.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleInterest(item)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${isSelected
                              ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Why do you want to join */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Why do you want to join CSI CMRIT? *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Describe your technical interests, past projects, or what you hope to learn and build as part of the chapter..."
                    className={`w-full p-3.5 text-sm rounded-xl border focus:outline-none focus:ring-2 ${errors.reason ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                      }`}
                  />
                  {errors.reason && <p className="text-rose-600 text-xs mt-1">{errors.reason}</p>}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </div>
                {errors.form && (
                  <p className="text-rose-600 text-xs text-center font-medium mt-2">{errors.form}</p>
                )}
              </form>
            </div>
          </div>

          {/* Right: Benefits & Why Join */}
          <div className="lg:col-span-5 space-y-6">
            {/* Why Join CSI Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Value Proposition
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Why Join CSI CMRIT?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As an active student member of the CSI CMRIT Chapter, you bridge academic textbook learning with high-impact software practices.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Priority Workshop Access</h5>
                    <p className="text-xs text-slate-500">Reserved seating for Cloud, Docker, and Web Security hands-on labs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Hackathon Incubation</h5>
                    <p className="text-xs text-slate-500">Mentorship, team formation, and pitch deck validation for national hackathons.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Peer & Senior Mentorship</h5>
                    <p className="text-xs text-slate-500">Direct access to experienced seniors for guidance on placement preparation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Who Can Join Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Eligibility Criteria
              </div>
              <h4 className="text-base font-bold text-white">Who Can Join?</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Enrolled undergraduate students of CMRIT across all 4 years.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Students from any branch (CSE, IT, ECE, AI&ML, etc.) passionate about tech.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Commitment to active participation in chapter workshops and projects.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccess}
        maxWidth="md"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">Application Received</h3>
            <p className="text-sm font-semibold text-emerald-700 mt-2">
              Your membership application has been submitted successfully!
            </p>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-800">{formData.fullName}</span>! Your application is recorded in the chapter database. The executive coordinator council will review your submission and contact you via email.
          </p>

          <div className="pt-2">
            <Button variant="primary" onClick={handleCloseSuccess} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
