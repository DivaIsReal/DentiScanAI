import type { ScanCondition } from "@/types";
import { predictDentalImage } from "@/lib/ai/dental-model";

export interface DentalPredictionInput {
  imageBuffer?: Buffer;
  fileName?: string;
  mimeType?: string;
}

export interface AIPredictionResult {
  overallScore: number;
  confidenceScore: number;
  conditions: ScanCondition[];
  summary: string;
  recommendation: string;
  urgency: "low" | "medium" | "high";
}

type ModelLabel = "caries" | "healthy" | "karang_gigi" | "gusi_sehat";

const CLASS_META: Record<
  ModelLabel,
  {
    conditionName: string;
    scoreRange: [number, number];
    confidenceRange: [number, number];
    summary: string;
    recommendation: string;
    urgency: "low" | "medium" | "high";
    clinicFinder: boolean;
  }
> = {
  caries: {
    conditionName: "Karies",
    scoreRange: [50, 98],
    confidenceRange: [50, 98],
    summary:
      "Terdeteksi indikasi karies pada gigi. Kondisi ini perlu dipantau karena berpotensi berkembang jika tidak ditangani.",
    recommendation:
      "Segera konsultasi ke dokter gigi untuk evaluasi lanjutan dan tindakan pencegahan agar kerusakan tidak bertambah.",
    urgency: "high",
    clinicFinder: true,
  },
  healthy: {
    conditionName: "Gigi Sehat",
    scoreRange: [50, 98],
    confidenceRange: [50, 98],
    summary:
      "Gigi tampak sehat dengan tanda kerusakan yang minimal. Kebersihan mulut terlihat terjaga.",
    recommendation:
      "Pertahankan rutinitas menyikat gigi 2 kali sehari, flossing, dan pemeriksaan rutin setiap 6 bulan.",
    urgency: "low",
    clinicFinder: false,
  },
  karang_gigi: {
    conditionName: "Karang Gigi",
    scoreRange: [50, 98],
    confidenceRange: [50, 98],
    summary:
      "Terdeteksi adanya penumpukan karang gigi. Scaling profesional disarankan untuk mencegah peradangan gusi.",
    recommendation:
      "Lakukan scaling ke dokter gigi agar karang gigi dibersihkan dan risiko radang gusi berkurang.",
    urgency: "medium",
    clinicFinder: true,
  },
  gusi_sehat: {
    conditionName: "Gusi Sehat",
    scoreRange: [50, 98],
    confidenceRange: [50, 98],
    summary:
      "Kondisi gusi tampak sehat, tanpa tanda peradangan yang berarti.",
    recommendation:
      "Pertahankan kebiasaan perawatan gigi dan gusi yang sudah baik.",
    urgency: "low",
    clinicFinder: false,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pickSeverity(confidence: number): "low" | "medium" | "high" {
  if (confidence >= 85) return "high";
  if (confidence >= 70) return "medium";
  return "low";
}

function buildConditions(label: ModelLabel, confidence: number, severity: "low" | "medium" | "high"): ScanCondition[] {
  const baseNoise = (offset: number) => 12 + Math.round((confidence + offset) % 16);
  return [
    {
      name: "Karies",
      detected: label === "caries",
      confidence: label === "caries" ? confidence : baseNoise(0),
      severity: label === "caries" ? severity : "low",
    },
    {
      name: "Karang Gigi",
      detected: label === "karang_gigi",
      confidence: label === "karang_gigi" ? confidence : baseNoise(5),
      severity: label === "karang_gigi" ? severity : "low",
    },
    {
      name: "Gigi Sehat",
      detected: label === "healthy",
      confidence: label === "healthy" ? confidence : baseNoise(10),
      severity: "low",
    },
    {
      name: "Gusi Sehat",
      detected: label === "gusi_sehat",
      confidence: label === "gusi_sehat" ? confidence : baseNoise(15),
      severity: "low",
    },
  ];
}

export async function predictDentalConditions(
  input: DentalPredictionInput = {}
): Promise<AIPredictionResult> {
  if (!input.imageBuffer?.length) {
    throw new Error("imageBuffer is required for dental prediction");
  }
  const prediction = await predictDentalImage({ imageBuffer: input.imageBuffer });
  const label = prediction.label;
  const meta = CLASS_META[label];

  const confidence = clamp(prediction.confidence, 0, 100);

  // Score reflects HEALTH condition (semantic), not model confidence
  let overallScore: number;
  if (label === "healthy" || label === "gusi_sehat") {
    overallScore = clamp(confidence * 0.9 + 80, 80, 98); // 80-98 for healthy
  } else if (label === "karang_gigi") {
    overallScore = clamp(confidence * 0.5 + 40, 40, 75); // 40-75 for tartar
  } else if (label === "caries") {
    overallScore = clamp(confidence * 0.4 + 20, 20, 60); // 20-60 for caries (low)
  } else {
    overallScore = clamp(prediction.score, 0, 100);
  }

  const conditions = buildConditions(label, confidence, pickSeverity(confidence));

  return {
    overallScore,
    confidenceScore: confidence,
    conditions,
    summary: meta.summary,
    recommendation: meta.recommendation,
    urgency: meta.urgency,
  };
}

export interface AIPredictionDebug extends AIPredictionResult {
  debug?: {
    embeddingSize: number;
    distances: Array<{ label: string; distance: number; count?: number }>;
    classifierPresent: boolean;
    method: "classifier" | "knn" | "centroid";
  };
}

export async function predictDentalConditionsDebug(
  input: DentalPredictionInput = {}
): Promise<AIPredictionDebug> {
  if (!input.imageBuffer?.length) {
    throw new Error("imageBuffer is required for dental prediction");
  }

  // Use debugPredictDentalImage to get per-label distances + embedding size
  const debug = await import("./dental-model").then((m) => m.debugPredictDentalImage({ imageBuffer: input.imageBuffer!, savePreview: input.fileName ? undefined : undefined }));

  const base = await predictDentalConditions(input);

  const method = debug.model.classifier ? "classifier" : (debug.distances && debug.distances.length ? "knn" : "centroid");

  return {
    ...base,
    debug: {
      embeddingSize: debug.embeddingSize,
      distances: debug.distances.map((d) => ({ label: d.label, distance: d.distance, count: d.count })),
      classifierPresent: Boolean(debug.model.classifier),
      method: method as any,
    },
  };
}

export function getPredictionNeedsClinicFinder(result: Pick<AIPredictionResult, "urgency">) {
  return result.urgency === "high" || result.urgency === "medium";
}
