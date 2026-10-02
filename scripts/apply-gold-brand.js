// Script to replace old citron green brand colors with premium Black & Gold design system
import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (/\.(tsx?|css|html)$/.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('src');
let modifiedCount = 0;
let totalReplacements = 0;

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // 1. Exact case-insensitive hex replacements
  // Brand Primary: #E2F163 -> #D4AF37
  content = content.replace(/#E2F163/gi, (match) => {
    totalReplacements++;
    return '#D4AF37';
  });

  // Brand Hover 1: #CEE045 -> #C5A028
  content = content.replace(/#CEE045/gi, (match) => {
    totalReplacements++;
    return '#C5A028';
  });

  // Brand Hover 2: #cde045 -> #C5A028
  content = content.replace(/#cde045/gi, (match) => {
    totalReplacements++;
    return '#C5A028';
  });

  // 2. RGBA numeric replacements: 226, 241, 99 -> 212, 175, 55
  content = content.replace(/226,\s*241,\s*99/g, (match) => {
    totalReplacements++;
    return '212, 175, 55';
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    modifiedCount++;
    console.log(`Updated: ${filePath}`);
  }
});

console.log(`\n====================================================`);
console.log(`GOLD PALETTE TRANSFORMATION COMPLETE`);
console.log(`Files modified: ${modifiedCount} of ${files.length}`);
console.log(`Total brand token instances replaced: ${totalReplacements}`);
console.log(`====================================================`);
