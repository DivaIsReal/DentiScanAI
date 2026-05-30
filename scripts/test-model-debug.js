#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function testModelDebug() {
  console.log('🦷 Testing Model with Debug Info...\n');

  // Dynamic import untuk dental-model
  const dentalModule = await import('../lib/ai/dental-model.ts');
  const { debugPredictDentalImage } = dentalModule;

  const testCases = [
    {
      path: 'Capstone DS/dentalscan/dentalscan/gigi caries/110.jpg',
      label: 'CARIES',
      expected: 'caries'
    },
    {
      path: 'Capstone DS/dentalscan/dentalscan/gigi sehat/1.jpg',
      label: 'HEALTHY',
      expected: 'healthy'
    },
    {
      path: 'Capstone DS/dentalscan/dentalscan/karang gigi/1.jpg',
      label: 'KARANG GIGI',
      expected: 'karang_gigi'
    },
  ];

  for (const test of testCases) {
    try {
      const fullPath = path.join(process.cwd(), test.path);
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${test.path}`);
        continue;
      }

      const buffer = fs.readFileSync(fullPath);
      const result = await debugPredictDentalImage({ imageBuffer: buffer });

      console.log(`\n📷 ${test.label} Test`);
      console.log(`   Predicted: ${result.label} (score: ${result.score}, confidence: ${result.confidence})`);
      console.log(`   Method: ${result.debug?.method}`);
      console.log(`   Classifier: ${result.debug?.classifierPresent ? 'YES' : 'NO'}`);
      console.log(`   Embedding size: ${result.debug?.embeddingSize}`);

      if (result.debug?.distances) {
        console.log(`   Distances to centroids:`);
        result.debug.distances.forEach(d => {
          console.log(`     - ${d.label}: ${d.distance.toFixed(4)} (${d.count || 0} samples)`);
        });
      }

      const match = result.label === test.expected ? '✅' : '❌';
      console.log(`   Result: ${match} Expected ${test.expected}, got ${result.label}`);
    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }
}

testModelDebug().catch(console.error);
