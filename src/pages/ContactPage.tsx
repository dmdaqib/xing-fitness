import React, { useState } from 'react';
import { LocationSection } from '../components/home/LocationSection';
import { SectionHeading } from '../components/common/SectionHeading';
import { Mail, Phone, MessageCircle, Send, CheckCircle, Info } from 'lucide-react';
import { BRAND } from '../data/brand';
import { leadService } from '../services/leadService';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leadService.submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        type: formData.subject === 'Membership Inquiry' ? 'Membership' : 'General Question',
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Direct Concierge"
          title="CONNECT WITH XING FITNESS"
          subtitle="Speak with our front desk team, schedule a facility walkthrough, or enquire about custom corporate memberships."
        />

        {/* Quick Contact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-[#121620] border border-white/10 hover:border-[#25D366]/40 transition-all text-center flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-white group-hover:text-[#25D366] transition-colors">
              WhatsApp Direct
            </h4>
            <p className="text-xs text-[#8F9CAE] mt-1">Instant trial & fee inquiries</p>
          </a>

          <a
            href={BRAND.phoneRaw}
            className="p-6 rounded-3xl bg-[#121620] border border-white/10 hover:border-[#D4AF37]/40 transition-all text-center flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors">
              Phone Desk
            </h4>
            <p className="text-xs text-[#8F9CAE] mt-1">{BRAND.phone}</p>
          </a>

          <div className="p-6 rounded-3xl bg-[#121620] border border-white/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-white">
              Official Email
            </h4>
            <p className="text-xs text-[#8F9CAE] mt-1">{BRAND.email}</p>
          </div>
        </div>

        {/* Contact Form & Facility Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto mb-20">
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#121620] border border-white/10">
            <h3 className="font-display font-black text-2xl text-white mb-2">
              SEND DIRECT MESSAGE
            </h3>
            <p className="text-xs text-[#94A3B8] mb-6">
              Fill in your details and our team in Brookefield will follow up within business hours.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    placeholder="Full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="10-digit number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="name@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#161B25] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Membership Inquiry">General Membership Enquiry</option>
                    <option value="Personal Training Package">Personal Training Assessment</option>
                    <option value="Corporate Wellness Partnership">Corporate Partnership</option>
                    <option value="Facility Tour Booking">Facility Walkthrough</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
                    placeholder="How can we help your fitness journey?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            ) : (
              <div className="py-8 space-y-5 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black text-2xl text-white">YOUR ENQUIRY HAS BEEN RECEIVED</h4>
                  <p className="text-xs text-[#8F9CAE] mt-1">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Our front desk concierge in Brookefield will review your request.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Contact Phone:</span>
                    <span className="text-white font-mono">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Enquiry Topic:</span>
                    <span className="text-[#D4AF37] font-semibold">{formData.subject}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#090A0D] border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    What happens next:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">1.</span>
                      <span>Our concierge team reviews your specific enquiry details.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">2.</span>
                      <span>You will receive a call or WhatsApp message within business hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">3.</span>
                      <span>You can visit our Brookefield gym floor for an in-person facility tour.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-gray-500 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                  <span>
                    Architecture Note: This message is stored as a prospective lead in browser session storage awaiting connection to our live CRM backend.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', subject: 'General Question', message: '' });
                  }}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Submit Another Message
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-[#121620] border border-white/10 space-y-4">
              <h4 className="font-display font-bold text-xl text-white">Facility Coordinates</h4>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {BRAND.address}
              </p>
              <div className="text-xs text-gray-300 space-y-1.5 pt-2 border-t border-white/5">
                <div className="font-semibold text-white">Hours:</div>
                <div>{BRAND.timings.weekdays}</div>
                <div>{BRAND.timings.sunday}</div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#121620] border border-white/10 space-y-3">
              <h4 className="font-display font-bold text-lg text-white">Parking & Transit</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {BRAND.locationDetails.parking}
              </p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {BRAND.locationDetails.metroTransit}
              </p>
            </div>
          </div>
        </div>

        {/* Location Map Section */}
        <LocationSection />
      </div>
    </div>
  );
};
