import React, { useState } from 'react';
import { Check, X, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { MEMBERSHIP_PLANS } from '../../data/memberships';

interface MembershipSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onSelectPlan }) => {
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-[#090A0D] relative overflow-hidden" id="membership-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Transparent Commitment"
            title="MEMBERSHIP TIERS"
            subtitle="Flexible access tiers tailored to your training timeline. Full access to Olympic equipment, sprint turf, and luxury amenities."
            align="left"
            className="mb-0"
          />

          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => setCompareModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-display font-bold uppercase tracking-wider text-white transition-colors"
            >
              <span>COMPARE PLANS</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>

        {/* Verified Inaugural Offer Card (From Reception Desk Flyer) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#E5C07B]/15 via-white/[0.04] to-[#D4AF37]/10 border border-[#E5C07B]/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5C07B] text-black font-black flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E5C07B]">
                  Verified Reception Announcement
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[11px] text-gray-300 font-semibold">First 50 Members Only</span>
              </div>
              <h4 className="font-display font-black text-base sm:text-lg text-white mt-0.5">
                40% OFF on Annual Gym Membership + Free Locker & Gym Kits
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPlan('Annual Membership - 40% OFF Inaugural Special')}
            className="px-5 py-2.5 rounded-full bg-[#E5C07B] hover:bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-lg cursor-pointer"
          >
            Claim 40% Off Offer
          </button>
        </div>

        {/* Pricing Notice & Enquiry vs Payment Distinction */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-10 space-y-3 text-xs text-[#8F9CAE]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="font-semibold text-white">
                MEMBERSHIP ENQUIRY vs ONLINE PAYMENT NOTICE:
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider shrink-0 bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
              Future Payment Gateway Architecture Ready
            </span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            All online selections are submitted as <strong>priority membership enquiries</strong> without simulated payment processing. Official tariffs and inaugural discounts are locked in upon front-desk onboarding or verified billing link. No charges occur on this website.
          </p>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEMBERSHIP_PLANS.filter((p) => p.tier !== 'personal-training').map((plan) => {
            const isHighlighted = plan.popular || plan.bestValue;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isHighlighted
                    ? 'glass-panel-glow border-[#D4AF37]/40 shadow-2xl -translate-y-2'
                    : 'glass-panel border-white/10 hover:border-white/20 shadow-xl'
                }`}
              >
                {/* Floating badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-display font-black uppercase tracking-widest shadow-md">
                    Most Popular Choice
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#38BDF8] text-black text-[10px] font-display font-black uppercase tracking-widest shadow-md">
                    Maximum Value
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-xl text-white">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8F9CAE] min-h-[32px] mb-6">
                    {plan.priceNote}
                  </p>

                  {/* Price Block */}
                  <div className="py-4 border-y border-white/10 mb-6">
                    <div className="font-athletic text-2xl sm:text-3xl text-white tracking-wide">
                      {plan.pricePlaceholder}
                    </div>
                    <span className="text-[11px] text-[#8F9CAE] uppercase tracking-wider">
                      {plan.periodLabel}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Included Privileges:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {plan.nonFeatures?.map((nfeat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-500 line-through">
                        <X className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                        <span>{nfeat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isHighlighted
                        ? 'bg-[#D4AF37] text-black hover:bg-[#C5A028] shadow-lg shadow-[#D4AF37]/25 btn-primary-glow'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 1-on-1 Personal Training Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#181C26] via-[#12151C] to-[#181C26] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-white">
                1-on-1 Dedicated Personal Training Packages
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                Custom block coaching designed for barbell form mastery, injury rehabilitation, and rapid body composition goals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPlan('1-on-1 Personal Training Consultation')}
            className="px-6 py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shrink-0 flex items-center gap-2"
          >
            <span>Enquire For PT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Compare Plans Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#121620] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-display font-black text-2xl text-white">COMPARE MEMBERSHIP TIERS</h3>
                <p className="text-xs text-[#94A3B8]">Complete feature breakdown across all plans</p>
              </div>
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/10 text-white font-display uppercase tracking-wider text-[11px]">
                    <th className="py-3 pr-4">Privilege</th>
                    <th className="py-3 px-3">Monthly</th>
                    <th className="py-3 px-3">Quarterly</th>
                    <th className="py-3 px-3 text-[#D4AF37]">Half-Yearly</th>
                    <th className="py-3 px-3 text-[#38BDF8]">Annual Elite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 text-white font-medium">Olympic & Cardio Access</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-white font-medium">Locker & Rain Showers</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                    <td className="py-3 px-3 text-[#D4AF37]">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-white font-medium">1-on-1 PT Induction</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3">1 Session</td>
                    <td className="py-3 px-3 text-[#D4AF37]">2 Sessions</td>
                    <td className="py-3 px-3 text-[#38BDF8]">4 Sessions</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-white font-medium">InBody Biometric Scan</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3">1x Scan</td>
                    <td className="py-3 px-3 text-[#D4AF37]">Monthly</td>
                    <td className="py-3 px-3 text-[#38BDF8]">Monthly Priority</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-white font-medium">Membership Freeze Privilege</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3">Up to 15 Days</td>
                    <td className="py-3 px-3 text-[#38BDF8]">Up to 45 Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-white font-medium">Guest Passes</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3 text-gray-500">—</td>
                    <td className="py-3 px-3 text-[#38BDF8]">2x / Quarter</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCompareModalOpen(false);
                  onSelectPlan('Plan Consultation');
                }}
                className="px-6 py-3 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028]"
              >
                Join or Enquire
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
