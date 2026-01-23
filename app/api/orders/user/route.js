import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import User from "../../../../lib/models/users";
import { decode } from "next-auth/jwt";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const cookie = req.cookies.get("user-token");
    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";
    const token = cookie?.value ? await decode({ token: cookie.value, secret }) : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = token.userId;
    const filter = { customer: userId, isActive: true };

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("restaurant", "name image")
      .populate("assignedAgent", "firstName lastName phone profileImage");

    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
