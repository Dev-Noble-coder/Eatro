import { NextResponse } from "next/server";
import connectDb from "../../../../../lib/mongodb";

import Restaurant from "../../../../../lib/models/Restaurant";
import "../../../../../lib/models/food";

export async function GET(request, { params }) {
  try {
    await connectDb();

    const { id } = await params;

    const restaurant = await Restaurant.findById(id)
      .populate("availableFoods.foodId")
      .lean();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      restaurant: {
        ...restaurant,
        _id: restaurant._id.toString(),
        availableFoods: restaurant.availableFoods.map((af) => ({
          ...af,
          _id: af._id.toString(),
          foodId: af.foodId
            ? {
                ...af.foodId,
                _id: af.foodId._id.toString(),
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurant" },
      { status: 500 },
    );
  }
}
