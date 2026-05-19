import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth/jwt";
import { dummyUserStore } from "@/lib/db/dummy-store";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data input tidak valid" },
        { status: 400 }
      );
    }

    const { fullName, email, password } = parsed.data;
    const conn = await connectDB();

    if (conn) {
      const exists = await User.findOne({ email });
      if (exists) {
        return NextResponse.json(
          { success: false, error: "Email sudah terdaftar" },
          { status: 400 }
        );
      }
      const hashed = await hashPassword(password);
      const user = await User.create({ fullName, email, password: hashed });
      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
      });
      setAuthCookie(token);
      return NextResponse.json({
        success: true,
        data: { id: user._id, fullName, email },
      });
    }

    // Fallback to in-memory store
    if (dummyUserStore.findByEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    const hashed = await hashPassword(password);
    const user = dummyUserStore.create({ fullName, email, password: hashed });
    const token = signToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });
    setAuthCookie(token);
    return NextResponse.json({
      success: true,
      data: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
