import React from 'react';
import { ArrowRight, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BRAND } from '../data/brand';
import { VERIFIED_OFFERS } from '../data/offers';

interface OffersPageProps {
  onOpenTrialModal: (goal?: string) => void;
  onOpenEnquiryModal: (plan?: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  onOpenTrialModal,
  onOpenEnquiryModal
}) => {
  return (
    <div className="pt-28 pb-20 bg-[#090A0D] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeading
          eyebrow="Special Promotions"
          title="CURRENT OFFERS"
          subtitle="Exclusive offers at Xing Fitness"
        />

        {/* 4 Official Offer Posters Grid (Desktop: 2-column | Tablet: 2-column | Mobile: 1-column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto mb-20">
          {VERIFIED_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="rounded-3xl bg-[#14161D] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-2xl p-4 sm:p-6 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Poster Image Container — Preserves Original Aspect Ratio & High Quality */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/60 border border-white/5 mb-5 shadow-inner">
                <img
                  src={offer.posterImage}
                  alt={offer.altText}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500 rounded-2xl"
                />
              </div>

              {/* Offer Details & CTA Footer */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                      Official Xing Fitness Offer
                    </span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                      {offer.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-display font-bold text-xs uppercase tracking-wider shrink-0">
                    {offer.badge}
                  </span>
                </div>

                {/* Primary CTA: ENQUIRE NOW */}
                <button
                  type="button"
                  onClick={() => onOpenEnquiryModal(offer.enquiryValue)}
                  className="w-full py-4 rounded-xl bg-[#D4AF37] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer btn-primary-glow"
                >
                  <span>ENQUIRE NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Quick Contact Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:+918970000122"
                    className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Call Desk</span>
                  </a>

                  <a
                    href={`https://wa.me/918970000122?text=${encodeURIComponent(offer.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free Trial Conversion Bottom Card */}
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#14161D] border border-white/10 text-center relative overflow-hidden shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-2">
            Experience Xing Fitness First Hand
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-3">
            LOOKING TO EXPLORE BEFORE COMMITTING?
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto mb-6">
            Visit our 4th Floor VV Arcade facility in AECS Layout, Brookefield. Test our commercial Matrix machinery, experience our group studio, and speak with our coaching desk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenTrialModal('Free Trial from Offers Page')}
              className="px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
            >
              Book Complimentary 1-Day Trial
            </button>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
