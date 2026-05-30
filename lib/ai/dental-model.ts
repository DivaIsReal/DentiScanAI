import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import sharp from "sharp";

export type DentalLabel = "caries" | "healthy" | "karang_gigi" | "gusi_sehat";

export interface DentalModelStats {
  label: DentalLabel;
  count: number;
  centroid: number[];
}

export interface DentalSample {
  label: DentalLabel;
  embedding: number[];
}

export interface DentalModelFile {
  version: number;
  createdAt: string;
  datasetKey: string;
  embeddingSize: number;
  backbone: "mobilenet-v2";
  stats: DentalModelStats[];
  samples?: DentalSample[];
  classifier?: {
    weights: number[]; // flattened [in, out]
    bias: number[]; // [out]
    inSize: number;
    outSize: number;
  };
}

export interface DentalPrediction {
  label: DentalLabel;
  confidence: number;
  score: number;
  distance: number;
}

const DATASET_ROOT = path.join(process.cwd(), "Capstone DS", "dentalscan", "dentalscan");
const MODEL_CACHE_DIR = path.join(process.cwd(), ".cache");
const MODEL_CACHE_FILE = path.join(MODEL_CACHE_DIR, "dental-model-mobilenet.json");

const FOLDER_TO_LABEL: Record<string, DentalLabel> = {
  "gigi caries": "caries",
  "gigi sehat": "healthy",
  "karang gigi": "karang_gigi",
  "gusi sehat": "gusi_sehat",
};

const LABEL_ORDER: DentalLabel[] = ["caries", "healthy", "karang_gigi", "gusi_sehat"];
const IMAGE_SIZE = 224;

let modelPromise: Promise<DentalModelFile> | null = null;
let backbonePromise: Promise<mobilenet.MobileNet> | null = null;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeVector(values: number[]) {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) return values.slice();
  return values.map((value) => value / magnitude);
}

function euclideanDistance(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

async function getBackbone() {
  if (!backbonePromise) {
    backbonePromise = (async () => {
      await tf.setBackend("cpu");
      await tf.ready();
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();
  }

  return backbonePromise;
}

async function loadImageTensor(buffer: Buffer) {
  const { data, info } = await sharp(buffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "cover" })
    .removeAlpha()
    .sharpen()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return tf.tidy(() => {
    const tensor = tf.tensor3d(new Uint8Array(data), [info.height, info.width, info.channels], "int32");
    return tensor.toFloat().div(255).expandDims(0);
  });
}

async function preprocessImageBuffer(buffer: Buffer) {
  // produce raw pixels for model + a JPEG preview of the preprocessed image
  const pipeline = sharp(buffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'cover' })
    .removeAlpha()
    .sharpen();

  const [{ data, info }, previewBuffer] = await Promise.all([
    pipeline.clone().raw().toBuffer({ resolveWithObject: true }),
    pipeline.clone().jpeg({ quality: 80 }).toBuffer(),
  ]);

  return { data, info, previewBuffer };
}

async function extractEmbedding(buffer: Buffer) {
  const backbone = await getBackbone();
  const { data, info } = await preprocessImageBuffer(buffer);
  const imageTensor = tf.tidy(() => {
    const tensor = tf.tensor3d(new Uint8Array(data), [info.height, info.width, info.channels], 'int32');
    return tensor.toFloat().div(255).expandDims(0);
  });
  const embedding = tf.tidy(() => backbone.infer(imageTensor, true) as tf.Tensor);

  const values = Array.from(await embedding.data());
  imageTensor.dispose();
  embedding.dispose();

  return normalizeVector(values);
}

async function listImages(folderPath: string) {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(folderPath, entry.name))
    .filter((filePath) => /\.(png|jpe?g|webp)$/i.test(filePath));
}

