import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'C:\\Users\\dmdaq\\OneDrive\\Desktop\\drive-download-20260927T074949Z-1-001';
const targetBase = path.resolve('public/images/real');

// Subdirectories for organized semantic assets
const subdirs = ['hero', 'reception', 'training-floor', 'cardio', 'group-studio', 'equipment', 'gallery', 'interior'];
subdirs.forEach(dir => {
  const p = path.join(targetBase, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Semantic mapping of the 22 real Xing Fitness photos
export const PHOTO_CATALOG = [
  {
    raw: 'Copy of HC232556.jpg',
    id: 'reception-main',
    category: 'reception',
    filename: 'xing-fitness-reception-wood-interior',
    title: 'Xing Fitness Club Reception & Entrance',
    alt: 'Xing Fitness Club reception in Brookefield Whitefield with warm wood vertical paneling and illuminated logo',
    tags: ['reception', 'interior', 'branding']
  },
  {
    raw: 'Copy of HC232560.jpg',
    id: 'reception-detail',
    category: 'reception',
    filename: 'xing-fitness-reception-desk-detail',
    title: 'Reception Desk & Architectural Detailing',
    alt: 'Xing Fitness reception desk featuring bronze fitness sculpture and branded club material',
    tags: ['reception', 'branding', 'interior']
  },
  {
    raw: 'Copy of HC232573.jpg',
    id: 'hero-main-floor',
    category: 'hero',
    filename: 'xing-fitness-main-training-floor-hero',
    title: 'Xing Fitness Main Training Floor with Matrix Equipment',
    alt: 'Wide angle view of Xing Fitness training floor in Brookefield Whitefield showing Matrix strength equipment and warm reception view',
    tags: ['hero', 'gym', 'strength', 'equipment']
  },
  {
    raw: 'Copy of HC232567.jpg',
    id: 'floor-wide-view',
    category: 'training-floor',
    filename: 'xing-fitness-training-floor-panoramic',
    title: 'Panoramic Strength Training Arena',
    alt: 'Xing Fitness panoramic strength floor with ceiling acoustic panels, Matrix stations, and mirrors',
    tags: ['gym', 'strength', 'training-floor']
  },
  {
    raw: 'Copy of HC232568.jpg',
    id: 'matrix-selectorized',
    category: 'equipment',
    filename: 'xing-fitness-matrix-strength-stations',
    title: 'Matrix Selectorized Strength & Lat Stations',
    alt: 'Black Matrix commercial lat pulldown and cable equipment at Xing Fitness',
    tags: ['equipment', 'strength']
  },
  {
    raw: 'Copy of HC232566.jpg',
    id: 'floor-machines-cardio',
    category: 'training-floor',
    filename: 'xing-fitness-machines-and-cardio-floor',
    title: 'Dual-Zone Strength & Cardio Training Floor',
    alt: 'Xing Fitness gym floor showcasing strength machines on the left and cardio line on the right',
    tags: ['gym', 'strength', 'cardio']
  },
  {
    raw: 'Copy of HC232564.jpg',
    id: 'strength-area-reflection',
    category: 'training-floor',
    filename: 'xing-fitness-strength-area-mirrors',
    title: 'Strength Zone with Mirrored Reflection',
    alt: 'Commercial strength training zone at Xing Fitness with full-length mirrors and checkerboard rubber flooring',
    tags: ['gym', 'strength']
  },
  {
    raw: 'Copy of HC232565.jpg',
    id: 'strength-zone-depth',
    category: 'training-floor',
    filename: 'xing-fitness-strength-equipment-depth',
    title: 'Matrix Selectorized Lineup',
    alt: 'Matrix strength training stations with dark rubber tile floor at Xing Fitness Brookefield',
    tags: ['strength', 'equipment']
  },
  {
    raw: 'Copy of HC232593.jpg',
    id: 'free-weights-incline',
    category: 'training-floor',
    filename: 'xing-fitness-free-weights-dumbbell-area',
    title: 'Free Weights & Dumbbell Training Area',
    alt: 'Xing Fitness dumbbell area with adjustable incline benches, multi-tier dumbbell rack, and mirrors',
    tags: ['gym', 'strength', 'equipment']
  },
  {
    raw: 'Copy of HC232596.jpg',
    id: 'free-weights-floor',
    category: 'training-floor',
    filename: 'xing-fitness-dumbbell-benches-training',
    title: 'Free Weights Floor & Workout Benches',
    alt: 'Spacious dumbbell zone and adjustable workout benches at Xing Fitness',
    tags: ['gym', 'strength']
  },
  {
    raw: 'Copy of HC232601.jpg',
    id: 'free-weights-wide',
    category: 'training-floor',
    filename: 'xing-fitness-free-weights-spacious-floor',
    title: 'Spacious Free Weights Conditioning Zone',
    alt: 'High-contrast training floor with full dumbbell racks and rubber flooring at Xing Fitness',
    tags: ['strength', 'gym']
  },
  {
    raw: 'Copy of HC232603.jpg',
    id: 'center-floor-cables',
    category: 'training-floor',
    filename: 'xing-fitness-center-floor-dual-cables',
    title: 'Center Training Floor with Dual Cable Towers',
    alt: 'Matrix dual cable crossover towers and strength stations at Xing Fitness',
    tags: ['gym', 'strength', 'equipment']
  },
  {
    raw: 'Copy of HC232570.jpg',
    id: 'cardio-treadmills-mural',
    category: 'cardio',
    filename: 'xing-fitness-cardio-zone-treadmills',
    title: 'Commercial Treadmill Suite & Motivation Wall',
    alt: 'Row of commercial treadmills with Never Give Up fitness mural at Xing Fitness Brookefield',
    tags: ['cardio', 'equipment']
  },
  {
    raw: 'Copy of HC232569.jpg',
    id: 'cardio-treadmill-line',
    category: 'cardio',
    filename: 'xing-fitness-treadmills-window-line',
    title: 'Cardio Deck Treadmill Lineup',
    alt: 'Modern cardio treadmills facing glass partition in Xing Fitness Whitefield',
    tags: ['cardio', 'equipment']
  },
  {
    raw: 'Copy of HC232572.jpg',
    id: 'cardio-treadmill-perspective',
    category: 'cardio',
    filename: 'xing-fitness-treadmills-perspective',
    title: 'Perspective View of Treadmill Training Deck',
    alt: 'Angled perspective of commercial running treadmills at Xing Fitness',
    tags: ['cardio']
  },
  {
    raw: 'Copy of HC232578.jpg',
    id: 'floor-action-bikes',
    category: 'hero',
    filename: 'xing-fitness-training-action-floor',
    title: 'Active Workout Floor & Matrix Bikes',
    alt: 'Active training floor at Xing Fitness showing Matrix bikes, strength machines, and workout benches',
    tags: ['hero', 'gym', 'cardio', 'strength']
  },
  {
    raw: 'Copy of HC232580.jpg',
    id: 'cardio-bikes-ellipticals',
    category: 'cardio',
    filename: 'xing-fitness-stationary-bikes-ellipticals',
    title: 'Matrix Stationary Bikes & Ellipticals Suite',
    alt: 'Matrix upright bikes and commercial ellipticals along the window line at Xing Fitness',
    tags: ['cardio', 'equipment']
  },
  {
    raw: 'Copy of HC232582.jpg',
    id: 'cardio-suite-frontal',
    category: 'cardio',
    filename: 'xing-fitness-cardio-suite-window-view',
    title: 'Cardio Training Suite with Club Neon Reflection',
    alt: 'Frontal view of Matrix cardio bikes and ellipticals with illuminated Xing Fitness Club signage reflection',
    tags: ['cardio', 'branding', 'equipment']
  },
  {
    raw: 'Copy of HC232576.jpg',
    id: 'neon-mural-corridor',
    category: 'interior',
    filename: 'xing-fitness-neon-bodybuilder-mural',
    title: 'Neon Athlete Fitness Mural & Corridor',
    alt: 'Vibrant neon line-art fitness mural on matte black wall in Xing Fitness corridor',
    tags: ['interior', 'branding']
  },
  {
    raw: 'Copy of HC232615.jpg',
    id: 'studio-wood-floor-murals',
    category: 'group-studio',
    filename: 'xing-fitness-group-studio-murals-lockers',
    title: 'Group Fitness Studio with Motivational Murals',
    alt: 'Wood-floored group training studio at Xing Fitness with Don’t Stop Until You Are Proud Of fitness mural',
    tags: ['group-fitness', 'interior']
  },
  {
    raw: 'Copy of HC232621.jpg',
    id: 'studio-purple-neon-dancer',
    category: 'group-studio',
    filename: 'xing-fitness-aerobic-dance-studio-purple',
    title: 'Purple & Blue Group Fitness Dance Studio',
    alt: 'Dedicated group fitness studio with purple neon dance mural and full mirrored training stage at Xing Fitness',
    tags: ['group-fitness', 'interior']
  },
  {
    raw: 'Copy of HC232622.jpg',
    id: 'studio-panoramic-dual-murals',
    category: 'group-studio',
    filename: 'xing-fitness-group-fitness-studio-panoramic',
    title: 'Panoramic View of Group Studio & Battle Ropes Mural',
    alt: 'Spacious group fitness studio with vibrant blue workout battle ropes mural and purple stage graphics at Xing Fitness',
    tags: ['group-fitness', 'interior']
  }
];

async function processPhotos() {
  console.log('Processing all 22 real Xing Fitness photographs...');

  for (const item of PHOTO_CATALOG) {
    const srcPath = path.join(sourceDir, item.raw);
    if (!fs.existsSync(srcPath)) {
      console.error(`Source file missing: ${srcPath}`);
      continue;
    }

    const outDir = path.join(targetBase, item.category);

    // 1. High-resolution Web version (max 1920w for horizontal, 1400h for vertical)
    const webp1920 = path.join(outDir, `${item.filename}.webp`);
    const jpg1920 = path.join(outDir, `${item.filename}.jpg`);

    await sharp(srcPath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(webp1920);

    await sharp(srcPath)
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpg1920);

    // 2. Medium resolution for cards/grids (800w)
    const webp800 = path.join(outDir, `${item.filename}-md.webp`);
    const jpg800 = path.join(outDir, `${item.filename}-md.jpg`);

    await sharp(srcPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80, effort: 3 })
      .toFile(webp800);

    await sharp(srcPath)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toFile(jpg800);

    // Also copy to gallery folder for unified gallery filtering
    const galWebp = path.join(targetBase, 'gallery', `${item.filename}.webp`);
    const galJpg = path.join(targetBase, 'gallery', `${item.filename}.jpg`);
    const galThumb = path.join(targetBase, 'gallery', `${item.filename}-thumb.webp`);

    fs.copyFileSync(webp1920, galWebp);
    fs.copyFileSync(jpg1920, galJpg);

    await sharp(srcPath)
      .resize({ width: 600, height: 400, fit: 'cover' })
      .webp({ quality: 78 })
      .toFile(galThumb);

    console.log(`✓ Processed: ${item.filename} -> WebP & JPG (Full + MD + Thumb)`);
  }

  console.log('All 22 real photos optimized and cataloged successfully!');
}

processPhotos().catch(console.error);
