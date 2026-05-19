import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth/jwt";
import { dummyUserStore } from "@/lib/db/dummy-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Email atau password tidak valid" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const conn = await connectDB();

    if (conn) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, error: "Email atau password salah" },
          { status: 401 }
        );
      }
      const ok = await comparePassword(password, user.password);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Email atau password salah" },
          { status: 401 }
        );
      }
      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
      });
      setAuthCookie(token);
      return NextResponse.json({
        success: true,
        data: { id: user._id, fullName: user.fullName, email: user.email },
      });
    }

    // Fallback
    const user = dummyUserStore.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }
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
    console.error("[login]", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
