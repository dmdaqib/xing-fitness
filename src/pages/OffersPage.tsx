import React, { useEffect } from 'react';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { VERIFIED_OFFERS } from '../data/offers';
import { BRAND } from '../data/brand';

interface OffersPageProps {
  onOpenTrialModal: (goal?: string) => void;
  onOpenEnquiryModal: (plan?: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  onOpenEnquiryModal
}) => {
  // Set page document title and scroll to top on mount
  useEffect(() => {
    document.title = 'Offers & Promotions — Xing Fitness Brookefield';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-[#090A0D] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple & Clean Header */}
        <header className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Limited Time Promotions
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            OFFERS
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#94A3B8] font-normal leading-relaxed">
            Exclusive club promotions and verified membership packages at Xing Fitness Brookefield.
          </p>
        </header>

        {/* 4 Official Offer Cards Grid (Desktop: 2-column | Mobile: 1-column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {VERIFIED_OFFERS.map((offer) => (
            <article
              key={offer.id}
              className="rounded-3xl bg-[#12151D] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 shadow-xl p-5 sm:p-7 flex flex-col justify-between group"
            >
              {/* Actual Poster Image — Preserves original 1:1 aspect ratio & crisp artwork */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/80 border border-white/5 mb-5 shadow-inner flex items-center justify-center">
                <img
                  src={offer.posterImage}
                  alt={offer.altText}
                  loading="eager"
                  className="w-full h-full object-contain rounded-2xl select-none group-hover:scale-[1.01] transition-transform duration-300"
                />
              </div>

              {/* Offer Details & Actions */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                      {offer.title}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-display font-bold text-xs uppercase tracking-wider shrink-0">
                      {offer.badge}
                    </span>
                  </div>

                  {offer.description && (
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                      {offer.description}
                    </p>
                  )}
                </div>

                {/* Conversion Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenEnquiryModal(offer.enquiryValue)}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer btn-primary-glow"
                  >
                    <span>ENQUIRE NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/918970000122?text=${encodeURIComponent(offer.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={offer.callAction || `tel:${BRAND.phone}`}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Call Desk</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
