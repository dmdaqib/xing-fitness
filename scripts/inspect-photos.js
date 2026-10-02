import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'C:\\Users\\dmdaq\\OneDrive\\Desktop\\drive-download-20260927T074949Z-1-001';
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.jpg'));

async function inspectPhotos() {
  console.log(`Found ${files.length} photos.`);
  const previewDir = path.resolve('public/images/gym/source_previews');
  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
  }

  const results = [];

  for (const file of files) {
    const fullPath = path.join(sourceDir, file);
    const metadata = await sharp(fullPath).metadata();
    const stats = await sharp(fullPath).stats();

    // Create a 400px preview for quick visual inspection
    const previewName = file.replace('Copy of ', '').replace('.jpg', '_thumb.jpg');
    const previewPath = path.join(previewDir, previewName);
    await sharp(fullPath)
      .resize({ width: 400 })
      .jpeg({ quality: 75 })
      .toFile(previewPath);

    results.push({
      file,
      cleanName: file.replace('Copy of ', ''),
      width: metadata.width,
      height: metadata.height,
      aspectRatio: (metadata.width / metadata.height).toFixed(2),
      dominantColor: stats.dominant,
      channels: stats.channels.map(c => Math.round(c.mean))
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

inspectPhotos().catch(console.error);
