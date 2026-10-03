import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Dumbbell,
  Info
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import {
  GROUP_CLASSES_DATA,
  OUTCOME_PACKAGES_DATA,
  type GroupClassItem,
  type OutcomePackageItem
} from '../data/programs';
import { MEMBERSHIP_PLANS } from '../data/memberships';

interface ProgramsPageProps {
  onOpenTrialModal: (goal?: string) => void;
  onOpenEnquiryModal?: (plan?: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({
  onOpenTrialModal,
  onOpenEnquiryModal = () => {}
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'classes' | 'memberships' | 'outcomes'>('all');

  return (
    <div className="pt-28 pb-20 bg-[#090A0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeading
          eyebrow="Training Architectures"
          title="XING FITNESS PROGRAMS & ACCESS"
          subtitle="Explore our three distinct training offerings: energetic instructor-led studio classes, comprehensive facility memberships, and personalized outcome-focused coaching packages."
        />

        {/* Distinct Category Clarification Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/30 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Three Distinct Ways to Train at Xing Fitness
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                <strong className="text-white">Group Classes</strong> (Studio Floor) ≠ <strong className="text-white">Memberships</strong> (Gym Access Tiers) ≠ <strong className="text-white">Outcome Packages</strong> (Bespoke Goal Coaching).
              </p>
            </div>
          </div>

          {/* Quick Filter Buttons: Responsive 2-column wrapped grid on mobile, inline row on desktop */}
          <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center md:gap-2 md:shrink-0">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              id="filter-category-all"
              className={`col-span-2 md:col-auto py-2.5 sm:py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center justify-center flex items-center cursor-pointer min-h-[42px] sm:min-h-0 ${
                activeCategory === 'all'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                  : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              All Programs
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('classes')}
              id="filter-category-classes"
              className={`col-span-1 md:col-auto py-2.5 sm:py-2 px-3 sm:px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] sm:min-h-0 ${
                activeCategory === 'classes'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                  : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Classes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('memberships')}
              id="filter-category-memberships"
              className={`col-span-1 md:col-auto py-2.5 sm:py-2 px-3 sm:px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] sm:min-h-0 ${
                activeCategory === 'memberships'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                  : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>Memberships</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('outcomes')}
              id="filter-category-outcomes"
              className={`col-span-2 md:col-auto py-2.5 sm:py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] sm:min-h-0 ${
                activeCategory === 'outcomes'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                  : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>Outcome Packages</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PILLAR A: GROUP CLASSES                                   */}
        {/* ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'classes') && (
          <section id="group-classes" className="mb-24 scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Category A</span>
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                  GROUP STUDIO CLASSES
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mt-1">
                  Conducted inside our dedicated group fitness studio featuring shock-absorbing sprung wooden flooring, ambient lighting, and certified instructor pacing.
                </p>
              </div>
              <span className="text-xs text-[#94A3B8] bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10 shrink-0">
                Sprung Wood Floor • Dedicated Sound Stage
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {GROUP_CLASSES_DATA.map((cls: GroupClassItem) => (
                <div
                  key={cls.id}
                  className="rounded-3xl bg-[#14161D] border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition-all flex flex-col group shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={cls.image}
                      alt={cls.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14161D] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-white/15">
                        {cls.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-medium border border-white/15">
                        {cls.intensity} Intensity
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
                        {cls.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                        {cls.description}
                      </p>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 mb-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                            Who It Is Suitable For:
                          </div>
                          <p className="text-xs text-gray-300 mt-0.5">
                            {cls.suitableFor}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/5 flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <div className="text-xs text-gray-400">
                            <span className="text-white font-medium">Timetable Note:</span> {cls.schedule}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {cls.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2.5 text-xs text-gray-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenTrialModal(cls.name)}
                      className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                    >
                      <span>{cls.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* PILLAR B: MEMBERSHIPS                                     */}
        {/* ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'memberships') && (
          <section id="memberships" className="mb-24 scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Category B</span>
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                  FACILITY MEMBERSHIPS
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mt-1">
                  Full facility access passes for independent lifters and athletes. Transparent tier inclusions with zero hidden maintenance charges.
                </p>
              </div>
              <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 shrink-0 font-medium">
                Active Offer: 30% Off Annual Membership & Up to 40% Off Couples Plan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MEMBERSHIP_PLANS.filter(p => p.id !== 'personal-training').map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                    plan.bestValue
                      ? 'bg-gradient-to-b from-[#1C1F2B] to-[#12141C] border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/10'
                      : 'bg-[#14161D] border border-white/10 hover:border-white/25'
                  }`}
                >
                  {plan.bestValue && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                      Most Popular & Best Value
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                      {plan.periodLabel}
                    </div>
                    <h3 className="font-display font-black text-xl text-white mb-2">
                      {plan.name}
                    </h3>
                    
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 mb-6">
                      <div className="text-[11px] text-[#94A3B8] leading-snug">
                        {plan.priceNote}
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        What Is Included:
                      </div>
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenEnquiryModal(plan.name)}
                    className={`w-full py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      plan.bestValue
                        ? 'bg-[#D4AF37] text-black hover:bg-[#C5A028] shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* PILLAR C: OUTCOME-BASED PACKAGES                          */}
        {/* ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'outcomes') && (
          <section id="outcome-packages" className="mb-16 scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Category C</span>
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                  OUTCOME-BASED PACKAGES
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mt-1">
                  Calibrated to target specific physiological outcomes. Combines structured progression roadmaps, machine biomechanics, and personalized coach guidance.
                </p>
              </div>
              <span className="inline-block text-xs text-[#94A3B8] bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10 shrink-0 max-w-full">
                Periodized Roadmaps • Objective Goal Milestones
              </span>
            </div>

            <div className="space-y-8">
              {OUTCOME_PACKAGES_DATA.map((pkg: OutcomePackageItem, pIdx) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl sm:rounded-3xl bg-[#14161D] border border-white/10 p-4 sm:p-6 md:p-10 hover:border-[#D4AF37]/40 transition-all shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
                >
                  <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                        Targeted Outcome
                      </span>
                      <div className="font-display font-bold text-sm text-white">
                        {pkg.targetOutcome}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                        <span>Package 0{pIdx + 1}</span>
                        <span>•</span>
                        <span>{pkg.duration}</span>
                        <span>•</span>
                        <span>{pkg.frequency}</span>
                      </div>

                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                        {pkg.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                        {pkg.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Training Focus:</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-gray-300">
                            {pkg.trainingFocus.map((tf, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#D4AF37]">•</span>
                                <span>{tf}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-1.5">
                            <Dumbbell className="w-3.5 h-3.5" />
                            <span>Equipment Used:</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-gray-300">
                            {pkg.equipmentEmphasized.map((eq, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#D4AF37]">•</span>
                                <span>{eq}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => onOpenTrialModal(pkg.name)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{pkg.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenEnquiryModal(pkg.name)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        Request Package Consultation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Conversion Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-black via-[#14161D] to-black border border-[#D4AF37]/30 text-center relative overflow-hidden shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
            Not Sure Which Program Fits You Best?
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-4">
            LET OUR HEAD COACHES GUIDE YOUR INDUCTION
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Book a complimentary 1-Day Trial. We will walk you through our Matrix equipment, evaluate your current movement baseline, and recommend the ideal path forward.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenTrialModal('Programs Bottom CTA')}
              className="px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center gap-2"
            >
              <span>Book 1-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenEnquiryModal('General Program Enquiry')}
              className="px-7 py-4 rounded-full bg-white/5 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Contact Coaching Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
