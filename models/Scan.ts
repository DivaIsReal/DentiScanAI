import mongoose, { Schema, models, model } from "mongoose";

export interface IScan {
  userId: mongoose.Types.ObjectId;
  imageUrl?: string;
  overallScore: number;
  confidenceScore: number;
  conditions: Array<{
    name: string;
    detected: boolean;
    confidence: number;
    severity?: "low" | "medium" | "high";
  }>;
  summary: string;
  recommendation: string;
  urgency: "low" | "medium" | "high";
  createdAt: Date;
}

const ScanSchema = new Schema<IScan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    conditions: [
      {
        name: { type: String, required: true },
        detected: { type: Boolean, required: true },
        confidence: { type: Number, required: true, min: 0, max: 100 },
        severity: { type: String, enum: ["low", "medium", "high"] },
      },
    ],
    summary: { type: String, required: true },
    recommendation: { type: String, required: true },
    urgency: { type: String, enum: ["low", "medium", "high"], default: "low" },
  },
  { timestamps: true }
);

export const Scan = models.Scan || model<IScan>("Scan", ScanSchema);
