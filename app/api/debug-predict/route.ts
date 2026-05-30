import { NextRequest, NextResponse } from "next/server";
import { predictDentalConditionsDebug } from "@/lib/ai/dental-predict";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await predictDentalConditionsDebug({ imageBuffer: buffer });

    return NextResponse.json({
      label: result.conditions.find(c => c.detected)?.name,
      confidence: result.confidenceScore,
      score: result.overallScore,
      debug: result.debug,
      allConditions: result.conditions,
    });
  } catch (err) {
    console.error("[debug-predict]", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
