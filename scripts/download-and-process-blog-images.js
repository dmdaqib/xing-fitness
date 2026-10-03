import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve('public/images/blog');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function getRedirectUrl(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else if (res.statusCode === 200) {
        resolve(url);
      } else {
        reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }
    });
    req.on('error', reject);
  });
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadBuffer(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: status ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function processDirectUrl(directUrl, outputFilename, cropPosition = 'center') {
  console.log(`Downloading direct URL -> ${outputFilename}...`);
  const buffer = await downloadBuffer(directUrl);
  console.log(`  Downloaded ${buffer.length} bytes`);

  const destWebp = path.join(outputDir, outputFilename + '.webp');
  const destJpg = path.join(outputDir, outputFilename + '.jpg');

  await sharp(buffer)
    .resize(1200, 750, { fit: 'cover', position: cropPosition })
    .webp({ quality: 86 })
    .toFile(destWebp);

  await sharp(buffer)
    .resize(1200, 750, { fit: 'cover', position: cropPosition })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(destJpg);

  console.log(`  Saved ${destWebp} and ${destJpg}`);
}

async function processUnsplashPhoto(photoId, outputFilename, cropPosition = 'center') {
  console.log(`Processing Unsplash photo ${photoId} -> ${outputFilename}...`);
  const downloadUrl = `https://unsplash.com/photos/${photoId}/download?force=true`;
  const cdnUrl = await getRedirectUrl(downloadUrl);
  console.log(`  Resolved CDN URL: ${cdnUrl.slice(0, 80)}...`);
  const buffer = await downloadBuffer(cdnUrl);
  console.log(`  Downloaded ${buffer.length} bytes`);
  
  const destWebp = path.join(outputDir, outputFilename + '.webp');
  const destJpg = path.join(outputDir, outputFilename + '.jpg');

  // Generate 1200x750 (16:10 aspect ratio matching blog cards and hero)
  await sharp(buffer)
    .resize(1200, 750, { fit: 'cover', position: cropPosition })
    .webp({ quality: 86 })
    .toFile(destWebp);

  await sharp(buffer)
    .resize(1200, 750, { fit: 'cover', position: cropPosition })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(destJpg);

  console.log(`  Saved ${destWebp} and ${destJpg}`);
}

async function copyAndOptimizeLocalPhoto(srcPath, outputFilename) {
  console.log(`Processing local photo ${srcPath} -> ${outputFilename}...`);
  const buffer = fs.readFileSync(path.resolve(srcPath));
  const destWebp = path.join(outputDir, outputFilename + '.webp');
  const destJpg = path.join(outputDir, outputFilename + '.jpg');

  await sharp(buffer)
    .resize(1200, 750, { fit: 'cover', position: 'center' })
    .webp({ quality: 86 })
    .toFile(destWebp);

  await sharp(buffer)
    .resize(1200, 750, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(destJpg);

  console.log(`  Saved ${destWebp} and ${destJpg}`);
}

async function main() {
  try {
    // 1. Deadlift barbell strength for desk workers (blog-1) - Unsplash (Victor Freitas)
    await processDirectUrl(
      'https://images.unsplash.com/photo-1541600278744-d4cba88bb2c7?auto=format&fit=crop&w=1600&q=85',
      'desk-worker-strength-training-barbell-deadlift',
      'center'
    );

    // 2. Resistance training with dumbbells for weight loss (blog-2) - Unsplash (Jahir Martinez)
    await processUnsplashPhoto('YFJn6-GZVuw', 'sustainable-weight-loss-resistance-training-dumbbells', 'center');

    // 3. 1-on-1 Personal Trainer coaching client (blog-3) - Unsplash (Julia Larson)
    await processUnsplashPhoto('sDzSyrJyLv4', 'one-on-one-personal-trainer-coaching-client-xing-fitness', 'center');

    // 4. HIIT battle ropes conditioning (blog-4) - Unsplash (Vitaly Gariev)
    await processUnsplashPhoto('U3yTiv2ZT4M', 'high-intensity-interval-training-hiit-battle-ropes', 'center');

    // 5. Yoga & dynamic mobility stretching (blog-5) - Unsplash
    await processUnsplashPhoto('UGNGnSdEklQ', 'yoga-dynamic-mobility-stretching-strength-athletes', 'center');

    // 6. Functional training kettlebell swings (blog-6) - Unsplash
    await processUnsplashPhoto('nLNOM0asvfI', 'functional-training-kettlebell-swings-everyday-strength', 'center');

    // 7. Nutrition protein meal prep (blog-7) - Unsplash
    await processUnsplashPhoto('rwu15ZJvQvM', 'nutrition-foundations-protein-meal-prep-hydration', 'center');

    // 8. Beginner dumbbell squat (blog-8) - Unsplash (Rodrigo Rodrigues)
    await processUnsplashPhoto('HSUcA9U7bcA', 'beginner-gym-blueprint-fundamental-dumbbell-squat', 'center');

    // 9. Xing Fitness genuine dumbbell area & gym etiquette (blog-9) - Genuine Xing Fitness Gym Floor
    await copyAndOptimizeLocalPhoto('public/images/real/training-floor/xing-fitness-free-weights-dumbbell-area.jpg', 'smart-gym-tips-etiquette-xing-fitness-dumbbell-area');

    console.log('\n======================================================');
    console.log('ALL 9 BLOG IMAGES SUCCESSFULLY DOWNLOADED & OPTIMIZED!');
    console.log('======================================================');
  } catch (err) {
    console.error('Error during image processing:', err);
    process.exit(1);
  }
}

main();
