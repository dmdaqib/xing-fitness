export interface RealPhoto {
  id: string;
  category: 'hero' | 'reception' | 'training-floor' | 'cardio' | 'group-studio' | 'equipment' | 'interior';
  src: string;
  srcJpg: string;
  srcMd: string;
  srcThumb: string;
  title: string;
  alt: string;
  tags: ('ALL' | 'GYM' | 'STRENGTH' | 'CARDIO' | 'EQUIPMENT' | 'GROUP FITNESS' | 'INTERIOR' | 'BRANDING')[];
}

export const ALL_REAL_PHOTOS: RealPhoto[] = [
  {
    id: 'hero-main-floor',
    category: 'hero',
    src: '/images/real/hero/xing-fitness-main-training-floor-hero.webp',
    srcJpg: '/images/real/hero/xing-fitness-main-training-floor-hero.jpg',
    srcMd: '/images/real/hero/xing-fitness-main-training-floor-hero-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-main-training-floor-hero-thumb.webp',
    title: 'Main Training Floor with Matrix Equipment',
    alt: 'Wide angle view of Xing Fitness training floor in Brookefield Whitefield showing Matrix strength equipment and warm reception view',
    tags: ['ALL', 'GYM', 'STRENGTH', 'EQUIPMENT']
  },
  {
    id: 'reception-main',
    category: 'reception',
    src: '/images/real/reception/xing-fitness-reception-wood-interior.webp',
    srcJpg: '/images/real/reception/xing-fitness-reception-wood-interior.jpg',
    srcMd: '/images/real/reception/xing-fitness-reception-wood-interior-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-reception-wood-interior-thumb.webp',
    title: 'Club Reception & Warm Wood Interior',
    alt: 'Xing Fitness Club reception in Brookefield Whitefield with warm wood vertical paneling and illuminated logo',
    tags: ['ALL', 'INTERIOR', 'BRANDING']
  },
  {
    id: 'reception-detail',
    category: 'reception',
    src: '/images/real/reception/xing-fitness-reception-desk-detail.webp',
    srcJpg: '/images/real/reception/xing-fitness-reception-desk-detail.jpg',
    srcMd: '/images/real/reception/xing-fitness-reception-desk-detail-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-reception-desk-detail-thumb.webp',
    title: 'Architectural Reception Detailing',
    alt: 'Xing Fitness reception desk featuring bronze fitness sculpture and branded club material',
    tags: ['ALL', 'INTERIOR', 'BRANDING']
  },
  {
    id: 'floor-wide-view',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-training-floor-panoramic.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-training-floor-panoramic.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-training-floor-panoramic-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-training-floor-panoramic-thumb.webp',
    title: 'Panoramic Strength Training Floor',
    alt: 'Xing Fitness panoramic strength floor with ceiling acoustic panels, Matrix stations, and mirrors',
    tags: ['ALL', 'GYM', 'STRENGTH']
  },
  {
    id: 'matrix-selectorized',
    category: 'equipment',
    src: '/images/real/equipment/xing-fitness-matrix-strength-stations.webp',
    srcJpg: '/images/real/equipment/xing-fitness-matrix-strength-stations.jpg',
    srcMd: '/images/real/equipment/xing-fitness-matrix-strength-stations-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-matrix-strength-stations-thumb.webp',
    title: 'Matrix Commercial Lat Pulldown & Cable Stations',
    alt: 'Black Matrix commercial lat pulldown and cable equipment at Xing Fitness Brookefield',
    tags: ['ALL', 'EQUIPMENT', 'STRENGTH']
  },
  {
    id: 'floor-machines-cardio',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-machines-and-cardio-floor.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-machines-and-cardio-floor.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-machines-and-cardio-floor-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-machines-and-cardio-floor-thumb.webp',
    title: 'Strength Machines & Cardio Floor View',
    alt: 'Xing Fitness gym floor showcasing strength machines on the left and cardio line on the right',
    tags: ['ALL', 'GYM', 'STRENGTH', 'CARDIO']
  },
  {
    id: 'strength-area-reflection',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-strength-area-mirrors.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-strength-area-mirrors.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-strength-area-mirrors-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-strength-area-mirrors-thumb.webp',
    title: 'Strength Zone with Mirrored Reflection',
    alt: 'Commercial strength training zone at Xing Fitness with full-length mirrors and checkerboard rubber flooring',
    tags: ['ALL', 'GYM', 'STRENGTH']
  },
  {
    id: 'strength-zone-depth',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-strength-equipment-depth.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-strength-equipment-depth.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-strength-equipment-depth-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-strength-equipment-depth-thumb.webp',
    title: 'Matrix Selectorized Equipment Lineup',
    alt: 'Matrix strength training stations with dark rubber tile floor at Xing Fitness Brookefield',
    tags: ['ALL', 'STRENGTH', 'EQUIPMENT']
  },
  {
    id: 'free-weights-incline',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-free-weights-dumbbell-area.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-free-weights-dumbbell-area.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-free-weights-dumbbell-area-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-free-weights-dumbbell-area-thumb.webp',
    title: 'Free Weights Arena & Dumbbell Racks',
    alt: 'Xing Fitness dumbbell area with adjustable incline benches, multi-tier dumbbell rack, and mirrors',
    tags: ['ALL', 'GYM', 'STRENGTH', 'EQUIPMENT']
  },
  {
    id: 'free-weights-floor',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-dumbbell-benches-training.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-dumbbell-benches-training.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-dumbbell-benches-training-thumb.webp',
    title: 'Dumbbell Zone & Workout Benches',
    alt: 'Spacious dumbbell zone and adjustable workout benches at Xing Fitness',
    tags: ['ALL', 'GYM', 'STRENGTH']
  },
  {
    id: 'free-weights-wide',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-free-weights-spacious-floor.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-free-weights-spacious-floor.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-free-weights-spacious-floor-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-free-weights-spacious-floor-thumb.webp',
    title: 'Conditioning & Dumbbell Free Weights Arena',
    alt: 'High-contrast training floor with full dumbbell racks and rubber flooring at Xing Fitness',
    tags: ['ALL', 'GYM', 'STRENGTH']
  },
  {
    id: 'center-floor-cables',
    category: 'training-floor',
    src: '/images/real/training-floor/xing-fitness-center-floor-dual-cables.webp',
    srcJpg: '/images/real/training-floor/xing-fitness-center-floor-dual-cables.jpg',
    srcMd: '/images/real/training-floor/xing-fitness-center-floor-dual-cables-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-center-floor-dual-cables-thumb.webp',
    title: 'Dual Cable Crossover Towers & Strength Floor',
    alt: 'Matrix dual cable crossover towers and strength stations at Xing Fitness',
    tags: ['ALL', 'GYM', 'STRENGTH', 'EQUIPMENT']
  },
  {
    id: 'cardio-treadmills-mural',
    category: 'cardio',
    src: '/images/real/cardio/xing-fitness-cardio-zone-treadmills.webp',
    srcJpg: '/images/real/cardio/xing-fitness-cardio-zone-treadmills.jpg',
    srcMd: '/images/real/cardio/xing-fitness-cardio-zone-treadmills-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-cardio-zone-treadmills-thumb.webp',
    title: 'Commercial Treadmill Suite & Motivation Wall',
    alt: 'Row of commercial treadmills with Never Give Up fitness mural at Xing Fitness Brookefield',
    tags: ['ALL', 'CARDIO', 'EQUIPMENT']
  },
  {
    id: 'cardio-treadmill-line',
    category: 'cardio',
    src: '/images/real/cardio/xing-fitness-treadmills-window-line.webp',
    srcJpg: '/images/real/cardio/xing-fitness-treadmills-window-line.jpg',
    srcMd: '/images/real/cardio/xing-fitness-treadmills-window-line-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-treadmills-window-line-thumb.webp',
    title: 'Treadmill Lineup Facing Floor View',
    alt: 'Modern cardio treadmills facing glass partition in Xing Fitness Whitefield',
    tags: ['ALL', 'CARDIO', 'EQUIPMENT']
  },
  {
    id: 'cardio-treadmill-perspective',
    category: 'cardio',
    src: '/images/real/cardio/xing-fitness-treadmills-perspective.webp',
    srcJpg: '/images/real/cardio/xing-fitness-treadmills-perspective.jpg',
    srcMd: '/images/real/cardio/xing-fitness-treadmills-perspective-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-treadmills-perspective-thumb.webp',
    title: 'Running Treadmills Deck Perspective',
    alt: 'Angled perspective of commercial running treadmills at Xing Fitness',
    tags: ['ALL', 'CARDIO']
  },
  {
    id: 'floor-action-bikes',
    category: 'hero',
    src: '/images/real/hero/xing-fitness-training-action-floor.webp',
    srcJpg: '/images/real/hero/xing-fitness-training-action-floor.jpg',
    srcMd: '/images/real/hero/xing-fitness-training-action-floor-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-training-action-floor-thumb.webp',
    title: 'Active Workout Floor & Matrix Bikes',
    alt: 'Active training floor at Xing Fitness showing Matrix bikes, strength machines, and workout benches',
    tags: ['ALL', 'GYM', 'CARDIO', 'STRENGTH']
  },
  {
    id: 'cardio-bikes-ellipticals',
    category: 'cardio',
    src: '/images/real/cardio/xing-fitness-stationary-bikes-ellipticals.webp',
    srcJpg: '/images/real/cardio/xing-fitness-stationary-bikes-ellipticals.jpg',
    srcMd: '/images/real/cardio/xing-fitness-stationary-bikes-ellipticals-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-stationary-bikes-ellipticals-thumb.webp',
    title: 'Matrix Stationary Bikes & Ellipticals Suite',
    alt: 'Matrix upright bikes and commercial ellipticals along the window line at Xing Fitness',
    tags: ['ALL', 'CARDIO', 'EQUIPMENT']
  },
  {
    id: 'cardio-suite-frontal',
    category: 'cardio',
    src: '/images/real/cardio/xing-fitness-cardio-suite-window-view.webp',
    srcJpg: '/images/real/cardio/xing-fitness-cardio-suite-window-view.jpg',
    srcMd: '/images/real/cardio/xing-fitness-cardio-suite-window-view-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-cardio-suite-window-view-thumb.webp',
    title: 'Cardio Training Suite & Club Neon Reflection',
    alt: 'Frontal view of Matrix cardio bikes and ellipticals with illuminated Xing Fitness Club signage reflection',
    tags: ['ALL', 'CARDIO', 'EQUIPMENT', 'BRANDING']
  },
  {
    id: 'neon-mural-corridor',
    category: 'interior',
    src: '/images/real/interior/xing-fitness-neon-bodybuilder-mural.webp',
    srcJpg: '/images/real/interior/xing-fitness-neon-bodybuilder-mural.jpg',
    srcMd: '/images/real/interior/xing-fitness-neon-bodybuilder-mural-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-neon-bodybuilder-mural-thumb.webp',
    title: 'Neon Athlete Fitness Mural & Corridor',
    alt: 'Vibrant neon line-art fitness mural on matte black wall in Xing Fitness corridor',
    tags: ['ALL', 'INTERIOR', 'BRANDING']
  },
  {
    id: 'studio-wood-floor-murals',
    category: 'group-studio',
    src: '/images/real/group-studio/xing-fitness-group-studio-murals-lockers.webp',
    srcJpg: '/images/real/group-studio/xing-fitness-group-studio-murals-lockers.jpg',
    srcMd: '/images/real/group-studio/xing-fitness-group-studio-murals-lockers-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-group-studio-murals-lockers-thumb.webp',
    title: 'Group Fitness Studio with Motivational Murals',
    alt: 'Wood-floored group training studio at Xing Fitness with Don’t Stop Until You Are Proud Of fitness mural',
    tags: ['ALL', 'GROUP FITNESS', 'INTERIOR']
  },
  {
    id: 'studio-purple-neon-dancer',
    category: 'group-studio',
    src: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple.webp',
    srcJpg: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple.jpg',
    srcMd: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-aerobic-dance-studio-purple-thumb.webp',
    title: 'Purple & Blue Group Fitness Dance Studio',
    alt: 'Dedicated group fitness studio with purple neon dance mural and full mirrored training stage at Xing Fitness',
    tags: ['ALL', 'GROUP FITNESS', 'INTERIOR']
  },
  {
    id: 'studio-panoramic-dual-murals',
    category: 'group-studio',
    src: '/images/real/group-studio/xing-fitness-group-fitness-studio-panoramic.webp',
    srcJpg: '/images/real/group-studio/xing-fitness-group-fitness-studio-panoramic.jpg',
    srcMd: '/images/real/group-studio/xing-fitness-group-fitness-studio-panoramic-md.webp',
    srcThumb: '/images/real/gallery/xing-fitness-group-fitness-studio-panoramic-thumb.webp',
    title: 'Panoramic View of Group Studio & Battle Ropes Mural',
    alt: 'Spacious group fitness studio with vibrant blue workout battle ropes mural and purple stage graphics at Xing Fitness',
    tags: ['ALL', 'GROUP FITNESS', 'INTERIOR']
  }
];

