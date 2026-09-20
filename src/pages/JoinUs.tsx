import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck,
  Laptop,
  Users2,
  Code,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const JoinUs: React.FC = () => {
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
    'Cloud Infrastructure & DevOps',
    'Applied Artificial Intelligence',
    'Cybersecurity & Network Auditing',
    'Smart India Hackathon (SIH)',
    'Event Operations & Technical Media'
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
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid contact number';
    }
    if (!formData.reason.trim()) {
      errs.reason = 'Please explain your technical motivation for joining';
    } else if (formData.reason.trim().length < 15) {
      errs.reason = 'Please enter at least 15 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSuccessModalOpen(true);
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
      {/* Sleek Masthead */}
      <section className="bg-[#081325] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-blue-500/30 bg-blue-950/50 text-blue-400 font-mono text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Membership Intake • Academic Year 2026</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Join <span className="text-blue-400">CSI CMRIT</span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-blue-300/90 mt-3 tracking-wide">
              Engineering depth, hackathon cohorts, and institutional mentorship.
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl">
              Become part of a collaborative student engineering chapter. Work on live open-source tooling, participate in national competitions, and learn directly from senior engineers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Application Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-card">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <span className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Official Application
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
                  Student Registration Dossier
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Open to all currently enrolled undergraduate students of CMR Institute of Technology, Hyderabad.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono uppercase">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sravan Kumar"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                        errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-rose-600 font-mono text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono uppercase">
                      Institutional / Personal Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@student.cmritonline.ac.in"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                          errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-rose-600 font-mono text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono uppercase">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                          errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-rose-600 font-mono text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Year & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono uppercase">
                      Academic Cohort
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono uppercase">
                      Engineering Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
                      >
                        <option value="Computer Science & Engineering">Computer Science &amp; Eng (CSE)</option>
                        <option value="Artificial Intelligence & Machine Learning">CSE (AI &amp; ML)</option>
                        <option value="Data Science">CSE (Data Science)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="Electronics & Communication">Electronics &amp; Comm (ECE)</option>
                        <option value="Electrical & Electronics">Electrical &amp; Electronics (EEE)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary Areas of Interest */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 font-mono uppercase">
                    Core Technical Interests (Select Multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((item) => {
                      const isSelected = formData.interests.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleInterest(item)}
                          className={`font-mono text-xs px-3 py-1.5 rounded-md border font-medium transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono uppercase">
                    Technical Objective &amp; Background *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Briefly state your technical background, current areas of focus, or what you intend to build with the chapter..."
                    className={`w-full p-3 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                      errors.reason ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                    }`}
                  />
                  {errors.reason && <p className="text-rose-600 font-mono text-xs mt-1">{errors.reason}</p>}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Submit Membership Application
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Benefits & Why Join */}
          <div className="lg:col-span-5 space-y-6">
            {/* Why Join CSI Card */}
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Value Mandate
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                  Why Join CSI CMRIT?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                As an active student member, you bridge standard academic coursework with production-grade engineering practices.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-display text-xs font-bold text-slate-900">Priority Workshop Labs</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Reserved seating for Cloud, Linux, Docker, and Security deep dives.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-display text-xs font-bold text-slate-900">SIH Hackathon Incubation</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Mentorship, cohort formation, and pitch review for Smart India Hackathon.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-display text-xs font-bold text-slate-900">Senior Technical Mentorship</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Direct access to experienced alumni and seniors for career guidance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Who Can Join Card */}
            <div className="bg-[#081325] rounded-xl p-6 sm:p-7 text-white border border-slate-800 space-y-4 shadow-elevated">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Eligibility Criteria</span>
              </div>
              <h4 className="font-display text-base font-bold text-white">Who Can Join?</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-1 py-0.5 rounded border border-blue-800">01</span>
                  <span>Enrolled undergraduate students of CMRIT across any of the 4 academic years.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-1 py-0.5 rounded border border-blue-800">02</span>
                  <span>Students from any branch (CSE, IT, ECE, AI&amp;ML, EEE, Mech) passionate about software.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-1 py-0.5 rounded border border-blue-800">03</span>
                  <span>Commitment to active participation in chapter workshops, labs, and team hackathons.</span>
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
          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-subtle">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">Application Recorded</h3>
            <p className="font-mono text-xs font-medium text-emerald-700 mt-1">
              Application captured in frontend prototype.
            </p>
          </div>

          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>! Your submission has been captured in the system. The chapter coordinator team will review applications for the upcoming cohort.
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

