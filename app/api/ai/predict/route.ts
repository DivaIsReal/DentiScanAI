import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import { predictDentalConditions, predictDentalConditionsDebug } from "@/lib/ai/dental-predict";

const DEFAULT_FORWARD_TIMEOUT = 30_000; // 30s

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

    const aiApiUrl = (process.env.AI_API_URL || "").trim();

    // If AI_API_URL is configured, forward the request to the external FastAPI service
    if (aiApiUrl) {
      try {
        const forwardUrl = aiApiUrl.replace(/\/$/, "") + "/predict";

        const forwardForm = new FormData();
        forwardForm.append("image", new Blob([buffer], { type: file.type }), file.name);
        if (debugFlag) forwardForm.append("debug", "1");

        // Forward auth header if present (optional)
        const forwardHeaders: Record<string, string> = {};
        const authHeader = req.headers.get("authorization");
        if (authHeader) forwardHeaders["authorization"] = authHeader;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), DEFAULT_FORWARD_TIMEOUT);

        const res = await fetch(forwardUrl, {
          method: "POST",
          body: forwardForm as any,
          headers: forwardHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const text = await res.text();
        try {
          const json = JSON.parse(text);
          return NextResponse.json(json, { status: res.status });
        } catch (e) {
          // Non-JSON response
          return NextResponse.json(
            { success: false, error: "Invalid response from AI service", raw: text },
            { status: 502 }
          );
        }
      } catch (e: any) {
        console.error("[ai/predict][forward]", e);
        const isAbort = e?.name === "AbortError" || /aborted|timeout/i.test(String(e?.message || ""));
        return NextResponse.json(
          { success: false, error: isAbort ? "Request ke AI service timeout" : "Gagal meneruskan permintaan ke AI service" },
          { status: 502 }
        );
      }
    }

    // Fallback: run local prediction (keep existing AI logic)
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
