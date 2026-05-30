import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { Scan } from "@/models/Scan";
import { predictDentalConditions } from "@/lib/ai/dental-predict";
import { dummyScanStore } from "@/lib/db/dummy-store";

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Decide whether to forward to external AI service or run local prediction
    const aiApiUrl = (process.env.AI_API_URL || "").trim();

    // Helper: map label -> recommendation
    function getRecommendation(label: string) {
      const key = label.toLowerCase();
      if (key.includes("caries") || key.includes("karies"))
        return "Segera konsultasi ke dokter gigi untuk evaluasi dan tindakan pencegahan.";
      if (key.includes("karang"))
        return "Lakukan scaling ke dokter gigi untuk membersihkan karang dan mencegah peradangan.";
      if (key.includes("gusi"))
        return "Pertahankan perawatan gusi; konsultasi jika ada perdarahan atau nyeri.";
      if (key.includes("sehat"))
        return "Pertahankan rutinitas perawatan mulut: sikat, flossing, dan pemeriksaan rutin.";
      return "Konsultasikan dengan dokter gigi untuk rekomendasi lebih lanjut.";
    }

    const pickSeverity = (c: number) => (c >= 85 ? "high" : c >= 70 ? "medium" : "low");

    let createPayload: any = null;

    if (aiApiUrl) {
      // Forward to external FastAPI service
      try {
        const forwardUrl = aiApiUrl.replace(/\/$/, "") + "/predict";

        const forwardForm = new FormData();
        forwardForm.append("image", new Blob([buffer], { type: file.type }), file.name);

        // Forward auth header if present
        const forwardHeaders: Record<string, string> = {};
        const authHeader = req.headers.get("authorization");
        if (authHeader) forwardHeaders["authorization"] = authHeader;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);

        const res = await fetch(forwardUrl, {
          method: "POST",
          body: forwardForm as any,
          headers: forwardHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch (e) {
          return NextResponse.json(
            { success: false, error: "Invalid response from AI service", raw: text },
            { status: 502 }
          );
        }

        // Expect { success: true, data: { label, confidence, all_predictions } }
        const aiData = json && json.success && json.data ? json.data : json;

        const label = String(aiData?.label ?? "");
        let confidence = Number(aiData?.confidence ?? aiData?.confidenceScore ?? 0) || 0;
        if (confidence > 0 && confidence <= 1) confidence = confidence * 100;
        confidence = Math.min(Math.max(confidence, 0), 100);

        const overallScore = Math.round(confidence);
        const confidenceScore = Math.round(confidence);

        const urgency = confidence >= 85 ? "high" : confidence >= 70 ? "medium" : "low";

        const conditions: any[] = [];
        if (aiData?.all_predictions && typeof aiData.all_predictions === "object") {
          for (const [name, val] of Object.entries(aiData.all_predictions)) {
            let v = Number(val as any) || 0;
            if (v > 0 && v <= 1) v = v * 100;
            v = Math.min(Math.max(v, 0), 100);
            conditions.push({ name, detected: String(label) === name, confidence: Math.round(v), severity: pickSeverity(v) });
          }
        } else {
          conditions.push({ name: label, detected: true, confidence: confidenceScore, severity: pickSeverity(confidenceScore) });
        }

        createPayload = {
          overallScore,
          confidenceScore,
          conditions,
          summary: `Terdeteksi: ${label} dengan kepercayaan ${Math.round(confidence)}%`,
          recommendation: getRecommendation(label),
          urgency,
        };
      } catch (e: any) {
        console.error("[scan][forward]", e);
        const isAbort = e?.name === "AbortError" || /aborted|timeout/i.test(String(e?.message || ""));
        return NextResponse.json(
          { success: false, error: isAbort ? "Request ke AI service timeout" : "Gagal meneruskan permintaan ke AI service" },
          { status: 502 }
        );
      }
    } else {
      // Fallback: local prediction
      const local = await predictDentalConditions({ imageBuffer: buffer, fileName: file.name, mimeType: file.type });
      createPayload = local;
    }

    const conn = await connectDB();
    if (conn) {
      const scan = await Scan.create({ userId: auth.userId, ...createPayload });
      const scanData = scan.toObject();
      return NextResponse.json({
        success: true,
        data: {
          ...scanData,
          id: scanData._id.toString(),
        },
      });
    }

    const scan = dummyScanStore.create(auth.userId, createPayload);
    return NextResponse.json({ success: true, data: scan });
  } catch (err) {
    console.error("[scan]", err);
    return NextResponse.json(
      { success: false, error: "Gagal memproses scan" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const conn = await connectDB();
  if (conn) {
    const scans = await Scan.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({ success: true, data: scans });
  }

  return NextResponse.json({
    success: true,
    data: dummyScanStore.list(auth.userId),
  });
}
