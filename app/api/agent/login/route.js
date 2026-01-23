import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import connectDB from "../../../../lib/mongodb";
import Agent from "../../../../lib/models/agents";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const agent = await Agent.findOne({ email });
    if (!agent) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, agent.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";
    const token = await encode({
      token: {
        userId: agent._id.toString(),
        email: agent.email,
        fullName: `${agent.firstName} ${agent.lastName}`,
        phoneNumber: agent.phone || "",
        role: "agent",
      },
      secret,
      maxAge: 60 * 60 * 24 * 30,
    });

    const res = NextResponse.json({
      success: true,
      agent: {
        id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
      },
    });

    res.cookies.set("agent-token", token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}