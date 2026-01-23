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
    const { status, transactionId } = body;

    const allowedStatuses = ["pending", "completed", "failed"];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 400 },
      );
    }


      const order = await Order.findById(id);
      
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 },
      );
    }

    const isAdmin = token.role === "admin";
    const isAgent = token.role === "agent";
    const isAssignedAgent = order.assignedAgent?.toString() === token.userId;

    if (!(isAdmin || (isAgent && isAssignedAgent))) {
      return NextResponse.json(
        { error: "Access denied to update payment status" },
        { status: 403 },
      );
    }

    const validTransitions = {
      pending: ["completed", "failed"],
      completed: [],
      failed: ["pending"],
    };

    const current = order.payment?.status || "pending";
    if (!validTransitions[current]?.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid payment status transition from ${current} to ${status}`,
        },
        { status: 400 },
      );
    }

    order.payment = {
      ...order.payment,
      status,
      transactionId: transactionId ?? order.payment?.transactionId,
    };
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("customer", "fullName phoneNumber email")
      .populate("restaurant", "name address image")
      .populate("assignedAgent", "firstName lastName phone profileImage");

    return NextResponse.json(
      {
        message: "Payment status updated successfully",
        order: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment update error:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 },
    );
  }
}