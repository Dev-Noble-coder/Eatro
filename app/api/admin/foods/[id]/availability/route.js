import { NextResponse } from "next/server";
import connectDb from "../../../../../../lib/mongodb";
import Restaurant from "../../../../../../lib/models/Restaurant";
import Food from "../../../../../../lib/models/food";

export async function PUT(request, { params }) {
  try {
    await connectDb();

    // Await the params to unwrap the Promise
    const { id } = await params;
    const body = await request.json();
    const { restaurantId, isAvailable } = body;

    // Validate required fields
    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: "Restaurant ID is required in request body" },
        { status: 400 },
      );
    }

    if (typeof isAvailable !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isAvailable must be a boolean value" },
        { status: 400 },
      );
    }

    // Use the id from params as foodId
    const foodId = id;
    const food = await Food.findById(foodId);
    if (!food) {
      return NextResponse.json(
        { success: false, error: "Food item not found" },
        { status: 404 },
      );
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 },
      );
    }

    // Check if food is already in restaurant's availableFoods
    const existingFoodIndex = restaurant.availableFoods.findIndex(
      (af) => af.foodId.toString() === foodId,
    );

    if (existingFoodIndex >= 0) {
      // Update existing entry
      restaurant.availableFoods[existingFoodIndex].isAvailable = isAvailable;
      restaurant.availableFoods[existingFoodIndex].updatedAt = new Date();
    } else {
      // Add new entry if it doesn't exist
      restaurant.availableFoods.push({
        foodId: foodId,
        isAvailable: isAvailable,
        updatedAt: new Date(),
      });
    }

    // Save the restaurant
    await restaurant.save();

    // Populate food details for response
    const updatedRestaurant = await Restaurant.findById(restaurantId)
      .populate("availableFoods.foodId")
      .lean();

    // Find the updated food entry
    const updatedFoodEntry = updatedRestaurant.availableFoods.find(
      (af) => af.foodId._id.toString() === foodId,
    );

    return NextResponse.json({
      success: true,
      message: `Food availability updated to ${isAvailable ? "available" : "unavailable"}`,
      data: {
        restaurantId: restaurantId,
        foodId: foodId,
        isAvailable: isAvailable,
        food: {
          _id: food._id.toString(),
          name: food.name,
          price: food.price,
          type: food.type,
        },
        restaurant: {
          _id: updatedRestaurant._id.toString(),
          name: updatedRestaurant.name,
          availableFoods: updatedRestaurant.availableFoods.map((af) => ({
            foodId: af.foodId._id.toString(),
            name: af.foodId.name,
            isAvailable: af.isAvailable,
            updatedAt: af.updatedAt,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Error updating food availability:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update food availability",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Optional: GET endpoint to check availability status for a specific food in a restaurant
export async function GET(request, { params }) {
  try {
    await connectDb();

    // Await the params to unwrap the Promise
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant ID is required as query parameter",
        },
        { status: 400 },
      );
    }

    // Use the id from params as foodId
    const foodId = id;
    const food = await Food.findById(foodId);
    if (!food) {
      return NextResponse.json(
        { success: false, error: "Food item not found" },
        { status: 404 },
      );
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 },
      );
    }

    // Find the food in restaurant's availableFoods
    const foodEntry = restaurant.availableFoods.find(
      (af) => af.foodId.toString() === foodId,
    );

    const isAvailable = foodEntry ? foodEntry.isAvailable : false;
    const hasCustomSetting = foodEntry !== undefined;

    return NextResponse.json({
      success: true,
      data: {
        restaurantId: restaurantId,
        foodId: foodId,
        isAvailable: isAvailable,
        hasCustomSetting: hasCustomSetting,
        food: {
          _id: food._id.toString(),
          name: food.name,
          price: food.price,
          type: food.type,
        },
        restaurant: {
          _id: restaurant._id.toString(),
          name: restaurant.name,
        },
        lastUpdated: foodEntry?.updatedAt || null,
      },
    });
  } catch (error) {
    console.error("Error checking food availability:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check food availability",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Optional: DELETE endpoint to remove food from restaurant's availability list
export async function DELETE(request, { params }) {
  try {
    await connectDb();

    // Await the params to unwrap the Promise
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant ID is required as query parameter",
        },
        { status: 400 },
      );
    }

    // Use the id from params as foodId
    const foodId = id;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 },
      );
    }

    // Find and remove the food from availableFoods
    const initialLength = restaurant.availableFoods.length;
    restaurant.availableFoods = restaurant.availableFoods.filter(
      (af) => af.foodId.toString() !== foodId,
    );

    if (initialLength === restaurant.availableFoods.length) {
      // Food wasn't in the list
      return NextResponse.json({
        success: true,
        message: "Food was not in the restaurant availability list",
        data: {
          restaurantId: restaurantId,
          foodId: foodId,
          removed: false,
        },
      });
    }

    await restaurant.save();

    return NextResponse.json({
      success: true,
      message: "Food removed from restaurant availability list",
      data: {
        restaurantId: restaurantId,
        foodId: foodId,
        removed: true,
        restaurant: {
          _id: restaurant._id.toString(),
          name: restaurant.name,
          availableFoodsCount: restaurant.availableFoods.length,
        },
      },
    });
  } catch (error) {
    console.error("Error removing food availability:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove food availability",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