// Curated selections for specific sections

export const HERO_REAL_PHOTO = ALL_REAL_PHOTOS.find(p => p.id === 'hero-main-floor')!;

export const RECEPTION_PHOTOS = {
  main: ALL_REAL_PHOTOS.find(p => p.id === 'reception-main')!,
  detail: ALL_REAL_PHOTOS.find(p => p.id === 'reception-detail')!
};

export const TRAINING_FLOOR_GRID_PHOTOS = [
  ALL_REAL_PHOTOS.find(p => p.id === 'floor-wide-view')!,
  ALL_REAL_PHOTOS.find(p => p.id === 'free-weights-incline')!,
  ALL_REAL_PHOTOS.find(p => p.id === 'center-floor-cables')!,
  ALL_REAL_PHOTOS.find(p => p.id === 'floor-machines-cardio')!,
  ALL_REAL_PHOTOS.find(p => p.id === 'free-weights-floor')!,
  ALL_REAL_PHOTOS.find(p => p.id === 'strength-area-reflection')!
];

export const EQUIPMENT_SHOWCASE_PHOTOS = [
  {
    category: 'Matrix Selectorized Machines',
    description: 'Black commercial Matrix weight-stack stations engineered for isolated muscle mechanics and biomechanically guided reps.',
    photo: ALL_REAL_PHOTOS.find(p => p.id === 'matrix-selectorized')!
  },
  {
    category: 'Free Weights & Dumbbells',
    description: 'Complete multi-tier dumbbell racks paired with multi-angle commercial adjustable incline/flat benches.',
    photo: ALL_REAL_PHOTOS.find(p => p.id === 'free-weights-incline')!
  },
  {
    category: 'Dual Cable Functional Towers',
    description: 'Full-height dual pulley cable crossover systems for versatile multi-planar resistance and functional strength.',
    photo: ALL_REAL_PHOTOS.find(p => p.id === 'center-floor-cables')!
  },
  {
    category: 'Cardio Suite & Stationary Bikes',
    description: 'High-performance commercial running decks, upright stationary bikes, and ellipticals overlooking the floor.',
    photo: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-bikes-ellipticals')!
  }
];

