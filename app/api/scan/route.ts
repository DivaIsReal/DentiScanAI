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

    let result;
    const aiApiUrl = (process.env.AI_API_URL || "").trim();

    if (aiApiUrl) {
      // Forward ke FastAPI Railway
      try {
        const forwardUrl = aiApiUrl.replace(/\/$/, "") + "/predict";
        const forwardForm = new FormData();
        forwardForm.append("image", new Blob([buffer], { type: file.type }), file.name);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);

        const res = await fetch(forwardUrl, {
          method: "POST",
          body: forwardForm as any,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "AI service error");
        }
        result = json.data;
      } catch (e: any) {
        console.error("[scan][forward]", e);
        const isAbort = e?.name === "AbortError" || /aborted|timeout/i.test(String(e?.message || ""));
        return NextResponse.json(
          { success: false, error: isAbort ? "Request ke AI service timeout" : "Gagal meneruskan ke AI service" },
          { status: 502 }
        );
      }
    } else {
      // Fallback lokal
      result = await predictDentalConditions({
        imageBuffer: buffer,
        fileName: file.name,
        mimeType: file.type,
      });
    }

    const conn = await connectDB();
    if (conn) {
      const scan = await Scan.create({
        userId: auth.userId,
        ...result,
      });
      const scanData = scan.toObject();
      return NextResponse.json({
        success: true,
        data: {
          ...scanData,
          id: scanData._id.toString(),
        },
      });
    }

    const scan = dummyScanStore.create(auth.userId, result);
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