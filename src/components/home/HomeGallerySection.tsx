import React from 'react';
import { Camera } from 'lucide-react';
import { GalleryLightbox } from '../gallery/GalleryLightbox';

export const HomeGallerySection: React.FC = () => {
  return (
    <section id="gallery-section" className="py-20 md:py-28 bg-[#0B0E14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Section 10 — Facility Gallery
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98] uppercase">
            REAL PHOTOGRAPHY. <br />
            <span className="text-[#D4AF37]">EXPLORE EVERY ZONE.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Every photograph is an authentic snapshot of our real training facility in Brookefield, Whitefield. Use the filters below to explore our strength equipment, free weights arena, cardio deck, and dedicated group fitness studio.
          </p>
        </div>

        {/* Filterable Gallery with Lightbox */}
        <GalleryLightbox />
      </div>
    </section>
  );
};
