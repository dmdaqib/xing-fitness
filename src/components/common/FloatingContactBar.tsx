import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { BRAND } from '../../data/brand';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const FloatingContactBar: React.FC = () => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      
      // Float once scrolled past top hero zone (> 120px)
      if (currentY > 120) {
        // Floating remains active, especially responsive when scrolling up
        const isScrollingUp = currentY < lastY;
        setIsFloating(isScrollingUp || currentY > 240);
      } else {
        setIsFloating(false);
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 print:hidden select-none transition-all duration-300 transform ${
        isFloating
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-12 opacity-0 pointer-events-none'
      }`}
      aria-label="Floating Quick Contact"
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#121620]/95 backdrop-blur-xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.85)]">
        {/* WhatsApp Button */}
        <a
          href={BRAND.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 flex items-center justify-center transition-all shadow-md active:scale-90"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </a>

        {/* Instagram Button */}
        <a
          href={BRAND.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E1306C]/20 hover:bg-[#E1306C] text-[#E1306C] hover:text-white border border-[#E1306C]/40 flex items-center justify-center transition-all shadow-md active:scale-90"
          title="Follow on Instagram"
          aria-label="Follow on Instagram"
        >
          <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </a>

        {/* Phone Call Button */}
        <a
          href={BRAND.phoneRaw}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 flex items-center justify-center transition-all shadow-md active:scale-90"
          title="Call Xing Fitness"
          aria-label="Call Xing Fitness"
        >
          <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </a>
      </div>
    </div>
  );
};