async function buildDatasetKey() {
  const hash = createHash("sha256");
  const folders = await fs.readdir(DATASET_ROOT, { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    hash.update(folder.name.toLowerCase());

    const files = await listImages(path.join(DATASET_ROOT, folder.name));
    hash.update(String(files.length));

    for (const filePath of files) {
      const stats = await fs.stat(filePath);
      hash.update(path.basename(filePath).toLowerCase());
      hash.update(String(stats.size));
      hash.update(String(stats.mtimeMs));
    }
  }

  return hash.digest("hex");
}

async function trainModel(): Promise<DentalModelFile> {
  const datasetKey = await buildDatasetKey();
  const statsMap = new Map<DentalLabel, { count: number; sum: number[] }>();

  for (const label of LABEL_ORDER) {
    statsMap.set(label, { count: 0, sum: [] });
  }

  let embeddingSize = 0;
  const samples: DentalSample[] = [];
  const folders = await fs.readdir(DATASET_ROOT, { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const label = FOLDER_TO_LABEL[folder.name.toLowerCase()];
    if (!label) continue;

    const imageFiles = await listImages(path.join(DATASET_ROOT, folder.name));
    for (const imageFile of imageFiles) {
      const buffer = await fs.readFile(imageFile);
      const embedding = await extractEmbedding(buffer);
      // store sample embedding for KNN
      samples.push({ label, embedding });
      const bucket = statsMap.get(label);
      if (!bucket) continue;

      if (embeddingSize === 0) {
        embeddingSize = embedding.length;
      }

      if (!bucket.sum.length) {
        bucket.sum = new Array(embedding.length).fill(0);
      }

      bucket.count += 1;
      for (let i = 0; i < embedding.length; i += 1) {
        bucket.sum[i] += embedding[i] ?? 0;
      }
    }
  }

  const stats: DentalModelStats[] = LABEL_ORDER.map((label) => {
    const bucket = statsMap.get(label)!;
    const centroid = bucket.count > 0
      ? bucket.sum.map((value) => value / bucket.count)
      : new Array(embeddingSize || 1024).fill(0);

    return { label, count: bucket.count, centroid: normalizeVector(centroid) };
  });

  // Skip classifier training - using KNN instead which is more reliable
  const model: DentalModelFile = {
    version: 2,
    createdAt: new Date().toISOString(),
    datasetKey,
    embeddingSize: embeddingSize || stats[0]?.centroid.length || 1024,
    backbone: "mobilenet-v2",
    stats,
    samples,
  };

  // Classifier training disabled - KNN is more reliable for small datasets
  /*
  try {
    if (samples.length >= 40) {
      const X = tf.tensor2d(samples.map((s) => s.embedding));
      const labelToIndex: Record<DentalLabel, number> = { caries: 0, healthy: 1, karang_gigi: 2, gusi_sehat: 3 };
      const yVals = samples.map((s) => {
        const arr = [0, 0, 0, 0];
        arr[labelToIndex[s.label]] = 1;
        return arr;
      });
      const Y = tf.tensor2d(yVals);

      const clf = tf.sequential();
      clf.add(tf.layers.dense({ units: 4, inputShape: [X.shape[1]] }));
      clf.compile({ optimizer: tf.train.adam(0.01), loss: 'categoricalCrossentropy' });

      // train classifier with more epochs for better convergence
      await clf.fit(X, Y, { epochs: 25, batchSize: 8, verbose: 0 });

      const weights = clf.layers[0].getWeights();
      const w = weights[0];
      const b = weights[1];
      const wArr = Array.from(await w.data());
      const bArr = Array.from(await b.data());

      model.classifier = { weights: wArr, bias: bArr, inSize: X.shape[1], outSize: 4 };

      X.dispose();
      Y.dispose();
      clf.dispose();
    }
  } catch (e) {
    // ignore classifier training errors
    console.error('Classifier training failed', e);
  }
  */

  await fs.mkdir(MODEL_CACHE_DIR, { recursive: true });
  await fs.writeFile(MODEL_CACHE_FILE, JSON.stringify(model, null, 2), "utf8");

  return model;
}

async function loadModel(): Promise<DentalModelFile> {
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    const datasetKey = await buildDatasetKey();

    try {
      const cached = await fs.readFile(MODEL_CACHE_FILE, "utf8");
      const parsed = JSON.parse(cached) as DentalModelFile;
      if (parsed?.stats?.length && parsed.datasetKey === datasetKey && parsed.backbone === "mobilenet-v2") {
        return parsed;
      }
    } catch {
      // cache miss: train from dataset
    }

    return trainModel();
  })();

  return modelPromise;
}

