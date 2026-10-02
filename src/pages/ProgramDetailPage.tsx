import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Calendar, Target } from 'lucide-react';
import { PROGRAMS } from '../data/programs';
import type { Program } from '../types';

interface ProgramDetailPageProps {
  onOpenTrialModal: (goal?: string) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ onOpenTrialModal }) => {
  const { slug } = useParams<{ slug: string }>();

  const program = PROGRAMS.find((p: Program) => p.slug === slug) || PROGRAMS[0];

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Programs</span>
        </Link>

        {/* Hero Visual Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 shadow-2xl mb-12">
          <img
            src={program.image}
            alt={program.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
              {program.category.toUpperCase()}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white mt-3 mb-2">
              {program.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-200">
              {program.tagline}
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Cycle Duration</span>
              <span className="text-sm font-bold text-white">{program.duration}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Recommended Frequency</span>
              <span className="text-sm font-bold text-white">{program.frequency}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 text-[#F97316] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Coaching Support</span>
              <span className="text-sm font-bold text-white">Full On-Floor Guidance</span>
            </div>
          </div>
        </div>

        {/* Deep Dive Content */}
        <div className="space-y-8 mb-16">
          <div className="p-8 rounded-3xl bg-[#121620] border border-white/10 space-y-4">
            <h3 className="font-display font-black text-2xl text-white">Program Architecture</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {program.description}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-3">
                Who this program is for:
              </span>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/5">
                {program.targetAudience}
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#121620] border border-white/10 space-y-4">
            <h3 className="font-display font-black text-2xl text-white">Included Key Protocols</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.features.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Start With A Free Trial
          </span>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-white mt-2 mb-3">
            TRY {program.name.toUpperCase()} AT XING FITNESS
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto mb-6">
            Book a complimentary trial pass. A certified coach will guide you through this protocol on our Brookefield training floor.
          </p>
          <button
            type="button"
            onClick={() => onOpenTrialModal(program.name)}
            className="px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all btn-primary-glow inline-flex items-center gap-2 shadow-xl shadow-[#D4AF37]/25"
          >
            <span>Book Free Trial For This Program</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
