import React, { useState, useEffect } from 'react';
import { X, ArrowRight, MessageCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { VERIFIED_OFFERS, type VerifiedOffer } from '../../data/offers';

interface OfferPopupProps {
  onOpenEnquiry: (offerValue: string) => void;
}

const STORAGE_KEY = 'xing_offer_popup_dismissed';

export const OfferPopup: React.FC<OfferPopupProps> = ({ onOpenEnquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Check if dismissed in this browsing session
    const isDismissed = sessionStorage.getItem(STORAGE_KEY);
    if (isDismissed) return;

    // Tasteful short delay (3.5s) so visitor can first view the page
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard accessibility (Escape key closes) & Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
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

  if (!isOpen) return null;

  const currentOffer: VerifiedOffer = VERIFIED_OFFERS[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Xing Fitness Exclusive Offers"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-lg bg-[#121620] border-2 border-[#D4AF37]/50 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[94vh] overflow-y-auto flex flex-col justify-between animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer"
          aria-label="Close offer popup"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Eyebrow */}
        <div className="flex items-center gap-2 mb-3 pr-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Official Club Promotion</span>
          </span>
          <span className="text-[10px] sm:text-xs text-[#8F9CAE]">
            {activeIndex + 1} of {VERIFIED_OFFERS.length} Offers
          </span>
        </div>

        {/* Real Poster Creative Showcase with Prev/Next Controls */}
        <div className="relative rounded-2xl overflow-hidden bg-black/70 border border-white/10 aspect-square max-h-[38vh] sm:max-h-none w-full mb-3 flex items-center justify-center shadow-inner group">
          <img
            key={currentOffer.id}
            src={currentOffer.posterImage}
            alt={currentOffer.altText}
            className="w-full h-full object-contain p-1 rounded-2xl select-none"
            loading="eager"
          />

          {/* Carousel Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white border border-white/15 flex items-center justify-center cursor-pointer transition-all hover:scale-110 opacity-80 hover:opacity-100"
            aria-label="Previous offer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white border border-white/15 flex items-center justify-center cursor-pointer transition-all hover:scale-110 opacity-80 hover:opacity-100"
            aria-label="Next offer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Offer Selection Chips */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {VERIFIED_OFFERS.map((off, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={off.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold text-center transition-all truncate border cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md shadow-[#D4AF37]/20'
                    : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white hover:bg-white/10'
                }`}
                title={off.title}
              >
                {off.badge}
              </button>
            );
          })}
        </div>

        {/* Offer Details */}
        <div className="mb-4">
          <h3 className="font-display font-black text-base sm:text-lg text-white leading-tight">
            {currentOffer.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-1 leading-snug">
            Available at Xing Fitness AECS Layout, Brookefield. Claim your slot or discuss details with our front desk.
          </p>
        </div>

        {/* Conversion Action Buttons */}
        <div className="space-y-2">
          {/* Primary CTA: ENQUIRE NOW */}
          <button
            type="button"
            onClick={handleEnquire}
            id="offer-popup-enquire-now-btn"
            className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 cursor-pointer btn-primary-glow"
          >
            <span>ENQUIRE NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/918970000122?text=${encodeURIComponent(currentOffer.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] hover:text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Desk</span>
            </a>

            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8F9CAE] hover:text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
