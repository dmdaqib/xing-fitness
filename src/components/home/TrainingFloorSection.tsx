import React, { useState } from 'react';
import { Eye, Shield, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TRAINING_FLOOR_GRID_PHOTOS, type RealPhoto } from '../../data/realPhotos';

export const TrainingFloorSection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<RealPhoto | null>(null);

  const photos = TRAINING_FLOOR_GRID_PHOTOS;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  return (
    <section id="training-floor" className="py-20 md:py-28 bg-[#090A0D] relative overflow-hidden">
      {/* Decorative dark background gradient */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-white/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Section 3 — The Training Floor
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98] uppercase">
            THE REAL TRAINING FLOOR. <br />
            <span className="text-gray-400">BUILT FOR SERIOUS PROGRESSION.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Step inside the actual workout arena of Xing Fitness, Brookefield. Featuring black Matrix selectorized machines, commercial dumbbell racks, adjustable workout benches, full-height technique mirrors, and high-impact rubber flooring.
          </p>
        </div>

        {/* Cinematic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Panoramic Feature (Span 8) */}
          <div
            onClick={() => setSelectedPhoto(photos[0])}
            className="md:col-span-8 group relative rounded-3xl overflow-hidden bg-[#121620] border border-white/15 cursor-pointer shadow-2xl h-[380px] sm:h-[460px] md:h-[500px]"
          >
            <picture>
              <source srcSet={photos[0].src} type="image/webp" />
              <img
                src={photos[0].srcJpg}
                alt={photos[0].alt}
                width={1920}
                height={1080}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute top-5 left-5">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Panoramic Strength Arena
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {photos[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                  {photos[0].alt}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Dumbbells & Free Weights (Span 4) */}
          <div
            onClick={() => setSelectedPhoto(photos[1])}
            className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-[#121620] border border-white/15 cursor-pointer shadow-2xl h-[380px] sm:h-[460px] md:h-[500px]"
          >
            <picture>
              <source srcSet={photos[1].src} type="image/webp" />
              <img
                src={photos[1].srcJpg}
                alt={photos[1].alt}
                width={1920}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute top-5 left-5">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-wider">
                Free Weights & Dumbbells
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  {photos[1].title}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Adjustable benches & complete dumbbell pairs
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Dual Cable Towers (Span 4) */}
          <div
            onClick={() => setSelectedPhoto(photos[2])}
            className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-[#121620] border border-white/15 cursor-pointer shadow-xl h-[300px] sm:h-[340px]"
          >
            <picture>
              <source srcSet={photos[2].src} type="image/webp" />
              <img
                src={photos[2].srcJpg}
                alt={photos[2].alt}
                width={1920}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Center Floor
                </span>
                <h4 className="font-display font-bold text-base text-white mt-0.5">
                  {photos[2].title}
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Machine Line & Cardio Split (Span 4) */}
          <div
            onClick={() => setSelectedPhoto(photos[3])}
            className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-[#121620] border border-white/15 cursor-pointer shadow-xl h-[300px] sm:h-[340px]"
          >
            <picture>
              <source srcSet={photos[3].src} type="image/webp" />
              <img
                src={photos[3].srcJpg}
                alt={photos[3].alt}
                width={1920}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Dual Zone Overview
                </span>
                <h4 className="font-display font-bold text-base text-white mt-0.5">
                  {photos[3].title}
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Technique Mirrors & Rubber Floor (Span 4) */}
          <div
            onClick={() => setSelectedPhoto(photos[5])}
            className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-[#121620] border border-white/15 cursor-pointer shadow-xl h-[300px] sm:h-[340px]"
          >
            <picture>
              <source srcSet={photos[5].src} type="image/webp" />
              <img
                src={photos[5].srcJpg}
                alt={photos[5].alt}
                width={1920}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Mirrors & Rubber Floor
                </span>
                <h4 className="font-display font-bold text-base text-white mt-0.5">
                  {photos[5].title}
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Floor Highlights Bar */}
        <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Matrix Stations</div>
              <div className="text-[11px] text-gray-400">Biomechanic stacks</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Multi-tier Dumbbells</div>
              <div className="text-[11px] text-gray-400">Full weight pairs</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Adjustable Benches</div>
              <div className="text-[11px] text-gray-400">Flat, incline, decline</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Full-Length Mirrors</div>
              <div className="text-[11px] text-gray-400">Posture & form check</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Floor Photos */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <picture>
              <source srcSet={selectedPhoto.src} type="image/webp" />
              <img
                src={selectedPhoto.srcJpg}
                alt={selectedPhoto.alt}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/15"
              />
            </picture>
            <div className="mt-4 text-center max-w-xl">
              <h4 className="font-display font-bold text-lg text-white">
                {selectedPhoto.title}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                {selectedPhoto.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
