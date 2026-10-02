import React, { useState } from 'react';
import { HeartPulse, Activity, Eye, X } from 'lucide-react';
import { CARDIO_ZONE_PHOTOS, type RealPhoto } from '../../data/realPhotos';

export const CardioZoneSection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<RealPhoto | null>(null);

  const cardioItems = [
    {
      title: 'Commercial Running Treadmills',
      description: 'Shock-absorbing wide belts engineered for interval sprints, endurance pacing, and low-impact jogging beneath our inspirational fitness mural.',
      highlight: 'Shock Absorption & Incline'
    },
    {
      title: 'Matrix Stationary Bikes',
      description: 'Upright magnetic-resistance exercise bikes designed for targeted quadricep conditioning and steady-state cardiovascular calorie burning.',
      highlight: 'Magnetic Smooth Resistance'
    },
    {
      title: 'Commercial Elliptical Cross-Trainers',
      description: 'Full-body low-impact stride mechanics that protect knee and hip joints while maintaining elevated heart rate training.',
      highlight: 'Zero Joint Impact'
    },
    {
      title: 'Cardio Interval & Aerobic Training',
      description: 'Dedicated cardio floor zoning allowing members to seamlessly transition from aerobic warm-ups to high-intensity cardiovascular intervals.',
      highlight: 'Heart Rate Conditioning'
    }
  ];

  return (
    <section id="cardio-zone" className="py-20 md:py-28 bg-[#070D14] relative overflow-hidden border-t border-b border-[#38BDF8]/10">
      {/* Cool Cyan / Azure Ambient Glow - Differentiates Cardio Zone from Strength */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0284C7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 mb-4">
            <HeartPulse className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#38BDF8]">
              Section 6 — Cardio Zone
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98] uppercase">
            ENDURANCE DECK. <br />
            <span className="text-[#38BDF8]">ELEVATE YOUR HEART RATE.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Positioned along natural floor lighting and our signature motivational mural, the Xing Fitness cardio deck features commercial running treadmills, stationary exercise bikes, and ellipticals configured for stamina and fat oxidation.
          </p>
        </div>

        {/* Real Visual Grid for Cardio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Main Treadmill Photo with "NEVER GIVE UP" mural */}
          <div
            onClick={() => setSelectedPhoto(CARDIO_ZONE_PHOTOS.main)}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden bg-[#0A121E] border border-[#38BDF8]/25 cursor-pointer shadow-2xl h-[380px] sm:h-[460px]"
          >
            <picture>
              <source srcSet={CARDIO_ZONE_PHOTOS.main.src} type="image/webp" />
              <img
                src={CARDIO_ZONE_PHOTOS.main.srcJpg}
                alt={CARDIO_ZONE_PHOTOS.main.alt}
                width={1920}
                height={1280}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

            <div className="absolute top-5 left-5">
              <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#38BDF8]/30 text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                Treadmill Suite & Motivation Wall
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  Commercial Running Decks
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-md">
                  Overlooking the training floor with motivational wall murals.
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#38BDF8]/20 backdrop-blur-md text-[#38BDF8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Dual Supporting Cardio Photos: Bikes & Ellipticals */}
          <div className="lg:col-span-5 space-y-6">
            <div
              onClick={() => setSelectedPhoto(CARDIO_ZONE_PHOTOS.bikes)}
              className="group relative rounded-3xl overflow-hidden bg-[#0A121E] border border-white/10 hover:border-[#38BDF8]/40 cursor-pointer shadow-xl h-[220px]"
            >
              <picture>
                <source srcSet={CARDIO_ZONE_PHOTOS.bikes.srcMd} type="image/webp" />
                <img
                  src={CARDIO_ZONE_PHOTOS.bikes.srcJpg}
                  alt={CARDIO_ZONE_PHOTOS.bikes.alt}
                  width={800}
                  height={533}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    Matrix Upright Bikes & Ellipticals
                  </span>
                  <h4 className="font-display font-bold text-sm text-white mt-0.5">
                    Window View Cardio Suite
                  </h4>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedPhoto(CARDIO_ZONE_PHOTOS.window)}
              className="group relative rounded-3xl overflow-hidden bg-[#0A121E] border border-white/10 hover:border-[#38BDF8]/40 cursor-pointer shadow-xl h-[220px]"
            >
              <picture>
                <source srcSet={CARDIO_ZONE_PHOTOS.window.srcMd} type="image/webp" />
                <img
                  src={CARDIO_ZONE_PHOTOS.window.srcJpg}
                  alt={CARDIO_ZONE_PHOTOS.window.alt}
                  width={800}
                  height={533}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    Illuminated Club Reflection
                  </span>
                  <h4 className="font-display font-bold text-sm text-white mt-0.5">
                    Cardio Station Perspective
                  </h4>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cardio Features Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardioItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0A121E] border border-[#38BDF8]/15 hover:border-[#38BDF8]/35 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] block mb-1">
                {item.highlight}
              </span>
              <h4 className="font-display font-bold text-base text-white">
                {item.title}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
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

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <picture>
              <source srcSet={selectedPhoto.src} type="image/webp" />
              <img
                src={selectedPhoto.srcJpg}
                alt={selectedPhoto.alt}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-[#38BDF8]/30"
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
