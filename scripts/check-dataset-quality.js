#!/usr/bin/env node
/**
 * Check if dataset labels are correct by comparing embeddings
 * If "caries" and "healthy" have very similar embeddings, labels might be wrong
 */
const fs = require('fs');
const path = require('path');

async function checkDatasetQuality() {
  console.log('🔍 Checking Dataset Label Quality...\n');

  const dentalModule = await import('../lib/ai/dental-model.ts');
  const { extractEmbedding } = dentalModule;

  const folders = {
    'gigi caries': [],
    'gigi sehat': [],
  };

  // Extract 3 samples dari masing-masing folder
  for (const [folderName, samples] of Object.entries(folders)) {
    const folderPath = path.join(process.cwd(), 'Capstone DS/dentalscan/dentalscan', folderName);
    const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).slice(0, 3);

    console.log(`\n📁 ${folderName} (${files.length} samples):`);

    for (const file of files) {
      try {
        const filePath = path.join(folderPath, file);
        const buffer = fs.readFileSync(filePath);
        const embedding = await extractEmbedding(buffer);

        // Calculate magnitude of embedding
        const magnitude = Math.sqrt(
          embedding.reduce((sum, val) => sum + val * val, 0)
        );

        console.log(`   ${file}: magnitude=${magnitude.toFixed(4)}, dim=${embedding.length}`);
      } catch (e) {
        console.log(`   ${file}: ERROR - ${e.message}`);
      }
    }
  }

  console.log('\n💡 If both folders have similar magnitude embeddings, labels might be swapped!');
}

checkDatasetQuality().catch(console.error);
