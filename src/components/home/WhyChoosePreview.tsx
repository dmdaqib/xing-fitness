import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Layers,
  Target,
  UserCheck,
  Smartphone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
  HeartPulse,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TrainingZone {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  alt: string;
}

export const WhyChoosePreview: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const zones: TrainingZone[] = [
    {
      id: 'cardio',
      name: 'Cardio Deck',
      category: 'Cardio',
      description: 'Commercial treadmills, stationary bikes, and ellipticals facing wide panoramic windows.',
      image: '/images/real/cardio/xing-fitness-cardio-zone-treadmills-md.webp',
      alt: 'Dedicated Cardio zone with commercial Matrix treadmills at Xing Fitness'
    },
    {
      id: 'strength',
      name: 'Strength Floor',
      category: 'Weight / Strength Training',
      description: 'Full dumbbell racks up to 40kg, Olympic benches, dual cable towers, and selectorized stations.',
      image: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
      alt: 'Dedicated Weight and Strength training area at Xing Fitness'
    },
    {
      id: 'studio',
      name: 'Group Studio',
      category: 'Group Classes',
      description: 'Spacious hardwood-feel studio equipped for Zumba, HIIT, Yoga, and group conditioning.',
      image: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple-md.webp',
      alt: 'Dedicated Group Classes aerobic studio at Xing Fitness'
    }
  ];

  const [activeZoneId, setActiveZoneId] = useState<string>('strength');
  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[1];

  return (
    <section
      id="why-choose"
      className="py-20 lg:py-28 bg-[#090A0D] border-t border-white/5 relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Xing Standard</span>
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            WHY CHOOSE XING FITNESS
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] mt-3 font-medium">
            &ldquo;More than a gym. A structured environment built around your goals.&rdquo;
          </p>
        </div>

        {/* 5 KEY REASONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ========================================================= */}
          {/* 1. US-IMPORTED EQUIPMENT (md:col-span-6 lg:col-span-5)   */}
          {/* ========================================================= */}
          <div className="md:col-span-6 lg:col-span-5 rounded-3xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
              <img
                src="/images/real/equipment/xing-fitness-matrix-strength-stations-md.webp"
                alt="US-imported Matrix commercial equipment at Xing Fitness"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-[#12141A]/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider">
                  <Dumbbell className="w-3 h-3" />
                  <span>US-Imported Machinery</span>
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">01.</span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                    US-IMPORTED EQUIPMENT
                  </h3>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Train on premium US-imported commercial Matrix machinery, engineered with bio-mechanically precise movement paths and heavy-duty durability.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-3 text-xs text-[#CBD5E1]">
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Matrix Selectorized Towers</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Dual Cable Crossovers</span>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. SEPARATE TRAINING ZONES (md:col-span-6 lg:col-span-7) */}
          {/* Dedicated areas for: Cardio, Weight/Strength, Group Studio */}
          {/* ========================================================= */}
          <div className="md:col-span-6 lg:col-span-7 rounded-3xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]">
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">02.</span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                      SEPARATE TRAINING ZONES
                    </h3>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xl">
                    Clearly organized, dedicated areas keep workouts fluid and eliminate floor overcrowding.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                    3 Dedicated Floors
                  </span>
                </div>
              </div>

              {/* Visual Zone Switcher / Real Gym Photographs Showcase */}
              <div className="mt-4">
                {/* Zone Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-black/50 rounded-2xl border border-white/10 mb-4">
                  {zones.map((zone) => {
                    const isSelected = zone.id === activeZoneId;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setActiveZoneId(zone.id)}
                        className={`py-2 px-2 sm:px-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black shadow-md'
                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {zone.id === 'cardio' && <HeartPulse className="w-3.5 h-3.5 shrink-0" />}
                        {zone.id === 'strength' && <Dumbbell className="w-3.5 h-3.5 shrink-0" />}
                        {zone.id === 'studio' && <Users className="w-3.5 h-3.5 shrink-0" />}
                        <span className="truncate">{zone.category}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Zone Real Photograph Display */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] sm:aspect-[21/9] bg-black/60">
                  <img
                    key={activeZone.id}
                    src={activeZone.image}
                    alt={activeZone.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                        Dedicated Space: {activeZone.category}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white">
                        {activeZone.name} &mdash; <span className="text-white/80 font-normal">{activeZone.description}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Zone Thumbnails Preview Row */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {zones.map((z) => (
                    <button
                      key={`thumb-${z.id}`}
                      type="button"
                      onClick={() => setActiveZoneId(z.id)}
                      className={`relative rounded-xl overflow-hidden aspect-[16/9] border transition-all text-left cursor-pointer group/thumb ${
                        z.id === activeZoneId
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={z.image}
                        alt={z.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute inset-0 p-1.5 sm:p-2 flex flex-col justify-end">
                        <span className="text-[10px] sm:text-xs font-bold text-white leading-tight">
                          {z.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. RESULT-ORIENTED WORKOUTS (col-span-12 sm:col-span-6 lg:col-span-4) */}
          {/* ========================================================= */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#D4AF37]">03.</span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  RESULT-ORIENTED WORKOUTS
                </h3>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Structured, goal-oriented training protocols focused on progressive overload and measurable outcomes—eliminating arbitrary routines.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Targeted movement patterns (push, pull, hinge, squat)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Continuous progressive overload tracking</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. PERSONALIZED TRAINING SUPPORT (col-span-12 sm:col-span-6 lg:col-span-4) */}
          {/* ========================================================= */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#D4AF37]">04.</span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  PERSONALIZED TRAINING SUPPORT
                </h3>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Certified trainers deliver customized workout guidance, posture screening, and biomechanical form corrections tailored to your personal goals.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Individualized goal and movement assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Hands-on lifting technique and injury prevention</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. MOBILE APP PROGRESS TRACKING (col-span-12 lg:col-span-4) */}
          {/* Connected directly to implemented /member/progress portal */}
          {/* ========================================================= */}
          <div className="md:col-span-12 lg:col-span-4 rounded-3xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                  <Activity className="w-3 h-3" />
                  <span>Member Portal Live</span>
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#D4AF37]">05.</span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                  MOBILE APP PROGRESS TRACKING
                </h3>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Log body metrics, track BMI trends, and follow your fitness progression directly on your mobile device through our integrated member portal.
              </p>

              <div className="mt-5 space-y-2 text-xs text-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Weight, BMI &amp; biometric tracking logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Goal-oriented fitness milestone history</span>
                </div>
              </div>
            </div>

            {/* Direct CTA linked to the actual progress tracking portal */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <Link
                to={isAuthenticated ? '/member/progress' : '/member/progress'}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md group-hover:shadow-[#D4AF37]/25"
              >
                <span>{isAuthenticated ? 'Open Progress Tracker' : 'Access Member Portal Tracker'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
