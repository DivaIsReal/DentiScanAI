import fs from 'fs';
import path from 'path';
import { debugPredictDentalImage } from '../lib/ai/dental-model';

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: tsx scripts/debug-predict.ts <image-path>');
    process.exit(2);
  }

  const imgPath = args[0];
  if (!fs.existsSync(imgPath)) {
    console.error('File not found:', imgPath);
    process.exit(2);
  }

  const buffer = fs.readFileSync(imgPath);
  const previewPath = path.join(process.cwd(), '.cache', 'debug-preprocessed.jpg');

  console.log('Running debug prediction for', imgPath);
  try {
    const result = await debugPredictDentalImage({ imageBuffer: buffer, savePreview: previewPath });
    console.log('--- RESULT ---');
    console.log(JSON.stringify({ label: result.label, confidence: result.confidence, score: result.score, distance: result.distance, embeddingSize: result.embeddingSize }, null, 2));
    console.log('--- DISTANCES ---');
    for (const d of result.distances) {
      console.log(`${d.label}: distance=${d.distance.toFixed(4)} count=${d.count}`);
    }
    console.log('Preview saved to', previewPath);
  } catch (e) {
    console.error('Prediction failed:', e);
    process.exit(3);
  }
}

main();
