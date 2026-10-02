import React from 'react';
import { ArrowRight, MessageCircle, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { FINAL_CTA_PHOTO } from '../../data/realPhotos';
import { BRAND } from '../../data/brand';

interface FinalCTASectionProps {
  onOpenTrialModal: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onOpenTrialModal }) => {
  return (
    <section className="relative py-24 md:py-32 bg-[#090A0D] overflow-hidden">
      {/* Background Real Gym Photograph */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet={FINAL_CTA_PHOTO.src} type="image/webp" />
          <img
            src={FINAL_CTA_PHOTO.srcJpg}
            alt={FINAL_CTA_PHOTO.alt}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center transform scale-105"
            loading="lazy"
          />
        </picture>
        {/* Dark overlay ensuring high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-black/80 to-[#090A0D]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/50 to-[#090A0D]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md mb-6 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-display font-bold text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            AECS Layout • Brookefield • Whitefield (560037)
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-6 uppercase">
          READY TO START?
        </h2>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-display font-semibold mb-10 max-w-2xl mx-auto">
          Book your first visit to Xing Fitness.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto mb-10">
          <button
            type="button"
            onClick={onOpenTrialModal}
            id="final-cta-book-free-trial"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-black text-sm uppercase tracking-wider hover:bg-[#C5A028] transition-all btn-primary-glow flex items-center justify-center gap-2.5 shadow-2xl shadow-[#D4AF37]/30 cursor-pointer"
          >
            <span>BOOK FREE TRIAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="final-cta-whatsapp-us"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/20 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WHATSAPP US</span>
          </a>

          <a
            href={`tel:${BRAND.phone}`}
            id="final-cta-call-us"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>CALL {BRAND.phone}</span>
          </a>

          <a
            href={BRAND.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="final-cta-get-directions"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>DIRECTIONS</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Zero obligation complimentary trial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Above Kanti Sweets, AECS Layout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Mon–Sat: 5:30 AM – 10:00 PM | Sun: 11:00 AM – 8:00 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
};
