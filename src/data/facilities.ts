import type { FacilityZone } from '../types';

export const FACILITY_ZONES: FacilityZone[] = [
  {
    id: 'main-floor',
    name: 'Main Strength & Matrix Selectorized Floor',
    category: 'strength',
    highlight: 'Engineered for Biomechanical Precision',
    description: 'A spacious, climate-controlled arena equipped with commercial black Matrix selectorized machines, lat pulldowns, dual cable crossover towers, and heavy-duty rubber flooring.',
    features: [
      'Commercial black Matrix selectorized stations with pin-selected stacks',
      'Dual cable crossover towers with adjustable multi-plane pulleys',
      'Checkerboard high-density rubber shock-absorbing tiles',
      'Full-height technique mirrors across all lifting zones'
    ],
    image: '/images/real/training-floor/xing-fitness-training-floor-panoramic.webp'
  },
  {
    id: 'free-weights',
    name: 'Commercial Free Weights & Dumbbell Arena',
    category: 'weights',
    highlight: 'Knurled Iron & Adjustable Benches',
    description: 'Dedicated free weights arena featuring full multi-tier dumbbell pairs, multi-angle adjustable incline and flat benches, and barbell stations for progressive overload.',
    features: [
      'Complete multi-tier dumbbell racks with matched pairs',
      'Commercial adjustable incline, flat, and decline benches',
      'Barbell lifting stations with Olympic bumper loading',
      'Full wall technique mirrors for posture monitoring'
    ],
    image: '/images/real/training-floor/xing-fitness-free-weights-dumbbell-area.webp'
  },
  {
    id: 'cardio-deck',
    name: 'Commercial Cardio Suite',
    category: 'cardio',
    highlight: 'Treadmills, Bikes & Motivation Murals',
    description: 'State-of-the-art cardiovascular suite positioned beneath our signature Never Give Up mural. Equipped with commercial shock-absorbing treadmills, Matrix upright bikes, and ellipticals.',
    features: [
      'Commercial running treadmills with shock-cushioned decks',
      'Matrix upright stationary exercise bikes with smooth magnetic resistance',
      'Low-impact elliptical cross-trainers protecting knee and hip joints',
      'Floor-to-window daylight orientation and motivational wall graphics'
    ],
    image: '/images/real/cardio/xing-fitness-cardio-zone-treadmills.webp'
  },
  {
    id: 'group-studio',
    name: 'Dedicated Group Fitness & Dance Studio',
    category: 'functional',
    highlight: 'Purple Neon Murals & Sprung Wood Floor',
    description: 'A vibrant private group training studio featuring purple and electric-blue ambient lighting, custom neon dance murals, blue battle ropes wall, full mirrored stage, and sprung wooden flooring.',
    features: [
      'Shock-absorbing sprung wooden flooring designed for dance and HIIT impact',
      'Full-width mirrored instructor stage and acoustic surround sound',
      'Custom neon dancer and motivational workout murals',
      'Dedicated space for aerobics, Zumba, conditioning, and mobility'
    ],
    image: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple.webp'
  },
  {
    id: 'reception-lounge',
    name: 'Club Reception & Member Lounge',
    category: 'recovery',
    highlight: 'Warm Wood Architectural Interior',
    description: 'Warm, welcoming entrance quarters with vertical timber paneling, illuminated Xing Fitness Club signage, amber pendant lighting, and a panoramic glass view onto the training arena.',
    features: [
      'Architectural warm vertical wood slat wall design',
      'Illuminated club branding and member check-in reception',
      'Glass portal offering unobstructed views onto the workout floor',
      'Member consultation and trial induction hospitality'
    ],
    image: '/images/real/reception/xing-fitness-reception-wood-interior.webp'
  }
];
