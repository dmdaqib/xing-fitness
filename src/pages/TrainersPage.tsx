import React from 'react';
import { ArrowRight, Target } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { TRAINERS } from '../data/trainers';
import { TrainerPhotoPlaceholder } from '../components/trainers/TrainerPhotoPlaceholder';
import type { Trainer } from '../types';

interface TrainersPageProps {
  onOpenEnquiryModal: (plan?: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ onOpenEnquiryModal }) => {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Coaching Staff"
          title="MEET OUR TRAINERS"
          subtitle="True biomechanics, periodized strength guidance, and high-energy group fitness at Xing Fitness Brookefield."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TRAINERS.map((trainer: Trainer) => (
            <div
              key={trainer.id}
              className="rounded-3xl bg-[#14161D] border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <TrainerPhotoPlaceholder trainer={trainer} aspectRatio="aspect-[3/4]" />

                <div className="p-6">
                  <h3 className="font-display font-black text-2xl text-white tracking-wide uppercase">
                    {trainer.name}
                  </h3>

                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mt-1 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>{trainer.role}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {trainer.bio}
                  </p>

                  <div className="pt-4 border-t border-white/5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Training Focus:</span>
                    </div>
                    <ul className="space-y-2">
                      {trainer.trainingFocus.map((focus: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                          <span className="leading-snug">{focus}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => onOpenEnquiryModal(`Personal Training with ${trainer.name}`)}
                  className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer mt-4"
                >
                  <span>INQUIRE PT WITH {trainer.name.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

