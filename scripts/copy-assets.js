import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/images/gym');
const subdirs = ['hero', 'facilities', 'equipment', 'trainers', 'classes', 'transformations', 'gallery', 'branding'];

subdirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const brainDir = 'C:\\Users\\dmdaq\\.gemini\\antigravity-ide\\brain\\33188fc1-ee18-4654-a176-f47db2f55388';

const mappings = [
  { src: 'xing_fitness_hero_cinematic_1790491139637.jpg', dest: 'hero/xing-fitness-hero-cinematic.jpg' },
  { src: 'xing_fitness_main_floor_1790491162511.jpg', dest: 'facilities/xing-fitness-main-floor.jpg' },
  { src: 'xing_fitness_functional_turf_1790491191697.jpg', dest: 'facilities/xing-fitness-functional-turf.jpg' },
  { src: 'xing_fitness_cardio_deck_1790491525667.jpg', dest: 'facilities/xing-fitness-cardio-area.jpg' },
  { src: 'xing_fitness_locker_lounge_1790491582717.jpg', dest: 'facilities/xing-fitness-locker-lounge.jpg' },
  { src: 'xing_fitness_free_weights_1790491556885.jpg', dest: 'equipment/xing-fitness-free-weights.jpg' },
  { src: 'xing_fitness_group_class_1790491218860.jpg', dest: 'classes/xing-fitness-group-training.jpg' },
  { src: 'xing_fitness_head_coach_1790491240659.jpg', dest: 'trainers/xing-fitness-head-coach.jpg' },
  { src: 'xing_fitness_female_coach_1790491497623.jpg', dest: 'trainers/xing-fitness-coach-2.jpg' },
  // Gallery entries
  { src: 'xing_fitness_main_floor_1790491162511.jpg', dest: 'gallery/gallery-facility-1.jpg' },
  { src: 'xing_fitness_functional_turf_1790491191697.jpg', dest: 'gallery/gallery-turf.jpg' },
  { src: 'xing_fitness_cardio_deck_1790491525667.jpg', dest: 'gallery/gallery-cardio.jpg' },
  { src: 'xing_fitness_free_weights_1790491556885.jpg', dest: 'gallery/gallery-weights.jpg' },
  { src: 'xing_fitness_group_class_1790491218860.jpg', dest: 'gallery/gallery-class.jpg' },
  { src: 'xing_fitness_locker_lounge_1790491582717.jpg', dest: 'gallery/gallery-locker.jpg' },
  { src: 'xing_fitness_hero_cinematic_1790491139637.jpg', dest: 'gallery/gallery-squat-rack.jpg' }
];

mappings.forEach(m => {
  const srcPath = path.join(brainDir, m.src);
  const destPath = path.join(baseDir, m.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${m.dest}`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
});

console.log('Asset organization complete.');
