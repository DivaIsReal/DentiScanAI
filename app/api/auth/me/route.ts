import { NextResponse } from "next/server";
import { getAuthFromCookie, clearAuthCookie } from "@/lib/auth/jwt";

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
    data: { id: auth.userId, fullName: auth.fullName, email: auth.email },
  });
}

export async function DELETE() {
  clearAuthCookie();
  return NextResponse.json({ success: true });
}
