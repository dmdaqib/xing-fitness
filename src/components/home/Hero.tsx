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
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
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
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-[#090A0D]/75 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 vignette-overlay opacity-60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col justify-center min-h-[75vh]">
        <div className="max-w-3xl">
          {/* Eyebrow / Location Identifier */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md mb-6 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-[0.2em] text-[#D4AF37]">
              Premium Gym in AECS Layout, Brookefield, Whitefield
            </span>
          </div>

          {/* Main Brand Title */}
          <h1 className="font-display font-black text-4xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.92] mb-6 uppercase break-words">
            XING FITNESS
          </h1>

          {/* Core Mandate & Value Statement */}
          <div className="space-y-2 mb-6">
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-display font-bold tracking-tight">
              Train with purpose.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-[#D4AF37] font-display font-bold tracking-tight">
              Build strength. Build consistency.
            </p>
          </div>

          {/* Natural verified summary without overloading */}
          <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-2xl mb-8">
            Modern unisex gym featuring commercial Matrix strength & cardio machinery, certified personal trainers, and motivating group classes—conveniently located above Kanti Sweets in AECS Layout for members across Brookefield, Kundalahalli, and Whitefield.
          </p>

          {/* Conversion Actions Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
            {/* Primary CTA */}
            <button
              type="button"
              onClick={onOpenTrialModal}
              id="hero-book-a-free-trial"
              className="px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-black text-sm uppercase tracking-wider hover:bg-[#C5A028] transition-all btn-primary-glow flex items-center justify-center gap-2.5 shadow-2xl shadow-[#D4AF37]/25 cursor-pointer"
            >
              <span>BOOK A FREE TRIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary CTA: WhatsApp */}
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-whatsapp-us"
              className="px-6 py-4 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Chat with Xing Fitness on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP US</span>
            </a>

            {/* Official Instagram Action */}
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-instagram"
              className="px-5 py-4 rounded-full bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/40 text-[#E1306C] hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Follow Xing Fitness on Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>INSTAGRAM</span>
            </a>

            {/* Call Action */}
            <a
              href={BRAND.phoneRaw}
              id="hero-call-now"
              className="px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Call Xing Fitness"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>CALL NOW</span>
            </a>
          </div>

          {/* Real Facility Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Matrix Strength & Cardio</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Dumbbell className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Personal Training</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Zumba, Yoga & HIIT</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
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
