import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { VERIFIED_OFFERS, type VerifiedOffer } from '../../data/offers';
import { BRAND } from '../../data/brand';

interface OfferPopupProps {
  onOpenEnquiry: (offerValue: string) => void;
}

const OFFER_PERKS: Record<string, string[]> = {
  'offer-annual-30': [
    '365 Days Unrestricted Gym Floor Access',
    'US-Imported Matrix Commercial Strength & Cardio',
    'Complimentary Biomechanical Assessment & Workout Induction',
    'Premium Lockers & Hot Shower Amenities Included'
  ],
  'offer-couples-40': [
    '2 Annual Memberships at Maximum Partner Discount',
    'Full Access to Free Weights, Cables & Functional Zone',
    'Access to Group Fitness Classes (HIIT, Yoga, Zumba)',
    'Dedicated Lockers & Luxury Amenities for Both Members'
  ],
  'offer-pt-20': [
    'Dedicated 1-on-1 Certified Personal Trainer',
    'Custom Periodized Routine & Strict Movement Form Correction',
    'Nutrition & Body Composition Progress Tracking',
    'Flexible Personalised Session Scheduling'
  ],
  'offer-hiit-1999': [
    '12 High-Energy Studio HIIT & Conditioning Sessions',
    'Targeted Cardiovascular Stamina & Fat-Loss Protocols',
    'Coach-Guided Group Floor Dynamics',
    'Special Trial Package — Limited Availability'
  ]
};

export const OfferPopup: React.FC<OfferPopupProps> = ({ onOpenEnquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // 1. Clear any suppression flags
    try {
      const keysToClean = [
        'xing_offer_popup_dismissed',
        'xing_offer_dismissed',
        'offer_popup_shown',
        'xing_offer_popup_dismissed_session',
        'offer_dismissed',
        'hasSeenOffer',
        'offerShown'
      ];
      keysToClean.forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch {
      // Ignored
    }

    // 2. Global developer/tester helpers
    if (typeof window !== 'undefined') {
      (window as any).__showOfferPopup = () => setIsOpen(true);
      (window as any).__resetOfferPopup = () => setIsOpen(true);

      const handleCustomOpen = () => setIsOpen(true);
      window.addEventListener('open-offer-popup', handleCustomOpen);

      // Auto-trigger offer popup on website visit after short 700ms delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('open-offer-popup', handleCustomOpen);
      };
    }
  }, []);

  // Keyboard accessibility (Escape key closes) & Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      } else if (e.key === 'ArrowLeft' && isOpen) {
        setActiveIndex((prev) => (prev === 0 ? VERIFIED_OFFERS.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && isOpen) {
        setActiveIndex((prev) => (prev === VERIFIED_OFFERS.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const handleEnquire = () => {
    const selected = VERIFIED_OFFERS[activeIndex];
    handleDismiss();
    onOpenEnquiry(selected.enquiryValue);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? VERIFIED_OFFERS.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === VERIFIED_OFFERS.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) {
    return null;
  }

  const currentOffer: VerifiedOffer = VERIFIED_OFFERS[activeIndex];
  const perks = OFFER_PERKS[currentOffer.id] || [
    'US-Imported Matrix Commercial Strength & Cardio Deck',
    'Free Trainer Induction & Fitness Assessment',
    'Dedicated Lockers & Shower Access Included',
    'Valid at Xing Fitness Brookefield / AECS Layout'
  ];

  const modalContent = (
    <div
      id="xing-offer-popup-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Xing Fitness Exclusive Offers"
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.88)'
      }}
    >
      <div
        id="xing-offer-popup-card"
        className="relative w-full max-w-5xl bg-[#0D1017] border-2 border-[#D4AF37]/50 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-hidden flex flex-col md:flex-row transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 80px rgba(0,0,0,0.95), 0 0 50px rgba(212, 175, 55, 0.18)'
        }}
      >
        {/* Floating Close Button (always accessible) */}
        <button
          type="button"
          onClick={handleDismiss}
          id="offer-popup-close-btn"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] transition-all duration-200 cursor-pointer shadow-xl group"
          aria-label="Close offer popup"
        >
          <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
        </button>

        {/* LEFT COLUMN: Large High-Resolution Creative Showcase */}
        <div className="w-full md:w-1/2 bg-[#08090D] p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-white/10 relative shrink-0">
          {/* Eyebrow in left col */}
          <div className="w-full flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Club Promotion</span>
            </span>
            <span className="text-xs font-semibold text-[#8F9CAE]">
              Offer {activeIndex + 1} of {VERIFIED_OFFERS.length}
            </span>
          </div>

          {/* Large Creative Frame with subtle vignette & responsive height */}
          <div className="relative w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden bg-black/90 border border-white/15 shadow-2xl flex items-center justify-center group my-auto">
            <img
              key={currentOffer.id}
              src={currentOffer.posterImage}
              alt={currentOffer.altText}
              className="w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-[1.02]"
              loading="eager"
            />

            {/* Left/Right Carousel Controls */}
            <button
              type="button"
              onClick={handlePrev}
              id="offer-popup-prev-btn"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-xl opacity-90 hover:opacity-100"
              aria-label="Previous offer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              id="offer-popup-next-btn"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-xl opacity-90 hover:opacity-100"
              aria-label="Next offer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Floating Discount Tag */}
            <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black uppercase tracking-wider">
              {currentOffer.badge}
            </div>
          </div>

          {/* Carousel Thumbnail Dots / Preview Switcher */}
          <div className="flex items-center justify-center gap-2 mt-3 w-full">
            {VERIFIED_OFFERS.map((off, idx) => (
              <button
                key={off.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 bg-[#D4AF37]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to offer ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Offer Details, Perks, Selector & Action Buttons */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#131722] via-[#0E121B] to-[#0A0D14]">
          <div>
            {/* Urgency Callout */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Limited Availability • Exclusive Club Privilege</span>
            </div>

            {/* Offer Title */}
            <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-tight">
              {currentOffer.title}
            </h2>

            {/* Subtitle / Description */}
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
              {currentOffer.description}
            </p>

            {/* Key Perks / Package Inclusions */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
                What’s Included:
              </span>
              <ul className="space-y-1.5">
                {perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Offer Selector Chips */}
            <div className="mt-5 pt-3 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8F9CAE] block mb-2">
                Browse All 4 Club Offers:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {VERIFIED_OFFERS.map((off, idx) => {
                  const isSelected = idx === activeIndex;
                  return (
                    <button
                      key={off.id}
                      type="button"
                      id={`offer-chip-${idx}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold text-center transition-all truncate border cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/25 font-black'
                          : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                      title={off.title}
                    >
                      {off.badge}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-5 mt-4 border-t border-white/10 shrink-0">
            {/* Primary Action Button: ENQUIRE NOW */}
            <button
              type="button"
              onClick={handleEnquire}
              id="offer-popup-enquire-now-btn"
              className="w-full py-3.5 sm:py-4 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer btn-primary-glow hover:scale-[1.01]"
            >
              <span>CLAIM THIS OFFER NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={`https://wa.me/918970000122?text=${encodeURIComponent(currentOffer.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={currentOffer.callAction || `tel:${BRAND.phone}`}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Club Desk</span>
              </a>
            </div>

            {/* Trust Assurance Bar */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8F9CAE] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Valid at Xing Fitness AECS Layout, Brookefield • Instant Slot Confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mount directly to document.body via createPortal
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};
