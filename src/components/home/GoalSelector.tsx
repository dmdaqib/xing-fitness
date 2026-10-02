import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Flame, TrendingUp, HeartPulse, UserCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { GOALS_REAL_PHOTOS } from '../../data/realPhotos';

export interface SmartGoalOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  userGoalDisplay: string;
  recommendedProgram: string;
  programSlug: string;
  whyExplanation: string;
  imageWebp: string;
  imageJpg: string;
  accentColor: string;
  highlights: string[];
}

interface GoalSelectorProps {
  onOpenTrialModal?: (goal: string) => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({ onOpenTrialModal }) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('build-muscle');

  const goalOptions: SmartGoalOption[] = [
    {
      id: 'build-muscle',
      label: 'Build Muscle',
      icon: <TrendingUp className="w-4 h-4" />,
      userGoalDisplay: 'Muscle Gain & Hypertrophy',
      recommendedProgram: 'Strength & Hypertrophy Lab',
      programSlug: 'muscle-building',
      whyExplanation: 'Optimal hypertrophy requires mechanical tension with targeted volume. Our black Matrix selectorized weight stacks and full dumbbell array let you isolate muscle groups through complete ranges of motion with zero wasted setup time.',
      imageWebp: GOALS_REAL_PHOTOS.muscleGain.srcMd,
      imageJpg: GOALS_REAL_PHOTOS.muscleGain.srcJpg,
      accentColor: '#A78BFA',
      highlights: ['Matrix selectorized isolation stacks', 'Complete matched dumbbell pairs', 'Time-under-tension focus']
    },
    {
      id: 'lose-weight',
      label: 'Lose Weight',
      icon: <Flame className="w-4 h-4" />,
      userGoalDisplay: 'Fat Loss & Body Transformation',
      recommendedProgram: 'Fat Loss & Metabolic Conditioning',
      programSlug: 'weight-loss',
      whyExplanation: 'Effective fat loss pairs caloric expenditure with lean muscle preservation. By transitioning between our commercial running treadmills and machine resistance circuits, you maintain elevated metabolic burn while protecting your metabolic rate.',
      imageWebp: GOALS_REAL_PHOTOS.weightLoss.srcMd,
      imageJpg: GOALS_REAL_PHOTOS.weightLoss.srcJpg,
      accentColor: '#FB923C',
      highlights: ['Cardio interval sprint decks', 'Metabolic circuit stations', 'Target heart rate tracking']
    },
    {
      id: 'get-stronger',
      label: 'Get Stronger',
      icon: <Dumbbell className="w-4 h-4" />,
      userGoalDisplay: 'Raw Strength & Progressive Overload',
      recommendedProgram: 'Strength & Conditioning',
      programSlug: 'strength-training',
      whyExplanation: 'True absolute strength is built on barbell compound kinematics and systematic load increments. Our dedicated free weights floor features adjustable commercial benches, barbell stations, and full-length mirrors to dial in posture and form.',
      imageWebp: GOALS_REAL_PHOTOS.strength.srcMd,
      imageJpg: GOALS_REAL_PHOTOS.strength.srcJpg,
      accentColor: '#D4AF37',
      highlights: ['Heavy commercial barbell stations', 'Multi-angle incline/flat benches', 'Full technique mirror wall']
    },
    {
      id: 'improve-fitness',
      label: 'Improve Fitness',
      icon: <HeartPulse className="w-4 h-4" />,
      userGoalDisplay: 'General Fitness, Stamina & Longevity',
      recommendedProgram: 'Dedicated Group Studio & Functional Agility',
      programSlug: 'group-classes',
      whyExplanation: 'Overall vitality thrives on multi-planar movement, cardiovascular conditioning, and community rhythm. Our dedicated purple & blue studio features shock-absorbing sprung wooden flooring, Zumba, yoga, and aerobic conditioning.',
      imageWebp: GOALS_REAL_PHOTOS.groupFitness.srcMd,
      imageJpg: GOALS_REAL_PHOTOS.groupFitness.srcJpg,
      accentColor: '#EC4899',
      highlights: ['Sprung wooden floor absorbs joint impact', 'Zumba, dance fitness & yoga', 'High-energy audio & neon stage']
    },
    {
      id: 'personal-training',
      label: 'Personal Training',
      icon: <UserCheck className="w-4 h-4" />,
      userGoalDisplay: '1-on-1 Customized Mentorship',
      recommendedProgram: '1-on-1 Elite Personal Coaching',
      programSlug: 'personal-training',
      whyExplanation: 'If you want bespoke programming, continuous real-time biomechanical correction, and private accountability, 1-on-1 coaching fast-tracks your progression while preventing common lifting injuries.',
      imageWebp: GOALS_REAL_PHOTOS.personalTraining.srcMd,
      imageJpg: GOALS_REAL_PHOTOS.personalTraining.srcJpg,
      accentColor: '#FACC15',
      highlights: ['Movement & joint mobility audit', 'Custom periodized routines', 'Nutritional macronutrient guidance']
    }
  ];

