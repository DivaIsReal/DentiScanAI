import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import { predictDentalConditions, predictDentalConditionsDebug } from "@/lib/ai/dental-predict";

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
    const debugFlag = formData.get("debug") === "1" || formData.get("debug") === "true";

    const data = debugFlag
      ? await predictDentalConditionsDebug({ imageBuffer: buffer, fileName: file.name, mimeType: file.type })
      : await predictDentalConditions({ imageBuffer: buffer, fileName: file.name, mimeType: file.type });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[ai/predict]", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses analisis AI" },
      { status: 500 }
    );
  }
}
