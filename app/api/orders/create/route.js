import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import Restaurant from "../../../../lib/models/Restaurant";
import User from "../../../../lib/models/users";

export async function POST(req) {
  try {
    await connectDB();


    const body = await req.json();
    const {
      restaurantId,
      items,
      deliveryDetails,
      pickupOption,
      assignedAgent,
      agentDetails,
      payment,
      specialInstructions,
    } = body;

    // console.log("this is the body:", body)

    // Validate required fields
    if (!restaurantId || !items || !deliveryDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate delivery email
    const deliveryEmail = deliveryDetails?.email;
    if (!deliveryEmail) {
      return NextResponse.json(
        { error: "Delivery email is required" },
        { status: 400 },
      );
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tipAmount = payment?.tipAmount || 0;
    const discountAmount = payment?.discountAmount || 0;
    const totalAmount = subtotal + tipAmount - discountAmount;

    // Get restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    // Find or create user by delivery email
    let user = await User.findOne({ email: deliveryEmail });
    if (!user) {
      user = await User.create({
        email: deliveryEmail,
        fullName: deliveryDetails?.fullName || "",
        hostel: deliveryDetails?.hostel || "",
        roomNumber: deliveryDetails?.roomNumber || "",
        phoneNumber: deliveryDetails?.phoneNumber || "",
      });
    }
    // Create order
    const orderData = {
      customer: user._id,
      restaurant: restaurantId,
      restaurantName: restaurant.name,
      items,
      deliveryDetails,
      pickupOption: pickupOption || "agent",
      assignedAgent,
      agentDetails,
      payment: {
        method: payment?.method || "transfer",
        status: "pending",
        amount: totalAmount,
        tipAmount,
        promoCode: payment?.promoCode,
        discountAmount,
      },
      subtotal,
      totalAmount,
      specialInstructions,
      status: "order_received",
    };

    const order = new Order(orderData);
    await order.save();

    // Populate the order with details
    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "fullName email phoneNumber")
      .populate("restaurant", "name address")
      .populate("assignedAgent", "firstName lastName phone");

    const secret = process.env.NEXTAUTH_SECRET || "dev_placeholder_secret";
    const jwtToken = await encode({
      token: {
        userId: user._id.toString(),
        email: user.email,
        fullName: user.fullName || "",
        hostel: user.hostel || "",
        roomNumber: user.roomNumber || "",
        phoneNumber: user.phoneNumber || "",
        role: "user",
      },
      secret,
      maxAge: 60 * 60 * 24 * 30,
    });

    const res = NextResponse.json(
      {
        message: "Order created successfully",
        order: populatedOrder,
      },
      { status: 201 },
    );

    res.cookies.set("user-token", jwtToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
