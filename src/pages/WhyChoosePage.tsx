import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Layers,
  Target,
  UserCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Users
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BRAND } from '../data/brand';
import { useAuth } from '../context/AuthContext';

interface WhyChoosePageProps {
  onOpenTrialModal: (goal?: string) => void;
}

export const WhyChoosePage: React.FC<WhyChoosePageProps> = ({ onOpenTrialModal }) => {
  const { isAuthenticated } = useAuth();
  const [selectedZone, setSelectedZone] = useState<'cardio' | 'strength' | 'studio'>('strength');

  const zoneDetails = {
    cardio: {
      title: 'Dedicated Cardio Deck',
      desc: 'Commercial Matrix running treadmills and upright stationary bikes situated alongside large floor-to-ceiling windows with panoramic outside views.',
      image: '/images/real/cardio/xing-fitness-cardio-zone-treadmills-md.webp',
      alt: 'Cardio deck at Xing Fitness'
    },
    strength: {
      title: 'Dedicated Weight & Strength Floor',
      desc: 'Heavy Olympic flat, incline and decline benches, dual cable crossovers, full dumbbell pairs up to 40kg, and high-impact commercial rubber flooring.',
      image: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
      alt: 'Strength and free weights floor at Xing Fitness'
    },
    studio: {
      title: 'Dedicated Group Classes Studio',
      desc: 'Spacious hardwood-style studio with integrated sound, ambient lighting, and dedicated floor area for Zumba, HIIT, Yoga, and group conditioning.',
      image: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple-md.webp',
      alt: 'Group classes studio at Xing Fitness'
    }
  };

  const pillars = [
    {
      id: 'us-imported-equipment',
      number: '01',
      icon: Dumbbell,
      title: 'US-Imported Equipment',
      tagline: 'Premium US-imported Matrix machinery built for precision and safety.',
      description:
        'Our gym floor is equipped with black commercial Matrix selectorized strength stations, dual cable functional crossover towers, heavy Olympic bench stations, and matched dumbbell sets up to 40kg imported from the US. Engineered along natural biomechanical arcs, every station minimizes joint stress and maximizes muscle recruitment.',
      image: '/images/real/equipment/xing-fitness-matrix-strength-stations-md.webp',
      imageAlt: 'US-imported Matrix commercial equipment at Xing Fitness',
      highlights: [
        'Commercial Matrix selectorized weight towers engineered in the US',
        'Dual cable functional crossover stations for multi-planar strength work',
        'Full dumbbell rack with matched pairs from 2.5kg up to 40kg'
      ],
      ctaText: 'Experience In Your Free Trial',
      ctaAction: () => onOpenTrialModal('US-Imported Equipment')
    },
    {
      id: 'separate-training-zones',
      number: '02',
      icon: Layers,
      title: 'Separate Training Zones',
      tagline: 'Dedicated areas for Cardio, Weight/Strength Training, and Group Classes.',
      description:
        'Xing Fitness is deliberately segmented into dedicated training zones so members never face floor bottlenecks or overcrowding. Each discipline has its own distinct, purpose-built zone designed for focused, uninterrupted training.',
      image: zoneDetails[selectedZone].image,
      imageAlt: zoneDetails[selectedZone].alt,
      isInteractiveZones: true,
      highlights: [
        'Dedicated Cardio Zone: Commercial treadmills and stationary bikes',
        'Dedicated Weight / Strength Zone: Free weights, racks & selectorized towers',
        'Dedicated Group Studio: Private floor for HIIT, Zumba, and Yoga'
      ],
      ctaText: 'Tour The Training Zones',
      ctaAction: () => onOpenTrialModal('Separate Training Zones')
    },
    {
      id: 'result-oriented-workouts',
      number: '03',
      icon: Target,
      title: 'Result-Oriented Workouts',
      tagline: 'Structured progression replaces random daily exercise.',
      description:
        'We reject arbitrary workouts that lead to fatigue without progress. Our training methodologies are built around fundamental human movement patterns—squat, hinge, push, pull, and carry—with progressive overload protocols designed to deliver tangible, measurable results week after week.',
      image: '/images/real/training-floor/xing-fitness-training-floor-panoramic-md.webp',
      imageAlt: 'Panoramic view of result-oriented training floor at Xing Fitness',
      highlights: [
        'Systematic periodization based on core movement mechanics',
        'Structured progressive resistance models for strength and body composition',
        'Objective training continuity built around individual member targets'
      ],
      ctaText: 'Start Goal-Oriented Training',
      ctaAction: () => onOpenTrialModal('Result-Oriented Workouts')
    },
    {
      id: 'personalized-training-support',
      number: '04',
      icon: UserCheck,
      title: 'Personalized Training Support',
      tagline: 'Customized workout guidance aligned with your personal fitness targets.',
      description:
        'Whether you are refining compound barbell paths or establishing your first gym routine, our coaches provide proactive technique cues, posture screening, and customized workout guidance tailored to your specific goals and physical capacity.',
      image: '/images/real/training-floor/xing-fitness-center-floor-dual-cables-md.webp',
      imageAlt: 'Coaches and personalized training floor at Xing Fitness',
      highlights: [
        'Individualized movement screening upon membership induction',
        'Attentive coaching on exercise execution, tempo, and joint safety',
        'Customized workout guidance aligned with your schedule and goals'
      ],
      ctaText: 'Get Personalized Guidance',
      ctaAction: () => onOpenTrialModal('Personalized Training Support')
    },
    {
      id: 'mobile-app-progress-tracking',
      number: '05',
      icon: Smartphone,
      title: 'Mobile App Progress Tracking',
      tagline: 'Track your fitness journey and progress anytime on your mobile device.',
      description:
        'Members stay on track through our integrated member portal. Log body biometrics, track weight and BMI changes, and review your workout history on your phone—giving you clear, accessible accountability throughout your journey.',
      image: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
      imageAlt: 'Member progress tracking and training floor at Xing Fitness',
      isAppProgress: true,
      highlights: [
        'Body weight, height, and calculated BMI progress logging',
        'Goal setting and milestone progression tracking',
        'Mobile-responsive member portal accessible on any smartphone'
      ],
      ctaText: isAuthenticated ? 'Open Progress Tracker' : 'Access Member Portal Tracker',
      ctaLink: '/member/progress'
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#090A0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeading
          eyebrow="The Xing Standard"
          title="WHY CHOOSE XING FITNESS"
          subtitle="&ldquo;More than a gym. A structured environment built around your goals.&rdquo;"
        />

        {/* Quick Highlights Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold">Equipment</div>
              <div className="font-display font-bold text-sm text-white">US-Imported Matrix</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold">Layout</div>
              <div className="font-display font-bold text-sm text-white">3 Dedicated Zones</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold">Tracking</div>
              <div className="font-display font-bold text-sm text-white">Member Portal App</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold">Free Trial</div>
              <div className="font-display font-bold text-sm text-white">1-Day Guest Pass</div>
            </div>
          </div>
        </div>

        {/* 5 Key Reasons Deep Dive */}
        <div className="space-y-16 lg:space-y-24">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual Showcase */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 group shadow-2xl shadow-black/80 bg-black/60">
                    <img
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                      <span className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Xing Fitness Feature</span>
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">Brookefield, Bengaluru</span>
                    </div>
                  </div>

                  {/* Interactive Zone Switcher specifically for Separate Training Zones */}
                  {pillar.isInteractiveZones && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedZone('cardio')}
                        className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                          selectedZone === 'cardio'
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
                        }`}
                      >
                        <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                        <span>Cardio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedZone('strength')}
                        className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                          selectedZone === 'strength'
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
                        }`}
                      >
                        <Dumbbell className="w-3.5 h-3.5 shrink-0" />
                        <span>Strength</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedZone('studio')}
                        className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                          selectedZone === 'studio'
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>Classes</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pillar.number} • {pillar.title}</span>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
                    {pillar.tagline}
                  </h3>

                  <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {pillar.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {pillar.ctaLink ? (
                    <Link
                      to={pillar.ctaLink}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20"
                    >
                      <span>{pillar.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={pillar.ctaAction}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                    >
                      <span>{pillar.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-black via-[#14161D] to-black border border-[#D4AF37]/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
            Experience It For Yourself
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-4">
            STEP ONTO OUR TRAINING FLOOR TODAY
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Experience the Xing Fitness difference in person. Claim your complimentary 1-Day Trial Pass and train with US-imported equipment across dedicated training zones.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenTrialModal('Why Choose Xing CTA')}
              className="px-8 py-4 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Book Your Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full bg-white/5 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
