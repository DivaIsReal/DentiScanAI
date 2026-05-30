import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { Scan } from "@/models/Scan";
import { dummyScanStore } from "@/lib/db/dummy-store";

export async function GET(
  req: NextRequest,
  { params }: { params: { scanId: string } }
) {
  const auth = getAuthFromCookie();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { scanId } = params;

    const conn = await connectDB();
    if (conn) {
      const scan = (await Scan.findById(scanId).lean()) as any;

      // Verify ownership - scan must belong to current user
      if (!scan || (scan.userId?.toString?.() || scan.userId) !== auth.userId) {
        return NextResponse.json(
          { success: false, error: "Scan not found or unauthorized" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...scan,
          id: scan._id.toString(),
        },
      });
    }

    // Fallback to dummy store
    const scan = dummyScanStore.getById(scanId, auth.userId);
    if (!scan) {
      return NextResponse.json(
        { success: false, error: "Scan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: scan });
  } catch (err) {
    console.error("[get-scan]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scan" },
      { status: 500 }
    );
  }
}
