import React from 'react';
import { ArrowRight, Sparkles, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RECEPTION_PHOTOS } from '../../data/realPhotos';
import { BRAND } from '../../data/brand';

export const BrandIntro: React.FC = () => {
  return (
    <section id="xing-experience" className="py-20 md:py-28 bg-[#0B0E14] relative overflow-hidden">
      {/* Subtle warm glow mimicking reception lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Side: Real Reception Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group bg-[#121620]">
              <picture>
                <source srcSet={RECEPTION_PHOTOS.main.src} type="image/webp" />
                <img
                  src={RECEPTION_PHOTOS.main.srcJpg}
                  alt={RECEPTION_PHOTOS.main.alt}
                  width={1920}
                  height={1280}
                  className="w-full h-[420px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Reception Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Real Facility Entrance</span>
                  </div>
                  <div className="font-display font-bold text-base text-white mt-0.5">
                    Xing Fitness Reception & Member Lounge
                  </div>
                  <p className="text-[11px] text-gray-300">
                    4th Floor VV Arcade, above Kanti Sweets, AECS Layout
                  </p>
                </div>
              </div>
            </div>

            {/* Inset detail photo thumbnail */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#090A0D]">
              <picture>
                <source srcSet={RECEPTION_PHOTOS.detail.srcMd} type="image/webp" />
                <img
                  src={RECEPTION_PHOTOS.detail.srcJpg}
                  alt={RECEPTION_PHOTOS.detail.alt}
                  width={800}
                  height={533}
                  className="w-full h-28 object-cover"
                  loading="lazy"
                />
              </picture>
              <div className="p-2 text-center bg-black/90">
                <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-bold block">
                  Club Reception Desk
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Side: Verified Business Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Established 2020 • AECS Layout, Brookefield
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.08] uppercase">
              COMPLETE FITNESS EXPERIENCE. <br />
              <span className="text-[#D4AF37]">BUILT FOR REAL RESULTS.</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              <p>
                {BRAND.description}
              </p>
            </div>

            {/* Experience Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Commercial Matrix Lineup
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Selectorized towers, multi-tier dumbbells, and modern cardio deck.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Certified Personal Trainers
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Attentive 1-on-1 coaching, form screening, and progressive overload.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Group Fitness Studio
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Dedicated sprung-wood floor studio for Zumba, Yoga, and HIIT.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Convenient Location
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Above Kanti Sweets in AECS Layout, with on-site parking.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
              >
                <span>ABOUT XING FITNESS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/why-xing"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>WHY CHOOSE US</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