  const activeOption = goalOptions.find((g) => g.id === selectedGoalId) || goalOptions[0];

  return (
    <section id="find-your-goal" className="py-20 md:py-28 bg-[#0B0E14] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-10 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: activeOption.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Personalized Pathway
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98] uppercase">
            WHAT'S YOUR GOAL?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Select your primary objective below to reveal the engineered training program and equipment setup best suited to your body at Xing Fitness Brookefield.
          </p>
        </div>

        {/* 5 Options Selector Bar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-10 justify-start sm:justify-start">
          {goalOptions.map((opt) => {
            const isSelected = opt.id === selectedGoalId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedGoalId(opt.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-xl shadow-white/10 scale-105 ring-2 ring-[#D4AF37]'
                    : 'bg-[#121620] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <span style={{ color: isSelected ? '#000' : opt.accentColor }}>
                  {opt.icon}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Recommendation Card Following Prompt Structure */}
        <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#121620] shadow-2xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Real Facility Photograph Side (Span 6) */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-black">
              <picture>
                <source srcSet={activeOption.imageWebp} type="image/webp" />
                <img
                  src={activeOption.imageJpg}
                  alt={`Xing Fitness training floor for ${activeOption.label}`}
                  width={800}
                  height={533}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#121620]" />

              <div className="absolute top-5 left-5">
                <span
                  className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border shadow-lg"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    color: activeOption.accentColor,
                    borderColor: `${activeOption.accentColor}40`
                  }}
                >
                  Xing Fitness Arena
                </span>
              </div>
            </div>

            {/* Recommendation Details Side Following Prompt Structure (Span 6) */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* 1. YOUR GOAL */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8F9CAE] block mb-1">
                    YOUR GOAL
                  </span>
                  <div className="font-display font-black text-xl sm:text-2xl text-white flex items-center gap-2">
                    <span style={{ color: activeOption.accentColor }}>{activeOption.icon}</span>
                    <span>{activeOption.userGoalDisplay}</span>
                  </div>
                </div>

                {/* 2. RECOMMENDED */}
                <div className="mb-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-1"
                    style={{ color: activeOption.accentColor }}
                  >
                    RECOMMENDED PROGRAM
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {activeOption.recommendedProgram}
                  </h3>
                </div>

                {/* 3. WHY */}
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8F9CAE] block mb-1.5">
                    WHY THIS FITS YOUR PHYSIOLOGY:
                  </span>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {activeOption.whyExplanation}
                  </p>
                </div>

                {/* Facility Highlights */}
                <div className="space-y-2 mb-6">
                  {activeOption.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0"
                        style={{ color: activeOption.accentColor }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. NEXT STEP CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={`/programs/${activeOption.programSlug}`}
                  id="goal-view-program-btn"
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-display font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
                >
                  <span>VIEW PROGRAM</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {onOpenTrialModal && (
                  <button
                    type="button"
                    onClick={() => onOpenTrialModal(activeOption.label)}
                    className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Book Free Trial
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
