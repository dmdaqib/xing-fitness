import React, { useState } from 'react';
import { CheckCircle2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../common/SectionHeading';
import { FACILITY_ZONES } from '../../data/facilities';

export const FacilityShowcase: React.FC = () => {
  const [activeZoneId, setActiveZoneId] = useState<string>(FACILITY_ZONES[0].id);

  const activeZone = FACILITY_ZONES.find((z) => z.id === activeZoneId) || FACILITY_ZONES[0];

  return (
    <section className="py-20 md:py-28 bg-[#090A0D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Architectural Standard"
          title="IMMERSIVE FACILITY"
          subtitle="Explore the zones that set Xing Fitness Brookefield apart: from Olympic lifting platforms to sprint turf and spa-grade recovery."
        />

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {FACILITY_ZONES.map((zone) => {
            const isActive = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {zone.name}
              </button>
            );
          })}
        </div>

        {/* Editorial Showcase View */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Main Visual Column */}
            <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
              <img
                src={activeZone.image}
                alt={activeZone.name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#121620]" />

              <div className="absolute top-5 left-5">
                <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                  {activeZone.highlight}
                </span>
              </div>
            </div>

            {/* Editorial Context Column */}
            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#121620]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8F9CAE]">
                  Brookefield Facility Zone
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-1 mb-3">
                  {activeZone.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                  {activeZone.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                    Key Specifications:
                  </span>
                  {activeZone.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  to="/facilities"
                  className="text-xs font-display font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Full Facility Tour</span>
                </Link>

                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Xing Fitness Whitefield
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
