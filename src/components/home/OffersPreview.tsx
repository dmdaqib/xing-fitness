import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { VERIFIED_OFFERS } from '../../data/offers';
import { BRAND } from '../../data/brand';

interface OffersPreviewProps {
  onOpenEnquiryModal: (plan?: string) => void;
  onOpenTrialModal?: (goal?: string) => void;
}

export const OffersPreview: React.FC<OffersPreviewProps> = ({
  onOpenEnquiryModal
}) => {
  const featuredOffer = VERIFIED_OFFERS[0]; // 30% Off Annual Membership

  return (
    <section className="py-20 bg-[#090A0D] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#14161D] via-[#1C1F2B] to-[#14161D] border-2 border-[#D4AF37]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black text-xs font-black uppercase tracking-wider shadow-md">
                  Active Verified Promotion
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5">
                  <span className="text-[#D4AF37] font-bold">{featuredOffer.discount}</span>
                  <span>Annual Plan</span>
                </span>
                <span className="text-xs text-[#94A3B8]">
                  AECS Layout, Brookefield
                </span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                {featuredOffer.title}
              </h2>

              <p className="text-xs sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl">
                {featuredOffer.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Full Matrix Equipment Access</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Clean Showers & Lockers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Floor Movement Induction</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onOpenEnquiryModal(`Claim ${featuredOffer.title}`)}
                className="w-full py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Claim This Offer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${BRAND.phone}`}
                  className="py-3 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Call Desk</span>
                </a>

                <a
                  href={`https://wa.me/918970000122?text=${encodeURIComponent(featuredOffer.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <Link
                to="/offers"
                className="text-center text-xs text-[#D4AF37] hover:underline font-semibold tracking-wider pt-1 flex items-center justify-center gap-1"
              >
                <span>View All 4 Club Offers (Couples, PT, HIIT)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
