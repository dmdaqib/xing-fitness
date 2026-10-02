import type { Program } from '../types';

export interface GroupClassItem {
  id: string;
  name: string;
  category: string;
  description: string;
  suitableFor: string;
  schedule: string;
  intensity: 'Moderate' | 'High' | 'All Levels';
  features: string[];
  image: string;
  ctaText: string;
}

export interface OutcomePackageItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  targetOutcome: string;
  description: string;
  suitableFor: string;
  trainingFocus: string[];
  equipmentEmphasized: string[];
  duration: string;
  frequency: string;
  image: string;
  accent: string;
  ctaText: string;
}

// -------------------------------------------------------------
// CATEGORY A: GROUP CLASSES (Verified Offerings)
// -------------------------------------------------------------
export const GROUP_CLASSES_DATA: GroupClassItem[] = [
  {
    id: 'cls-hiit',
    name: 'HIIT (High-Intensity Interval Training)',
    category: 'High-Tempo Conditioning',
    description: 'Interval-based functional conditioning rounds blending sprint turf drills, bodyweight agility, and cardiovascular intervals to build stamina and burn calories.',
    suitableFor: 'Members looking to boost endurance, burn fat, and train in an energetic team atmosphere.',
    schedule: 'Schedule / availability — Contact Xing Fitness',
    intensity: 'High',
    features: [
      'Heart-rate elevating interval blocks',
      'Turf drills and functional conditioning tools',
      'Scalable movement modifications for all fitness levels'
    ],
    image: '/images/real/training-floor/xing-fitness-center-floor-dual-cables-md.webp',
    ctaText: 'Enquire for HIIT Class'
  },
  {
    id: 'cls-crossfit',
    name: 'CrossFit',
    category: 'Athletic Conditioning & Strength',
    description: 'High-intensity functional movements combining resistance training, metabolic conditioning, and athletic power for comprehensive physical preparedness.',
    suitableFor: 'Individuals aiming to build athletic work capacity, functional strength, and physical resilience.',
    schedule: 'Schedule / availability — Contact Xing Fitness',
    intensity: 'High',
    features: [
      'Multi-joint functional compound movements',
      'Dynamic conditioning rounds',
      'Focused form and technique guidance by coaches'
    ],
    image: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
    ctaText: 'Enquire for CrossFit'
  },
  {
    id: 'cls-zumba',
    name: 'Zumba',
    category: 'Dance Fitness',
    description: 'Rhythmic, high-energy dance cardio set to upbeat tempos inside our dedicated group studio featuring sprung shock-absorbing wooden flooring and ambient lighting.',
    suitableFor: 'Anyone who loves music-driven workouts, dance choreography, and fun cardiovascular calorie burning.',
    schedule: 'Schedule / availability — Contact Xing Fitness',
    intensity: 'All Levels',
    features: [
      'Shock-absorbing sprung wooden flooring protecting joints',
      'Atmospheric color lighting and vibrant studio sound system',
      'High-energy, mood-boosting choreography'
    ],
    image: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple-md.webp',
    ctaText: 'Enquire for Zumba'
  },
  {
    id: 'cls-yoga',
    name: 'Yoga',
    category: 'Mobility & Recovery',
    description: 'Decompress spinal tension, improve flexibility, and balance intense strength sessions with focused breathwork and progressive mobility sequencing.',
    suitableFor: 'Working professionals with posture stiffness, and lifters needing active recovery and hip/shoulder range of motion.',
    schedule: 'Schedule / availability — Contact Xing Fitness',
    intensity: 'Moderate',
    features: [
      'Postural realignment and joint decompression',
      'Mindful breathwork to reduce daily stress',
      'Full body flexibility and core balance holds'
    ],
    image: '/images/real/group-studio/xing-fitness-group-studio-murals-lockers-md.webp',
    ctaText: 'Enquire for Yoga'
  },
  {
    id: 'cls-functional',
    name: 'Functional Training',
    category: 'Movement Longevity',
    description: 'Multi-planar exercise utilizing Matrix dual cable towers, bodyweight patterns, and core stabilization to build real-world strength that translates outside the gym.',
    suitableFor: 'Members seeking injury prevention, better balance, rotational strength, and healthy movement mechanics.',
    schedule: 'Schedule / availability — Contact Xing Fitness',
    intensity: 'Moderate',
    features: [
      'Dual adjustable pulley and multi-angle resistance',
      'Core stabilization and postural reinforcement',
      'Movement mechanics for everyday joint longevity'
    ],
    image: '/images/real/training-floor/xing-fitness-training-floor-panoramic-md.webp',
    ctaText: 'Enquire for Functional'
  },
  {
    id: 'cls-group-fitness',
    name: 'Group Fitness Classes',
    category: 'Studio Fitness',
    description: 'Dynamic group workouts bringing members together with motivating coach-led instruction, diverse workout routines, and supportive community camaraderie.',
    suitableFor: 'All fitness enthusiasts who thrive on group accountability and structured class variety.',
    schedule: 'Schedule / availability — Contact Xing Fitness',
    intensity: 'All Levels',
    features: [
      'Dedicated group fitness studio environment',
      'Diverse conditioning and toning formats',
      'Supportive, encouraging community vibe'
    ],
    image: '/images/real/group-studio/xing-fitness-group-fitness-studio-panoramic-md.webp',
    ctaText: 'Enquire for Group Classes'
  }
];

