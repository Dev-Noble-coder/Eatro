import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Order from "../../../../../lib/models/Order";
import User from "../../../../../lib/models/users";
import { getToken } from "next-auth/jwt";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 },
      );
    }

    // Verify agent exists and is actually an agent
    const agent = await User.findOne({
      _id: agentId,
      role: "agent",
      isActive: true,
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found or inactive" },
        { status: 404 },
      );
    }

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is ready for agent assignment
    if (order.status !== "kitchen_preparing") {
      return NextResponse.json(
        {
          error:
            "Order must be in 'kitchen_preparing' status before assigning agent",
        },
        { status: 400 },
      );
    }

    // Prepare agent details
    const agentDetails = {
      agentId: agent._id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      agentPhone: agent.phone,
    };

    // Assign agent
    await order.assignAgent(agentId, agentDetails);

    // Get updated order
    const updatedOrder = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("restaurant", "name address")
      .populate("assignedAgent", "firstName lastName phone");

    return NextResponse.json(
      {
        message: "Agent assigned successfully",
        order: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Agent assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign agent" },
      { status: 500 },
    );
  }
}
