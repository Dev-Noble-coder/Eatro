import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import User from "../../../../lib/models/users";
import Restaurant from "../../../../lib/models/Restaurant";
import { decode } from "next-auth/jwt";

export async function GET(req) {
  try {
    await connectDB();

    const cookie = req.cookies.get("agent-token");
    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";
    const token = cookie?.value
      ? await decode({ token: cookie.value, secret })
      : null;
    
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is an agent
    if (token.role !== "agent" && token.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Agent role required." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // For agents, they can only see orders assigned to them
    const filter = { assignedAgent: token.userId, isActive: true };

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("customer", "name phone")
      .populate("restaurant", "name address image")
      .select(
        "orderNumber items deliveryDetails status estimatedDeliveryTime totalAmount",
      );

    // Get total count for pagination
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
    console.error("Get agent orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent orders" },
      { status: 500 },
    );
  }
}
