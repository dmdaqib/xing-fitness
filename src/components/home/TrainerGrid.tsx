import React from 'react';
import { ArrowRight, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../common/SectionHeading';
import { TRAINERS } from '../../data/trainers';

interface TrainerGridProps {
  onBookSession: (trainerRole: string) => void;
}

export const TrainerGrid: React.FC<TrainerGridProps> = ({ onBookSession }) => {
  return (
    <section className="py-20 md:py-28 bg-[#090A0D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Certified Coaching Staff"
          title="ELITE TRAINERS & COACHES"
          subtitle="True biomechanics, periodized strength programming, and unwavering accountability. Dedicated to helping you master the weights."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-2xl group"
            >
              {/* Image & Role Header */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.role}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/30 to-transparent" />

                {/* Role Pill */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    {trainer.role}
                  </span>
                </div>

                {/* Placeholder Notice */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[9px] uppercase tracking-wider text-gray-300 border border-white/10 mb-1">
                    <Shield className="w-3 h-3 text-[#D4AF37]" />
                    <span>Roster Placeholder</span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-white">
                    {trainer.name}
                  </h3>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                    {trainer.bio}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                        Core Specializations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-300"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Coaching Experience:
                      </span>
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-[#D4AF37] font-semibold">
                        {trainer.experience}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Credentials & Certifications:
                      </span>
                      <div className="space-y-1">
                        {trainer.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-[#8F9CAE]">
                            <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to="/about#trainers"
                    className="text-xs font-display font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
                  >
                    Meet Our Coaches
                  </Link>

                  <button
                    type="button"
                    onClick={() => onBookSession(`Trainer Consultation: ${trainer.role}`)}
                    className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    <span>BOOK TRAINER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
