import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, User, Clock, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter a message';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
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

  const handleClose = () => {
    setIsSuccessModalOpen(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
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
              <span>Chapter Liaison &amp; Desk</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Get in <span className="text-blue-400">Touch</span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-blue-300/90 mt-3 tracking-wide">
              Direct access to chapter leads, faculty advisors, and coordinators.
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl">
              Have questions regarding workshops, event registrations, student chapter membership, or SIH team mentoring? Reach out to our student coordinator council.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Cards + Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Consolidated Chapter Directory Registry */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
              {/* Directory Header Bar */}
              <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 block">
                    // CHAPTER DIRECTORY
                  </span>
                  <span className="font-display text-sm font-bold text-slate-900">
                    Liaison &amp; Registry Desk
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                  MONITORED
                </span>
              </div>

              {/* Directory Rows */}
              <div className="divide-y divide-slate-100">
                {/* Email Row */}
                <div className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 mt-0.5 shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Official Dispatch Email
                    </span>
                    <a
                      href="mailto:csi@cmritonline.ac.in"
                      className="font-mono text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors mt-0.5 block"
                    >
                      csi@cmritonline.ac.in
                    </a>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Inquiries monitored daily. Expected turnaround is 24–48 hours on academic weekdays.
                    </p>
                  </div>
                </div>

                {/* Campus Location Row */}
                <div className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 mt-0.5 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Chapter Headquarters
                    </span>
                    <p className="font-display text-sm font-bold text-slate-900 mt-0.5">
                      CMR Institute of Technology (CMRIT)
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Kandlakoya, Medchal Road, Hyderabad – 501401, Telangana, India.
                    </p>
                    <div className="mt-2 text-xs font-mono font-medium text-blue-600">
                      Tech Block &bull; Lab 4 / Innovation Cell
                    </div>
                  </div>
                </div>

                {/* Operating Hours Row */}
                <div className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 mt-0.5 shrink-0">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Desk Working Hours
                    </span>
                    <p className="font-mono text-xs font-semibold text-slate-900 mt-0.5">
                      Monday &ndash; Friday: 09:30 &ndash; 16:30 IST
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Weekend bootcamps, code sprints, and internal jury rounds follow published event schedules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-card">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <span className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Direct Inquiries
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
                  Transmit a Message
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Have a suggestion, mentorship request, or partnership proposal? Fill out the form below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ananya Rao"
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                          errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-rose-600 font-mono text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                          errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-rose-600 font-mono text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiry regarding CodeSprint 2026 eligibility"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                    Message Content *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide detailed information regarding your inquiry..."
                    className={`w-full p-3 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-slate-50/50 text-slate-900 ${
                      errors.message ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-600 focus:border-blue-600'
                    }`}
                  />
                  {errors.message && <p className="text-rose-600 font-mono text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Send Inbound Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleClose}
        maxWidth="md"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-subtle">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">Message Logged</h3>
            <p className="font-mono text-xs font-medium text-emerald-700 mt-1">
              Thank you for reaching out, {formData.name}!
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 space-y-1 text-left font-mono">
            <p><span className="font-semibold text-slate-800">SENDER:</span> {formData.email}</p>
            {formData.subject && <p><span className="font-semibold text-slate-800">SUBJECT:</span> {formData.subject}</p>}
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 font-mono">
            Notice: Inbound message recorded in frontend state.
          </div>

          <div className="pt-2">
            <Button variant="primary" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

