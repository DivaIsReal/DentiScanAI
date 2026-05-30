#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function testPrediction() {
  // Load the prediction module
  const { predictDentalImage, debugPredictDentalImage } = await import('./lib/ai/dental-model.ts');

  const testImages = [
    { path: './Capstone DS/dentalscan/dentalscan/gigi caries/110.jpg', expected: 'caries' },
    { path: './Capstone DS/dentalscan/dentalscan/gigi sehat/1.jpg', expected: 'healthy' },
    { path: './Capstone DS/dentalscan/dentalscan/karang gigi/1.jpg', expected: 'karang_gigi' },
    { path: './Capstone DS/dentalscan/dentalscan/gusi sehat/1.jpg', expected: 'gusi_sehat' },
  ];

  console.log('🦷 Testing AI Prediction with New Scoring...\n');

  for (const test of testImages) {
    try {
      if (!fs.existsSync(test.path)) {
        console.log(`⚠️  ${test.path} not found`);
        continue;
      }

      const buffer = fs.readFileSync(test.path);
      const result = await predictDentalImage({ imageBuffer: buffer });

      const match = result.label === test.expected ? '✅' : '❌';
      console.log(`${match} Expected: ${test.expected}`);
      console.log(`   Predicted: ${result.label}`);
      console.log(`   Score: ${result.score}, Confidence: ${result.confidence}\n`);
    } catch (error) {
      console.error(`❌ Error testing ${test.path}:`, error.message);
    }
  }
}

testPrediction().catch(console.error);
