import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export async function GET(req) {
  try {
    const cookie = req.cookies.get("agent-token");
    if (!cookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";
    const payload = await decode({ token: cookie.value, secret });
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      agent: {
        userId: payload.userId,
        email: payload.email,
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read agent" }, { status: 500 });
  }
}