// -------------------------------------------------------------
// CATEGORY C: OUTCOME-BASED PACKAGES (Configurable Outcomes)
// Note: These represent customizable fitness outcome roadmaps.
// Exact pricing, sessions, and package terms are configured with gym staff.
// -------------------------------------------------------------
export const OUTCOME_PACKAGES_DATA: OutcomePackageItem[] = [
  {
    id: 'pkg-strength',
    name: 'Strength Training',
    slug: 'strength-training',
    tagline: 'Progressive resistance, biomechanical machine guidance, and barbell mastery.',
    targetOutcome: 'Muscle Strength, Bone Density & Movement Mastery',
    description: 'Systematic resistance training built around fundamental movements using commercial Matrix selectorized machines, dual cable functional towers, and Olympic free weights.',
    suitableFor: 'Beginners learning proper lifting form, and lifters aiming for steady, measurable strength progression.',
    trainingFocus: [
      'Biomechanical alignment on commercial Matrix selectorized machines',
      'Progressive overload tracking across compound and isolated movements',
      'Attentive floor coaching to ensure injury-free execution'
    ],
    equipmentEmphasized: [
      'Black Matrix selectorized pin-loaded stations',
      'Olympic flat & incline benches with heavy dumbbells',
      'Dual cable functional crossover stations'
    ],
    duration: 'Configurable Goal Roadmaps',
    frequency: '3–5 Sessions / Week Recommended',
    image: '/images/real/equipment/xing-fitness-matrix-strength-stations-md.webp',
    accent: '#D4AF37',
    ctaText: 'Inquire for Strength Training'
  },
  {
    id: 'pkg-weight-loss',
    name: 'Weight Loss Programs',
    slug: 'weight-loss',
    tagline: 'Metabolic resistance circuits paired with commercial cardio conditioning.',
    targetOutcome: 'Body Fat Reduction, Metabolic Stamina & Healthy Habits',
    description: 'Cardiovascular conditioning on modern treadmills and bikes combined with resistance training to maximize calorie expenditure and preserve lean muscle tone.',
    suitableFor: 'Individuals aiming to drop body fat, improve cardio vitals, and establish sustainable active lifestyle habits.',
    trainingFocus: [
      'Elevated heart rate intervals combining cardio deck and light resistance',
      'Consistency coaching and healthy lifestyle guidance',
      'Customized workout support adapted to your current endurance level'
    ],
    equipmentEmphasized: [
      'Commercial running treadmills with continuous airflow',
      'Upright stationary bikes and ellipticals',
      'Circuit kettlebells, dumbbells, and cable stations'
    ],
    duration: 'Configurable Goal Roadmaps',
    frequency: '3–5 Sessions / Week Recommended',
    image: '/images/real/cardio/xing-fitness-cardio-zone-treadmills-md.webp',
    accent: '#D4AF37',
    ctaText: 'Inquire for Weight Loss'
  },
  {
    id: 'pkg-personal-training',
    name: 'Personal Training',
    slug: 'personal-training',
    tagline: 'Dedicated 1-on-1 coaching, form screening, and individualized periodization.',
    targetOutcome: 'Customized Goals, Technique Correction & Maximum Accountability',
    description: 'Private 1-on-1 personal training with certified coaches. Every workout session, movement cue, and milestone is calibrated to your physical profile and goals.',
    suitableFor: 'Beginners requiring comprehensive floor induction, busy professionals wanting maximum efficiency, and members with specific milestone targets.',
    trainingFocus: [
      'Comprehensive movement screening and posture assessment',
      'Bespoke workout architecture and progression roadmap',
      'Real-time form correction on every repetition on the floor'
    ],
    equipmentEmphasized: [
      'Full facility access across all Matrix equipment & free weights',
      'Dual cable towers and functional conditioning deck',
      'Dedicated coaching floor guidance'
    ],
    duration: 'Configurable Coaching Blocks',
    frequency: '2–4 Dedicated Sessions / Week',
    image: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
    accent: '#D4AF37',
    ctaText: 'Book PT Consultation'
  },
  {
    id: 'pkg-general-fitness',
    name: 'General Fitness',
    slug: 'general-fitness',
    tagline: 'Balanced stamina, joint mobility, and everyday energy for life.',
    targetOutcome: 'Everyday Vitality, Posture Relief & Healthy Longevity',
    description: 'Balanced full-body conditioning designed to counteract desk fatigue, improve mobility, reinforce posture, and keep you energetic throughout the work week.',
    suitableFor: 'Working professionals in AECS Layout, Brookefield, and Whitefield seeking balanced physical stamina and health without extreme burnout.',
    trainingFocus: [
      'Total-body functional resistance and core stability',
      'Spinal posture correction and mobility drills',
      'Sustainable moderate-intensity cardio routines'
    ],
    equipmentEmphasized: [
      'Dual adjustable cable stations & functional attachments',
      'Commercial cardio bikes and smooth running treadmills',
      'Full dumbbell racks and selectorized towers'
    ],
    duration: 'Ongoing Healthy Lifestyle',
    frequency: '3 Sessions / Week Recommended',
    image: '/images/real/training-floor/xing-fitness-center-floor-dual-cables-md.webp',
    accent: '#D4AF37',
    ctaText: 'Inquire for General Fitness'
  }
];

// Preserved for legacy components / route references
export const PROGRAMS: Program[] = OUTCOME_PACKAGES_DATA.map(pkg => ({
  id: pkg.id,
  slug: pkg.slug,
  name: pkg.name,
  tagline: pkg.tagline,
  description: pkg.description,
  category: pkg.slug === 'strength-training' ? 'strength' : pkg.slug === 'weight-loss' ? 'fat-loss' : pkg.slug === 'personal-training' ? 'coaching' : 'functional',
  targetAudience: pkg.suitableFor,
  duration: pkg.duration,
  frequency: pkg.frequency,
  features: pkg.trainingFocus,
  image: pkg.image,
  accent: pkg.accent
}));
