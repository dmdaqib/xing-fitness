import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { User, Phone, Calendar, Clock, Target, CheckCircle, Sparkles, Info, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BRAND } from '../data/brand';
import { leadService } from '../services/leadService';

export const BookFreeTrialPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: 'Morning (06:00 AM - 09:00 AM)',
    goal: 'Strength Training'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leadService.submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        type: 'Free Trial',
        preferredDate: formData.date,
        preferredTime: formData.timeSlot,
        fitnessGoal: formData.goal
      });
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFFFFF', '#38BDF8']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Complimentary Experience"
          title="FREE TRIAL ENQUIRY"
          subtitle="Experience Xing Fitness in Brookefield with access to our Matrix stations, free weights floor, and certified coaches."
        />

        <div className="glass-panel-glow rounded-3xl p-6 sm:p-12 border border-white/15 shadow-2xl relative overflow-hidden">
          {!isSuccess ? (
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/20 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complimentary 1-Day Trial Enquiry</span>
                </div>
                <h3 className="font-display font-black text-2xl text-white">
                  REQUEST YOUR FREE TRIAL SESSION
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Valid for 1 full training session at Xing Fitness Brookefield upon front desk slot confirmation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 2. Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 3. Preferred Date & 4. Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Morning (06:00 AM - 09:00 AM)">Morning (6 AM – 9 AM)</option>
                        <option value="Mid-Day (10:00 AM - 01:00 PM)">Mid-Day (10 AM – 1 PM)</option>
                        <option value="Evening (05:00 PM - 08:00 PM)">Evening (5 PM – 8 PM)</option>
                        <option value="Night (08:00 PM - 10:00 PM)">Night (8 PM – 10 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. Fitness Goal */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Fitness Goal *
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Build Muscle">Build Muscle</option>
                      <option value="Lose Weight">Lose Weight</option>
                      <option value="Get Stronger">Get Stronger</option>
                      <option value="Improve Fitness">Improve Fitness</option>
                      <option value="Personal Training">Personal Training</option>
                    </select>
                  </div>
                </div>

                {/* CTA: BOOK MY FREE TRIAL */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-4 rounded-xl bg-[#D4AF37] text-black font-display font-bold text-sm uppercase tracking-wider hover:bg-[#C5A028] transition-all btn-primary-glow flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/25 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'BOOK MY FREE TRIAL'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-[#64748B] pt-1">
                  Enquiry confirmation will be communicated by our Brookefield front desk via phone/WhatsApp.
                </p>
              </form>
            </div>
          ) : (
            /* Polished Confirmation State Required by Section 7 */
            <div className="py-8 space-y-6 max-w-lg mx-auto animate-in fade-in duration-300">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto mb-3 border border-[#D4AF37]/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  YOUR ENQUIRY HAS BEEN RECEIVED.
                </h3>
                <p className="text-xs text-[#8F9CAE] mt-1">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our front desk team has received your free trial pass request.
                </p>
              </div>

              {/* Selected Enquiry Details */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Selected Date:</span>
                  <span className="text-white font-semibold">{formData.date || 'To be confirmed'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Selected Time:</span>
                  <span className="text-[#D4AF37] font-semibold">{formData.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Target Goal:</span>
                  <span className="text-white font-semibold">{formData.goal}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Phone Number:</span>
                  <span className="text-white font-mono">{formData.phone}</span>
                </div>
              </div>

              {/* What Happens Next Section */}
              <div className="p-5 rounded-2xl bg-[#090A0D] border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  What happens next:
                </span>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Our Brookefield front desk will check floor capacity for your requested slot.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>You will receive a call or WhatsApp confirmation message from our team.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Bring workout shoes and workout apparel to enjoy your complimentary workout pass.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-gray-500 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                <span>
                  Notice: This request is an enquiry for a trial pass and does not constitute a guaranteed booking until verified by desk staff.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors shadow-lg"
                >
                  <span>Connect With Desk On WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10 cursor-pointer"
                >
                  Submit Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

