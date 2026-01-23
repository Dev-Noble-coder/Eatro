import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import User from "../../../../lib/models/users";
import Restaurant from "../../../../lib/models/Restaurant";
import Agent from "../../../../lib/models/agents"
import { decode } from "next-auth/jwt";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const cookie = req.cookies.get("agent-token");
    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";

    const token = cookie.value ? await decode({ token: cookie.value, secret }) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // Find order
    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("restaurant", "name address phone image")
      .populate("assignedAgent", "firstName lastName phone profileImage")
      .populate("statusHistory.updatedBy", "name role");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check permissions
    const isOwner = order.customer._id.toString() === token.userId;
    const isAssignedAgent =
      order.assignedAgent?._id.toString() === token.userId;
    const isRestaurantStaff =
      token.restaurantId === order.restaurant._id.toString();
    const isAdmin = token.role === "admin";

    if (!isOwner && !isAssignedAgent && !isRestaurantStaff && !isAdmin) {
      return NextResponse.json(
        { error: "Access denied to this order" },
        { status: 403 },
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
