import { NextResponse } from "next/server";
import connectDb from "../../../../lib/mongodb"; 
import Food from "../../../../lib/models/food";

export async function POST(request) {
  try {
    await connectDb();

    const body = await request.json();
    const { name, price, type } = body;


    // Validation
    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "Name and price are required" },
        { status: 400 },
      );
    }

    if (!["spoon", "wrap"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Type must be either spoon or wrap" },
        { status: 400 },
      );
    }

    // Check if product already exists
    const existingFood = await Food.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      type,
    });

    if (existingFood) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with this name and type already exists",
        },
        { status: 400 },
      );
    }

    // Create new product
    const food = await Food.create({
      name,
      price: price,
      type,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Food created successfully",
        food,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Food error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create Food" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDb();

    const body = await request.json();
    const { _id, name, price, type } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required for update" },
        { status: 400 },
      );
    }

    // Find and update product
    const product = await Product.findByIdAndUpdate(
      _id,
      {
        name,
        price: parseFloat(price),
        type,
      },
      { new: true, runValidators: true },
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update product" },
      { status: 500 },
    );
  }
}

// Optional: Add GET method to fetch all products
export async function GET() {
  try {
    await connectDb();

    const foods = await Food.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error("Fetch foods error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch foods" },
      { status: 500 },
    );
  }
}
