import React from 'react';
import { ArrowRight, MessageCircle, Phone, ShieldCheck, Dumbbell, Users, MapPin } from 'lucide-react';
import { HERO_REAL_PHOTO } from '../../data/realPhotos';
import { BRAND } from '../../data/brand';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface HeroProps {
  onOpenTrialModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTrialModal }) => {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[92vh] lg:min-h-screen flex flex-col justify-between sm:justify-center pt-16 pb-6 sm:pt-24 sm:pb-16 overflow-hidden">
      {/* Background Real Gym Floor Photograph */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet={HERO_REAL_PHOTO.src} type="image/webp" />
          <img
            src={HERO_REAL_PHOTO.srcJpg}
            alt={HERO_REAL_PHOTO.alt}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center transform scale-105 animate-in fade-in duration-700"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Balanced Dark Gradient Overlays — Photo remains visible while keeping text ultra-readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-[#090A0D]/50 to-black/35 sm:from-[#090A0D] sm:via-[#090A0D]/40 sm:to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20 sm:from-black/80 sm:via-black/40 sm:to-transparent" />
        <div className="absolute inset-0 vignette-overlay opacity-20 sm:opacity-25" />
      </div>

      {/* Hero Content — Stretched from upper to lower on mobile */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 text-left flex-1 flex flex-col justify-between sm:justify-center py-2 sm:py-0">
        {/* Upper Group: Eyebrow, Heading, Value propositions, Summary */}
        <div className="max-w-3xl pt-2 sm:pt-0">
          {/* Eyebrow / Location Identifier */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/75 border border-white/25 backdrop-blur-md mb-3 sm:mb-6 shadow-xl max-w-full">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
            <span className="font-display font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#D4AF37] truncate">
              <span className="sm:hidden">Premium Gym • AECS Layout, Whitefield</span>
              <span className="hidden sm:inline">Premium Gym in AECS Layout, Brookefield, Whitefield</span>
            </span>
          </div>

          {/* Main Brand Title */}
          <h1 className="font-display font-black text-[2.6rem] leading-[1.02] sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-2.5 sm:mb-6 uppercase break-words drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            XING FITNESS
          </h1>

          {/* Core Mandate & Value Statement */}
          <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-6">
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-display font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Train with purpose.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-[#D4AF37] font-display font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Build strength. Build consistency.
            </p>
          </div>

          {/* Natural verified summary without overloading */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-normal">
            <span className="sm:hidden">Commercial Matrix machinery, certified personal trainers & motivating group classes in AECS Layout.</span>
            <span className="hidden sm:inline">Modern unisex gym featuring commercial Matrix strength & cardio machinery, certified personal trainers, and motivating group classes—conveniently located above Kanti Sweets in AECS Layout for members across Brookefield, Kundalahalli, and Whitefield.</span>
          </p>
        </div>

        {/* Lower Group: CTAs, Quick Contact Actions & Facilities Highlights */}
        <div className="max-w-3xl mt-4 sm:mt-8 pb-2 sm:pb-0">
          {/* Conversion Actions Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-10">
            {/* Primary CTA */}
            <button
              type="button"
              onClick={onOpenTrialModal}
              id="hero-book-a-free-trial"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#D4AF37] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#C5A028] transition-all btn-primary-glow flex items-center justify-center gap-2 sm:gap-2.5 shadow-xl sm:shadow-2xl shadow-[#D4AF37]/25 cursor-pointer"
            >
              <span>BOOK A FREE TRIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Contact Actions: Sleek, refined buttons on mobile and desktop */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3.5 w-full sm:w-auto">
              {/* WhatsApp Action */}
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-us"
                className="py-2.5 px-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-full bg-black/60 sm:bg-[#25D366]/15 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:text-white font-display font-semibold sm:font-bold text-[10px] sm:text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center min-w-0"
                title="Chat with Xing Fitness on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>

              {/* Official Instagram Action */}
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-instagram"
                className="py-2.5 px-2 sm:px-5 sm:py-4 rounded-xl sm:rounded-full bg-black/60 sm:bg-[#E1306C]/15 hover:bg-[#E1306C]/20 border border-[#E1306C]/40 text-[#E1306C] hover:text-white font-display font-semibold sm:font-bold text-[10px] sm:text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center min-w-0"
                title="Follow Xing Fitness on Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Instagram</span>
              </a>

              {/* Call Action */}
              <a
                href={BRAND.phoneRaw}
                id="hero-call-now"
                className="py-2.5 px-2 sm:px-5 sm:py-4 rounded-xl sm:rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 border border-white/25 text-white font-display font-semibold sm:font-bold text-[10px] sm:text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center min-w-0"
                title="Call Xing Fitness"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="truncate sm:hidden">Call</span>
                <span className="hidden sm:inline">CALL NOW</span>
              </a>
            </div>
          </div>

          {/* Real Facility Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-6 border-t border-white/20 max-w-2xl">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-200">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Matrix Machinery</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-200">
              <Dumbbell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Personal Training</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-200">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>Zumba & Group Classes</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-200">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
              <span>AECS Layout (560037)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 opacity-60 text-white text-[10px] uppercase tracking-widest pointer-events-none">
        <span>Scroll to explore</span>
        <div className="w-4 h-7 rounded-full border border-white/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
