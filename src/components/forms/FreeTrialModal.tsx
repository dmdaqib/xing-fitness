import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, Target, User, Phone, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BRAND } from '../../data/brand';
import { leadService, type LeadEnquiry } from '../../services/leadService';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGoal?: string;
}

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({
  isOpen,
  onClose,
  preselectedGoal = 'Strength Training'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: 'Morning (06:00 AM - 09:00 AM)',
    goal: preselectedGoal
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedLead, setConfirmedLead] = useState<LeadEnquiry | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.date) {
      setErrorMsg('Please select your preferred visit date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await leadService.submitEnquiry({
        name: formData.name,
        phone: cleanPhone,
        type: 'Free Trial',
        preferredDate: formData.date,
        preferredTime: formData.timeSlot,
        fitnessGoal: formData.goal,
        message: `Preferred trial on ${formData.date} during ${formData.timeSlot}. Goal: ${formData.goal}`
      });

      setConfirmedLead(response.lead);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFFFFF', '#38BDF8']
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to submit enquiry. Please try again or WhatsApp us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedLead(null);
    setErrorMsg(null);
    onClose();
  };

  const nextSteps = leadService.getNextSteps('Free Trial');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#121620] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedLead ? (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  Complimentary 1-Day Pass
                </span>
              </div>
              <h3 id="trial-modal-title" className="font-display font-black text-2xl sm:text-3xl text-white">
                BOOK A FREE TRIAL
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Experience Xing Fitness in Brookefield. Full gym access and movement consultation included.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="trial-name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="trial-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="trial-phone" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="trial-phone"
                    type="tel"
                    required
                    maxLength={15}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="trial-date" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="trial-date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="trial-time" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      id="trial-time"
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    >
                      <option value="Morning (06:00 AM - 09:00 AM)">Morning (6 AM – 9 AM)</option>
                      <option value="Mid-Day (10:00 AM - 01:00 PM)">Mid-Day (10 AM – 1 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (5 PM – 8 PM)</option>
                      <option value="Night (08:00 PM - 10:00 PM)">Night (8 PM – 10 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Primary Goal */}
              <div>
                <label htmlFor="trial-goal" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Fitness Goal *
                </label>
                <div className="relative">
                  <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    id="trial-goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="Strength Training">Get Stronger / Strength Training</option>
                    <option value="Build Muscle">Build Muscle / Hypertrophy</option>
                    <option value="Lose Weight">Lose Weight / Fat Loss</option>
                    <option value="Improve Fitness">Improve Fitness & Mobility</option>
                    <option value="Personal Training">1-on-1 Personal Training</option>
                  </select>
                </div>
              </div>

              {/* Exact CTA Requested by Prompt: BOOK MY FREE TRIAL */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-book-my-free-trial"
                className="w-full mt-2 py-4 rounded-xl bg-[#D4AF37] text-black font-display font-black text-sm uppercase tracking-wider hover:bg-[#C5A028] transition-all duration-200 btn-primary-glow flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <span>BOOK MY FREE TRIAL</span>
                )}
              </button>

              <p className="text-[11px] text-center text-[#64748B]">
                Your request will be registered and verified by our Brookefield front desk.
              </p>
            </form>
          </div>
        ) : (
          /* Polished Confirmation State Required by Prompt */
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Enquiry ID: {confirmedLead.id}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                Your free trial request has been received.
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm mx-auto">
                Our team will contact you to confirm the appointment.
              </p>
            </div>

            {/* Selected Booking Details Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">Selected Date:</span>
                <span className="text-white font-bold">{confirmedLead.preferredDate}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">Selected Time:</span>
                <span className="text-white font-bold">{confirmedLead.preferredTime}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">Fitness Goal:</span>
                <span className="text-[#D4AF37] font-bold">{confirmedLead.fitnessGoal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white font-medium">{BRAND.addressShort}</span>
              </div>
            </div>

            {/* What Happens Next Section */}
            <div className="p-4 rounded-2xl bg-[#090A0D] border border-white/10 text-left max-w-md mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                What happens next:
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <a
                href={`https://wa.me/918970000122?text=Hi%20Xing%20Fitness,%20I%20just%20submitted%20my%20Free%20Trial%20Request%20(${confirmedLead.id})%20for%20${encodeURIComponent(confirmedLead.preferredDate || 'soon')}%20(${encodeURIComponent(confirmedLead.name)}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Front Desk</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl bg-white/10 text-gray-200 hover:text-white hover:bg-white/15 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
