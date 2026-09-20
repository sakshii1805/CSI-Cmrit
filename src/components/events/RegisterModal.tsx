import React, { useState } from 'react';
import { CheckCircle2, User, Mail, Hash, Phone, Building } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { EventItem } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, event }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    email: '',
    year: '2nd Year',
    branch: 'Computer Science & Engineering',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.rollNo.trim()) errs.rollNo = 'College Roll Number is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.phone)) {
      errs.phone = 'Enter a valid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      rollNo: '',
      email: '',
      year: '2nd Year',
      branch: 'Computer Science & Engineering',
      phone: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={isSubmitted ? 'Registration Status' : `Register for ${event.title}`}
      maxWidth="lg"
    >
      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Registration Confirmed</h4>
            <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              You are signed up for <span className="font-semibold text-slate-800">{event.title}</span>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1 text-left max-w-sm mx-auto">
            <p><span className="font-semibold text-slate-800">Participant:</span> {formData.fullName} ({formData.rollNo})</p>
            <p><span className="font-semibold text-slate-800">Date:</span> {event.date} at {event.time}</p>
            <p><span className="font-semibold text-slate-800">Venue:</span> {event.venue}</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 max-w-sm mx-auto">
            💡 Notice: Frontend registration demo. Backend database integration will be connected later.
          </div>

          <div className="pt-2">
            <Button variant="primary" onClick={handleResetAndClose} className="w-full sm:w-auto">
              Close Window
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 pb-1 border-b border-slate-100">
            Please fill in your details to secure your seat for this event.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-rose-600 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Roll No */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll / Student ID *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="e.g. 22H51A05XX"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.rollNo ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.rollNo && <p className="text-rose-600 text-xs mt-1">{errors.rollNo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@student.cmritonline.ac.in"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-white"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Branch
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Eng (CSE)</option>
                  <option value="Artificial Intelligence & Machine Learning">CSE (AI & ML)</option>
                  <option value="Data Science">CSE (Data Science)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics & Communication">Electronics & Comm (ECE)</option>
                  <option value="Other">Other Department</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Confirm Registration
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
