import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import { generateChatResponse } from "@/lib/ai/predict";
import { dummyChatStore } from "@/lib/db/dummy-store";

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Pesan tidak valid" },
        { status: 400 }
      );
    }

    // Save user message
    dummyChatStore.append(auth.userId, { role: "user", content: message });

    const response = await generateChatResponse(message, history);

    // Save bot response
    const botMsg = dummyChatStore.append(auth.userId, {
      role: "assistant",
      content: response,
    });

    return NextResponse.json({
      success: true,
      data: { message: response, id: botMsg.id, createdAt: botMsg.createdAt },
    });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pesan" },
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
  return NextResponse.json({
    success: true,
    data: dummyChatStore.list(auth.userId),
  });
}

export async function DELETE() {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  dummyChatStore.clear(auth.userId);
  return NextResponse.json({ success: true });
}