export const CARDIO_ZONE_PHOTOS = {
  main: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-treadmills-mural')!,
  bikes: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-bikes-ellipticals')!,
  window: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-suite-frontal')!,
  perspective: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-treadmill-line')!
};

export const GROUP_STUDIO_PHOTOS = {
  hero: ALL_REAL_PHOTOS.find(p => p.id === 'studio-purple-neon-dancer')!,
  panoramic: ALL_REAL_PHOTOS.find(p => p.id === 'studio-panoramic-dual-murals')!,
  murals: ALL_REAL_PHOTOS.find(p => p.id === 'studio-wood-floor-murals')!
};

export const FINAL_CTA_PHOTO = ALL_REAL_PHOTOS.find(p => p.id === 'floor-action-bikes')!;

export const GOALS_REAL_PHOTOS = {
  strength: ALL_REAL_PHOTOS.find(p => p.id === 'free-weights-incline')!,
  cardio: ALL_REAL_PHOTOS.find(p => p.id === 'cardio-treadmills-mural')!,
  weightLoss: ALL_REAL_PHOTOS.find(p => p.id === 'floor-machines-cardio')!,
  muscleGain: ALL_REAL_PHOTOS.find(p => p.id === 'matrix-selectorized')!,
  personalTraining: ALL_REAL_PHOTOS.find(p => p.id === 'center-floor-cables')!,
  groupFitness: ALL_REAL_PHOTOS.find(p => p.id === 'studio-purple-neon-dancer')!
};
