import React from 'react';
import { FacilityShowcase } from '../components/home/FacilityShowcase';
import { SectionHeading } from '../components/common/SectionHeading';
import { FACILITY_ZONES } from '../data/facilities';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { FacilityZone } from '../types';

interface FacilitiesPageProps {
  onOpenTrialModal: () => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ onOpenTrialModal }) => {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FacilityShowcase />

        {/* Detailed Grid of All Zones */}
        <div className="mt-20 space-y-16">
          <SectionHeading
            eyebrow="Architectural Deep Dive"
            title="EXPLORE EVERY CORNER"
            subtitle="Engineered with acoustic baffling, specialized rubber flooring, and high-contrast ambient lighting for focused training."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {FACILITY_ZONES.map((zone: FacilityZone) => (
              <div
                key={zone.id}
                className="rounded-3xl bg-[#121620] border border-white/10 overflow-hidden shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      {zone.highlight}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="font-display font-black text-2xl text-white mb-2">
                    {zone.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {zone.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {zone.features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Free Trial CTA */}
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
              TOUR THE GYM IN BROOKEFIELD TODAY
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] mb-6 max-w-md mx-auto">
              Our doors are open. Experience the training floor and amenities before committing.
            </p>
            <button
              type="button"
              onClick={onOpenTrialModal}
              className="px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all btn-primary-glow inline-flex items-center gap-2"
            >
              <span>Book In-Person Facility Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
