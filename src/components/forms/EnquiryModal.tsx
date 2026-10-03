import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Mail, Phone, User, MessageSquare, AlertCircle, Info } from 'lucide-react';
import { leadService, type EnquiryType, type LeadEnquiry } from '../../services/leadService';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultPlan
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: defaultPlan || 'Membership Pricing',
    message: ''
  });

  useEffect(() => {
    if (defaultPlan) {
      setFormData((prev) => ({ ...prev, interest: defaultPlan }));
    }
  }, [defaultPlan, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedLead, setConfirmedLead] = useState<LeadEnquiry | null>(null);

  if (!isOpen) return null;

  const determineEnquiryType = (interest: string): EnquiryType => {
    if (interest.toLowerCase().includes('personal training') || interest.toLowerCase().includes('coach')) {
      return 'Personal Training';
    }
    if (interest.toLowerCase().includes('class')) {
      return 'Class';
    }
    if (interest.toLowerCase().includes('question') || interest.toLowerCase().includes('support')) {
      return 'General Question';
    }
    return 'Membership';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const eType = determineEnquiryType(formData.interest);
      const res = await leadService.submitEnquiry({
        name: formData.name,
        phone: cleanPhone,
        email: formData.email,
        type: eType,
        targetPlanOrClass: formData.interest,
        message: formData.message || `Enquiry for ${formData.interest}`
      });

      setConfirmedLead(res.lead);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error sending enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedLead(null);
    setErrorMsg(null);
    onClose();
  };

  const nextSteps = confirmedLead ? leadService.getNextSteps(confirmedLead.type) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#121620] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedLead ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Xing Fitness Concierge
              </span>
              <h3 id="enquiry-modal-title" className="font-display font-black text-2xl text-white mt-1">
                MEMBERSHIP & PLAN ENQUIRY
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Request verified rates, current promotional terms, or private coaching guidance.
              </p>
            </div>

            {/* Clear Payment vs Enquiry Notice Required by P2 Section 9 */}
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2 text-[11px] text-[#8F9CAE]">
              <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                <strong>Notice:</strong> This is a verified enquiry request. Online payments are currently in setup; submitting here locks in your consultation and introductory offer without charging your card.
              </span>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Enquiry Subject
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  {/* Verified Current Offers */}
                  <optgroup label="Current Verified Offers">
                    <option value="30% OFF Annual Membership">30% OFF Annual Membership</option>
                    <option value="Up to 40% OFF Couples Annual Membership">Up to 40% OFF Couples Annual Membership</option>
                    <option value="Up to 40% OFF Annual Membership — Couples Offer">Up to 40% OFF Annual Membership — Couples Offer</option>
                    <option value="20% OFF Personal Training">20% OFF Personal Training</option>
                    <option value="12 HIIT Sessions for ₹1,999">12 HIIT Sessions for ₹1,999</option>
                    <option value="₹1,999 — Body Workouts & HIIT Classes — 12 Sessions">₹1,999 — Body Workouts & HIIT Classes — 12 Sessions</option>
                  </optgroup>

                  {/* Standard Memberships & Coaching */}
                  <optgroup label="Memberships & Coaching">
                    <option value="Annual Membership">Annual Membership</option>
                    <option value="Half-Yearly Pass">Half-Yearly (6 Months)</option>
                    <option value="Quarterly Plan">Quarterly (3 Months)</option>
                    <option value="Monthly Plan">Monthly Access</option>
                    <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                    <option value="Group Classes & Timetable">Group Studio Classes</option>
                    <option value="General Question">General Question / Support</option>
                  </optgroup>

                  {/* Dynamic fallback if custom plan passed */}
                  {![
                    '30% OFF Annual Membership',
                    'Up to 40% OFF Couples Annual Membership',
                    '20% OFF Personal Training',
                    '12 HIIT Sessions for ₹1,999',
                    'Annual Membership',
                    'Half-Yearly Pass',
                    'Quarterly Plan',
                    'Monthly Plan',
                    '1-on-1 Personal Training',
                    'Group Classes & Timetable',
                    'General Question'
                  ].includes(formData.interest) && (
                    <option value={formData.interest}>{formData.interest}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Message / Goal Details
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your fitness background, timing preference, or questions..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Request...' : 'SUBMIT MEMBERSHIP ENQUIRY'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Reference ID: {confirmedLead.id}
              </span>
              <h4 className="font-display font-black text-2xl text-white">
                Your enquiry has been received.
              </h4>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Thank you, <span className="text-white font-semibold">{confirmedLead.name}</span>. Our membership desk will contact you via mobile/WhatsApp regarding <span className="text-white">{confirmedLead.targetPlanOrClass}</span>.
              </p>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-2xl bg-[#090A0D] border border-white/10 text-left max-w-md mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                What happens next:
              </span>
              <ul className="space-y-1 text-xs text-gray-300">
                {nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition-colors cursor-pointer"
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
