import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export async function GET(req) {
  try {
    const cookie = req.cookies.get("user-token");
    if (!cookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";
    const payload = await decode({ token: cookie.value, secret });
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        userId: payload.userId,
        email: payload.email,
        fullName: payload.fullName,
        hostel: payload.hostel,
        roomNumber: payload.roomNumber,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read user" },
      { status: 500 },
    );
  }
}