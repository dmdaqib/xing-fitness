import React from 'react';
import { ArrowRight, Award, Shield } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { TRAINERS } from '../data/trainers';
import type { Trainer } from '../types';

interface TrainersPageProps {
  onOpenEnquiryModal: (plan?: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ onOpenEnquiryModal }) => {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Coaching Excellence"
          title="CERTIFIED COACHING ROSTER"
          subtitle="True biomechanics, periodized strength programming, and dedicated 1-on-1 mentorship at Xing Fitness Brookefield."
        />

        {/* Content Rule Notice */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-12 max-w-2xl mx-auto text-center flex items-center justify-center gap-2.5 text-xs text-[#8F9CAE]">
          <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>
            Notice: Trainer profiles adhere strictly to owner verification parameters. Placeholders will be populated with full verified trainer names upon launch.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {TRAINERS.map((trainer: Trainer) => (
            <div
              key={trainer.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between shadow-2xl group"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.role}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    {trainer.role}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] uppercase font-bold text-gray-300 tracking-wider mb-1">
                    Coach Profile
                  </div>
                  <h3 className="font-display font-black text-2xl text-white">
                    {trainer.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {trainer.bio}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                        Specializations:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {trainer.specialization.map((spec: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-200"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                        Coaching Experience:
                      </span>
                      <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-[#D4AF37] font-semibold">
                        {trainer.experience}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                        Credentials & Certifications:
                      </span>
                      <div className="space-y-1.5">
                        {trainer.certifications.map((cert: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#8F9CAE]">
                            <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onOpenEnquiryModal(`Personal Training Consultation - ${trainer.role}`)}
                    className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    <span>BOOK TRAINER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