function scoreFromDistance(distance: number, bestDistance: number, secondBestDistance: number) {
  const spread = Math.max(secondBestDistance - bestDistance, 0.001);
  return clamp(Math.round(100 - bestDistance * 15), 20, 95);
}

export async function predictDentalImage(input: { imageBuffer: Buffer }) {
  const model = await loadModel();
  const features = await extractEmbedding(input.imageBuffer);
  const samples = model.samples || [];

  // Use k-NN over sample embeddings - most reliable for small datasets
  if (samples.length > 0) {
    const dists = samples.map((s) => ({ label: s.label, distance: euclideanDistance(features, s.embedding) }));
    dists.sort((a, b) => a.distance - b.distance);
    const k = Math.min(7, Math.max(3, Math.floor(Math.sqrt(samples.length))));
    const topK = dists.slice(0, k);

    // weighted inverse-distance voting
    const votes = new Map<DentalLabel, number>();
    let weightSum = 0;
    for (const item of topK) {
      const w = 1 / (item.distance + 1e-6);
      votes.set(item.label, (votes.get(item.label) || 0) + w);
      weightSum += w;
    }

    const sorted = Array.from(votes.entries()).sort((a, b) => b[1] - a[1]);
    const knnLabel = sorted[0][0];
    const knnFraction = sorted[0][1] / weightSum;
    const confidence = clamp(Math.round(50 + knnFraction * 48), 50, 98);

    // score based on actual distance to nearest neighbor
    // closer distance = better match = higher score
    const bestDist = topK[0].distance;
    const score = clamp(Math.round(100 - bestDist * 15), 20, 95);

    return { label: knnLabel, confidence, score, distance: topK[0].distance };
  }

  // Fallback to centroid if no samples (shouldn't happen)
  const scored = model.stats
    .filter((stat) => stat.count > 0)
    .map((stat) => ({ label: stat.label, distance: euclideanDistance(features, stat.centroid) }))
    .sort((a, b) => a.distance - b.distance);

  const best = scored[0] ?? { label: "healthy" as DentalLabel, distance: 0.4 };
  const secondBest = scored[1] ?? { label: "healthy" as DentalLabel, distance: best.distance + 0.25 };
  const score = scoreFromDistance(best.distance, best.distance, secondBest.distance);
  const confidence = score;

  return { label: best.label, confidence, score, distance: best.distance };
}

// Debug helper: returns embedding and distances for each label, and writes a preprocessed preview image
export async function debugPredictDentalImage(input: { imageBuffer: Buffer; savePreview?: string }) {
  const model = await loadModel();
  const { data, info, previewBuffer } = await preprocessImageBuffer(input.imageBuffer);
  const features = await extractEmbedding(input.imageBuffer);

  const distances = model.stats.map((stat) => ({ label: stat.label, distance: euclideanDistance(features, stat.centroid), count: stat.count }));
  distances.sort((a, b) => a.distance - b.distance);

  if (input.savePreview) {
    try {
      await fs.mkdir(MODEL_CACHE_DIR, { recursive: true });
      // write the preprocessed preview so users see what the model actually consumed
      await fs.writeFile(input.savePreview, previewBuffer);
    } catch (e) {
      // ignore preview write errors
    }
  }

  const best = distances[0] ?? { label: 'healthy' as DentalLabel, distance: 0.4, count: 0 };
  const secondBest = distances[1] ?? { label: 'healthy' as DentalLabel, distance: best.distance + 0.25, count: 0 };
  const score = scoreFromDistance(best.distance, best.distance, secondBest.distance);
  const confidence = score;

  return {
    label: best.label,
    confidence,
    score,
    distance: best.distance,
    distances,
    embeddingSize: features.length,
  };
}

export async function getDentalModel() {
  return loadModel();
}
