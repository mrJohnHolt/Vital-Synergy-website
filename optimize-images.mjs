import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const assets = 'Assets';

const targets = [
  { src: 'Main Plant Room Header.jpg',  maxW: 1920, q: 82 },
  { src: 'caseStudiesMain.JPG',         maxW: 1920, q: 82 },
  { src: 'hamptonhotel.jpg',            maxW: 1200, q: 82 },
  { src: 'cardenpark.jpg',              maxW: 1920, q: 82 },
  { src: 'freemanHospital.jpg',         maxW: 1200, q: 82 },
];

for (const { src, maxW, q } of targets) {
  const inPath  = join(assets, src);
  const outName = src.replace(/\.[^.]+$/, '.webp');
  const outPath = join(assets, outName);

  if (!existsSync(inPath)) { console.log(`SKIP (not found): ${inPath}`); continue; }

  await sharp(inPath)
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: q })
    .toFile(outPath);

  const before = statSync(inPath).size;
  const after  = statSync(outPath).size;
  const pct    = ((1 - after / before) * 100).toFixed(1);
  console.log(`${src} → ${outName}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB  (-${pct}%)`);
}
