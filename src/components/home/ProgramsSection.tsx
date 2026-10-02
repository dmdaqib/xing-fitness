import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { PROGRAMS } from '../../data/programs';

interface ProgramsSectionProps {
  onOpenTrialModal: (goal?: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onOpenTrialModal }) => {
  return (
    <section className="py-20 md:py-28 bg-[#0B0E14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Training Architectures"
            title="ENGINEERED PROGRAMS"
            subtitle="Built on biomechanics, progressive resistance, and athletic conditioning. Designed to deliver real-world adaptations."
            align="left"
            className="mb-0"
          />

          <Link
            to="/programs"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROGRAMS.map((program) => (
            <div
              key={program.id}
              className="group relative rounded-3xl overflow-hidden bg-[#121620] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              {/* Image & Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={program.image}
                  alt={program.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/40 to-transparent" />

                {/* Duration Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  <span>{program.duration}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-xl text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                    {program.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                    {program.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-6">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{program.frequency}</span>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={`/programs/${program.slug}`}
                    className="text-xs font-display font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onOpenTrialModal(program.name)}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D4AF37] text-gray-300 hover:text-black text-[11px] font-semibold transition-colors"
                  >
                    Free Trial
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
