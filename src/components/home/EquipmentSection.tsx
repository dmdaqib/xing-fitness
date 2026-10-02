import React, { useState } from 'react';
import { ShieldCheck, Eye, X } from 'lucide-react';
import { ALL_REAL_PHOTOS, type RealPhoto } from '../../data/realPhotos';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  photo: RealPhoto;
  description: string;
  specifications: string[];
}

export const EquipmentSection: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<RealPhoto | null>(null);

  const equipmentList: EquipmentItem[] = [
    {
      id: 'matrix-machines',
      name: 'Black Matrix Selectorized Machines',
      category: 'Strength Stations',
      photo: ALL_REAL_PHOTOS.find(p => p.id === 'matrix-selectorized')!,
      description: 'Commercial black Matrix pin-selected weight stack machines engineered with smooth cable tracking, ergonomic biomechanics, and targeted muscle activation.',
      specifications: ['Pin-selected weight stacks', 'Independent divergent arms', 'Ergonomic contour pads']
    },
    {
      id: 'dumbbells-arena',
      name: 'Commercial Multi-Tier Dumbbells',
      category: 'Free Weights',
      photo: ALL_REAL_PHOTOS.find(p => p.id === 'free-weights-incline')!,
      description: 'Expansive multi-tier commercial dumbbell racks with matched weight pairs suitable for progressive overload from warmups to heavy compound presses.',
      specifications: ['Knurled steel grips', 'Heavy-duty angled racks', 'Matched dumbbell pairs']
    },
    {
      id: 'workout-benches',
      name: 'Adjustable Commercial Benches',
      category: 'Free Weights Support',
      photo: ALL_REAL_PHOTOS.find(p => p.id === 'free-weights-floor')!,
      description: 'Commercial adjustable incline, flat, and decline benches with heavy-duty steel baseframes and high-density vinyl cushioning.',
      specifications: ['Multi-angle backrest tilt', 'Stable wide-gauge steel frames', 'Firm high-density padding']
    },
    {
      id: 'cable-machines',
      name: 'Dual Cable Functional Towers',
      category: 'Cable Systems',
      photo: ALL_REAL_PHOTOS.find(p => p.id === 'center-floor-cables')!,
      description: 'Matrix dual cable crossover towers with multi-position adjustable pulleys, dual weight stacks, and integrated multi-grip chin-up handles.',
      specifications: ['Multi-position pulley heights', 'Dual independent weight stacks', 'Multi-grip pull-up handles']
    },
    {
      id: 'cardio-equipment',
      name: 'Cardio Suite (Treadmills & Bikes)',
      category: 'Cardio Training',
      photo: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-bikes-ellipticals')!,
      description: 'Matrix stationary upright bikes, commercial treadmills, and low-impact ellipticals stationed along the expansive floor windows.',
      specifications: ['Matrix commercial upright bikes', 'Shock-absorbing treadmills', 'Low-impact ellipticals']
    }
  ];

  return (
    <section id="equipment" className="py-20 md:py-28 bg-[#090A0D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Section 5 — Equipment
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98] uppercase">
            AUTHENTIC COMMERCIAL ARSENAL. <br />
            <span className="text-[#D4AF37]">ZERO COMPROMISES.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Every piece of equipment on our floor is chosen for bio-mechanical precision, safety, and durability. Here is the actual equipment photographed on our training floor—no mockups, no stock gear.
          </p>
        </div>

        {/* 5 Real Equipment Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-3xl overflow-hidden bg-[#121620] border border-white/10 hover:border-white/25 transition-all duration-300 shadow-xl flex flex-col justify-between ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Photo Area */}
              <div
                onClick={() => setActivePhoto(item.photo)}
                className={`group relative overflow-hidden bg-black cursor-pointer ${
                  idx === 0 ? 'h-[280px] sm:h-[340px]' : 'h-[240px]'
                }`}
              >
                <picture>
                  <source srcSet={item.photo.srcMd} type="image/webp" />
                  <img
                    src={item.photo.srcJpg}
                    alt={item.photo.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-xl text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {item.specifications.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium"
                    >
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <picture>
              <source srcSet={activePhoto.src} type="image/webp" />
              <img
                src={activePhoto.srcJpg}
                alt={activePhoto.alt}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/15"
              />
            </picture>
            <div className="mt-4 text-center max-w-xl">
              <h4 className="font-display font-bold text-lg text-white">
                {activePhoto.title}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                {activePhoto.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
