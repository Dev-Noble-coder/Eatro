import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Order from "../../../../../lib/models/Order";
import User from "../../../../../lib/models/users";
import Restaurant from "../../../../../lib/models/Restaurant";
import Agent from "../../../../../lib/models/agents";
import { decode } from "next-auth/jwt";


export async function PATCH(req, { params }) {
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

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check permissions
    const isAdmin = token.role === "admin";

    // Validate status transition
    const validTransitions = {
      order_received: ["payment_confirmed", "cancelled"],
      payment_confirmed: ["kitchen_preparing", "cancelled"],
      kitchen_preparing: ["on_the_way", "cancelled"],
      on_the_way: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${order.status} to ${status}`,
        },
        { status: 400 },
      );
    }

    // Update status
    await order.updateStatus(status, token.userId, notes);

    // Get updated order
    const updatedOrder = await Order.findById(id)
      .populate("customer", "fullName phoneNumber email")
      .populate("restaurant", "name address image")
      .populate("assignedAgent", "firstName lastName phone profileImage");

    return NextResponse.json(
      {
        message: "Order status updated successfully",
        order: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
