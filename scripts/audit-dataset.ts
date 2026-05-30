import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { predictDentalImage } from '../lib/ai/dental-model';

const DATASET_ROOT = path.join(process.cwd(), 'Capstone DS', 'dentalscan', 'dentalscan');
const OUT_DIR = path.join(process.cwd(), '.cache', 'audit');

const FOLDER_MAP: Record<string, string> = {
  'gigi caries': 'caries',
  'gigi sehat': 'healthy',
  'karang gigi': 'karang_gigi',
  'gusi sehat': 'gusi_sehat',
};

async function listImages(dir: string) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    if (e.isFile() && /\.(jpe?g|png|webp)$/i.test(e.name)) files.push(path.join(dir, e.name));
    if (e.isDirectory()) {
      const sub = await listImages(path.join(dir, e.name));
      files.push(...sub);
    }
  }
  return files;
}

async function ensureDir(d: string) {
  await fs.promises.mkdir(d, { recursive: true });
}

async function run() {
  await ensureDir(OUT_DIR);
  await ensureDir(path.join(OUT_DIR, 'misclassified'));

  const folders = await fs.promises.readdir(DATASET_ROOT, { withFileTypes: true });
  const stats: Record<string, Record<string, number>> = {
    caries: { caries: 0, healthy: 0, karang_gigi: 0, gusi_sehat: 0 },
    healthy: { caries: 0, healthy: 0, karang_gigi: 0, gusi_sehat: 0 },
    karang_gigi: { caries: 0, healthy: 0, karang_gigi: 0, gusi_sehat: 0 },
    gusi_sehat: { caries: 0, healthy: 0, karang_gigi: 0, gusi_sehat: 0 },
  };

  const mis: Array<{ file: string; trueLabel: string; pred: string; confidence: number; distance: number }>= [];

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const folderName = folder.name;
    const trueLabel = FOLDER_MAP[folderName.toLowerCase()];
    if (!trueLabel) continue;

    const files = await fs.promises.readdir(path.join(DATASET_ROOT, folderName));
    for (const f of files) {
      if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
      const filePath = path.join(DATASET_ROOT, folderName, f);
      try {
        const buffer = await fs.promises.readFile(filePath);
        const pred = await predictDentalImage({ imageBuffer: buffer });
        const label = pred.label;
        stats[trueLabel][label] = (stats[trueLabel][label] || 0) + 1;
        if (label !== trueLabel) {
          mis.push({ file: filePath, trueLabel, pred: label, confidence: pred.confidence, distance: pred.distance });
          // save preview
          const previewName = `${path.basename(filePath).replace(/\s+/g,'_')}_${trueLabel}_as_${label}.jpg`;
          const outPath = path.join(OUT_DIR, 'misclassified', previewName);
          await sharp(buffer).resize(224,224,{fit:'cover'}).jpeg({quality:80}).toFile(outPath);
        }
      } catch (e) {
        console.error('Error on', filePath, e);
      }
    }
  }

  // write report
  const report = { stats, misCount: mis.length, total: Object.values(stats).reduce((s, row) => s + Object.values(row).reduce((a,b)=>a+b,0), 0), mis };
  await fs.promises.writeFile(path.join(OUT_DIR, 'report.json'), JSON.stringify(report,null,2), 'utf8');

  // write CSV of mis
  const csv = ['file,true,pred,confidence,distance'].concat(mis.map(m=>`${m.file},${m.trueLabel},${m.pred},${m.confidence},${m.distance}`)).join('\n');
  await fs.promises.writeFile(path.join(OUT_DIR, 'misclassified.csv'), csv, 'utf8');

  console.log('Audit complete. Total', report.total, 'misclassified', report.misCount, 'report at', path.join(OUT_DIR, 'report.json'));
}

run().catch((e)=>{ console.error(e); process.exit(1); });
