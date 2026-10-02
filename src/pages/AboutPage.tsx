import React, { useState } from 'react';
import {
  Target,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Eye,
  X,
  Shield,
  Zap,
  Award
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BRAND } from '../data/brand';
import { TRAINERS } from '../data/trainers';
import type { Trainer } from '../types';

interface AboutPageProps {
  onOpenTrialModal: (goal?: string) => void;
  onOpenEnquiryModal?: (role?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenTrialModal,
  onOpenEnquiryModal = () => {}
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Real Xing Fitness facility zones with authentic photography
  const facilityShowcase = [
    {
      title: 'Matrix Commercial Strength Zone',
      category: 'Biomechanics & Hypertrophy',
      image: '/images/real/equipment/xing-fitness-matrix-strength-stations-md.webp',
      alt: 'Black Matrix commercial lat pulldown and selectorized cable equipment at Xing Fitness Brookefield',
      description:
        'Biomechanical selectorized weight stacks and cable towers designed for optimal muscle activation and joint safety.'
    },
    {
      title: 'Free Weights & Dumbbell Arena',
      category: 'Olympic & Strength',
      image: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
      alt: 'Complete dumbbell racks and adjustable incline benches on rubber flooring at Xing Fitness',
      description:
        'Multi-tier dumbbell sets up to heavy increments, flat/incline benches, and Olympic platforms over impact-absorbing rubber.'
    },
    {
      title: 'Dual Cable Functional Towers',
      category: 'Functional & Athletic',
      image: '/images/real/training-floor/xing-fitness-center-floor-dual-cables-md.webp',
      alt: 'Matrix dual cable crossover towers and center floor functional equipment at Xing Fitness',
      description:
        'Dual adjustable pulley towers enabling 3D athletic movement patterns, rotational strength, and injury rehabilitation.'
    },
    {
      title: 'Commercial Cardio Deck',
      category: 'Endurance & Vitals',
      image: '/images/real/cardio/xing-fitness-cardio-zone-treadmills-md.webp',
      alt: 'Commercial running treadmills with Never Give Up fitness mural at Xing Fitness Brookefield',
      description:
        'High-grade commercial running treadmills, ellipticals, and upright stationary bikes with continuous airflow.'
    },
    {
      title: 'Dedicated Group Fitness Studio',
      category: 'Aerobics & Movement',
      image: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple-md.webp',
      alt: 'Group fitness studio with purple neon dance mural and sprung wooden floor at Xing Fitness',
      description:
        'Sprung shock-absorbing wooden flooring, vibrant ambient illumination, and a full mirrored instructor stage for high-tempo classes.'
    },
    {
      title: 'Club Reception & Member Lounge',
      category: 'Hospitality & Community',
      image: '/images/real/reception/xing-fitness-reception-wood-interior-md.webp',
      alt: 'Warm wood paneled reception desk with illuminated Xing Fitness logo in Brookefield',
      description:
        'Warm architectural wood paneling, seamless digital check-in, and knowledgeable front-desk staff ready to assist.'
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#090A0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* 1. ABOUT XING FITNESS HEADER & HERO BANNER               */}
        {/* ======================================================== */}
        <SectionHeading
          eyebrow="AECS Layout • Brookefield, Bengaluru • Est. 2020"
          title="ABOUT XING FITNESS"
          subtitle="A premium gym and fitness club in AECS Layout, Brookefield, Bengaluru, offering a complete fitness experience for beginners and experienced lifters."
        />

        {/* Hero Narrative Panoramic Banner */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] border border-white/10 shadow-2xl mb-16">
          <picture>
            <source
              srcSet="/images/real/training-floor/xing-fitness-training-floor-panoramic.webp"
              type="image/webp"
            />
            <img
              src="/images/real/training-floor/xing-fitness-training-floor-panoramic.jpg"
              alt="Xing Fitness panoramic strength floor with Matrix equipment in Brookefield Whitefield"
              className="w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              AECS Layout • Brookefield, Bengaluru
            </span>
            <h3 className="font-display font-black text-2xl sm:text-4xl text-white mt-1">
              BUILT FOR THOSE WHO TAKE TRAINING SERIOUSLY.
            </h3>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. XING FITNESS STORY / INTRODUCTION                     */}
        {/* ======================================================== */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-[#94A3B8] text-sm sm:text-base leading-relaxed">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Established in 2020 • AECS Layout</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                Complete Fitness Experience for Beginners & Experienced Lifters.
              </h3>

              <p>
                {BRAND.description}
              </p>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Location</div>
                  <div className="text-xs text-[#94A3B8] mt-1">Above Kanti Sweets, B Block, AECS Layout (560037)</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Equipment</div>
                  <div className="text-xs text-[#94A3B8] mt-1">Commercial Matrix Selectorized & Free Weights</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#14161D] border border-white/10 p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
                <h4 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-[#D4AF37]" />
                  <span>The Xing Standard</span>
                </h4>

                <div className="space-y-4 text-xs sm:text-sm text-[#94A3B8]">
                  <p>
                    Whether you are starting your fitness journey or training with advanced compound overload, our modern gym floor and certified coaches support your individual progression.
                  </p>
                  <p>
                    We offer strength training, weight loss programs, personal training, HIIT, CrossFit, Zumba, Yoga, functional training, and group fitness classes—all under one roof.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">Operating Hours</span>
                    <span className="text-xs text-white font-semibold mt-0.5 block">5:30 AM – 10:00 PM</span>
                    <span className="text-[10px] text-gray-400">Monday to Saturday</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">Sunday Session</span>
                    <span className="text-xs text-white font-semibold mt-0.5 block">11:00 AM – 08:00 PM</span>
                    <span className="text-[10px] text-[#D4AF37]">Recovery & Workouts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. OUR TRAINING PHILOSOPHY                               */}
        {/* ======================================================== */}
        <section className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Core Principles
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              OUR TRAINING PHILOSOPHY
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              Every equipment choice, floor specification, and coaching interaction is rooted in athletic science, biomechanical safety, and lifelong progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-[#14161D] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2">
                  Biomechanical Precision
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Machines aligned with human muscular anatomy ensure maximum mechanical tension with reduced joint shear stress across every repetition.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Form-First Execution</span>
              </div>
            </div>

            <div className="rounded-3xl bg-[#14161D] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2">
                  Honest Progression
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  No gimmick workouts or temporary shortcuts. Real physiological adaptation comes from consistent progressive overload, structured recovery, and sound nutrition.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Data-Driven Overload</span>
              </div>
            </div>

            <div className="rounded-3xl bg-[#14161D] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2">
                  Distraction-Free Floor
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  High-density acoustic rubber, generous walkway spacing, and warm atmospheric illumination eliminate floor chaos so you can focus entirely on the weights.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uninterrupted Flow</span>
              </div>
            </div>

            <div className="rounded-3xl bg-[#14161D] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2">
                  Supportive Culture
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Whether you are lifting heavy or touching a dumbbell for the first time, our community and coaching floor respect every member’s fitness commitment.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Intimidation</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. GYM ENVIRONMENT / FACILITIES (REAL PHOTOS)            */}
        {/* ======================================================== */}
        <section className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
                Real Xing Fitness Environment
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                GYM ENVIRONMENT & FACILITIES
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mt-1">
                All photographs shown are 100% authentic captures from our Brookefield, Bengaluru club—showcasing our commercial Matrix stations, spacious floor, and premium lighting.
              </p>
            </div>

            <div className="text-[11px] text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 font-semibold shrink-0">
              100% Real Facility Photos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilityShowcase.map((facility, index) => (
              <div
                key={index}
                className="rounded-3xl bg-[#14161D] border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={facility.image}
                      alt={facility.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14161D] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        {facility.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-display font-bold text-lg text-white mb-2">
                      {facility.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Xing Fitness Brookefield</span>
                    <span className="text-[#D4AF37] font-semibold">Matrix Commercial</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. MEET OUR TRAINERS                                     */}
        {/* ======================================================== */}
        <section id="trainers" className="scroll-mt-32 mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Floor Coaches & Personal Training</span>
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                MEET OUR TRAINERS
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mt-1">
                Our floor coaches ensure proper execution, progressive overload, and movement safety. Dedicated 1-on-1 personal training packages are available.
              </p>
            </div>

            <div className="text-[11px] text-[#94A3B8] bg-white/[0.04] px-4 py-2 rounded-2xl border border-white/10 shrink-0">
              Floor Guidance • 1-on-1 Personal Training
            </div>
          </div>

          {/* Transparent Placeholder Notice Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-10 flex items-start sm:items-center gap-3 text-xs text-[#8F9CAE]">
            <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="text-gray-200 font-semibold">Coach Profile Notice: </span>
              Representative placeholder photography and neutral profile fields are shown below while official coach biographies, verified credentials, and individual certifications are finalized for the upcoming season.
            </div>
          </div>

          {/* Trainer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRAINERS.map((trainer) => (
              <div
                key={trainer.id}
                className="rounded-3xl bg-[#14161D] border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Large Professional Portrait */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-black">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14161D] via-transparent to-transparent opacity-90" />
                    
                    {/* Role Placeholder Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        {trainer.role}
                      </span>
                    </div>

                    {/* Name Placeholder at Bottom of Photo */}
                    <div className="absolute bottom-4 left-6 right-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-0.5">
                        Xing Fitness Coach
                      </span>
                      <h3 className="font-display font-black text-2xl text-white">
                        {trainer.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-6">
                    {/* Short Bio Placeholder */}
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-5">
                      {trainer.bio}
                    </p>

                    {/* Specialization Placeholder */}
                    <div className="space-y-2.5 mb-6">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Specialization Placeholder:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.specialization.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-gray-300 font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Standard Verification Notice */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Coaching Standards:</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Movement form screening, CPR/AED safety, and personalized progression tracking.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 border-t border-white/5 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedTrainer(trainer)}
                      className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>View Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenEnquiryModal(`Personal Training with ${trainer.name}`)}
                      className="py-2.5 px-3 rounded-xl bg-[#D4AF37] text-black hover:bg-[#C5A028] font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
                    >
                      <span>Inquire PT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* TRAINER VIEW PROFILE MODAL INTERACTION                   */}
        {/* ======================================================== */}
        {selectedTrainer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedTrainer(null)}
          >
            <div
              className="bg-[#14161D] border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white hover:bg-black/90 transition-colors border border-white/10 cursor-pointer"
                aria-label="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Portrait Header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={selectedTrainer.image}
                  alt={selectedTrainer.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161D] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {selectedTrainer.role}
                  </span>
                  <h3 className="font-display font-black text-2xl text-white">
                    {selectedTrainer.name}
                  </h3>
                </div>
              </div>

              {/* Modal Details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Coaching Philosophy & Background:
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {selectedTrainer.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Specializations:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialization.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200 font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-[#8F9CAE] space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    Placeholder Profile Note:
                  </div>
                  <div>
                    This profile is currently a structured placeholder. Personal trainer scheduling, verified certifications, and individual bio details will be updated by Xing Fitness management.
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const trainerName = selectedTrainer.name;
                      setSelectedTrainer(null);
                      onOpenEnquiryModal(`Personal Training with ${trainerName}`);
                    }}
                    className="flex-1 py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    <span>Inquire for PT Coaching</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTrainer(null)}
                    className="py-3.5 px-6 rounded-full bg-white/5 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. LOCATION, VISITING HOURS & INQUIRY CTA                */}
        {/* ======================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14161D] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 shadow-2xl">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Convenient Location
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              VISIT US IN BROOKEFIELD, WHITEFIELD
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Located on Brookefield Main Road, near Brookefield Mall and Kundalahalli Gate. Conveniently situated for professionals working in ITPL, AECS Layout, and Whitefield.
            </p>
            <div className="space-y-2 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Mon – Sat: 5:30 AM – 10:00 PM | Sun: 7:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onOpenTrialModal('About Page Visit CTA')}
              className="w-full py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book A 1-Day Trial Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-white/5 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
