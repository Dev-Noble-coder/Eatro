import { NextResponse } from "next/server";
import connectDb from "../../../../lib/mongodb"
import Restaurant from "../../../../lib/models/Restaurant";
import "../../../../lib/models/food";

// GET - Fetch all restaurants
export async function GET() {
  try {
    await connectDb();

    const restaurants = await Restaurant.find({})
      .populate("availableFoods.foodId")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      restaurants: restaurants.map((restaurant) => ({
        ...restaurant,
        _id: restaurant._id.toString(),
        availableFoods: restaurant.availableFoods.map((af) => ({
          ...af,
          deliveryTime: restaurant.deliveryTime,
          _id: af._id.toString(),
          foodId: af.foodId
            ? {
                ...af.foodId,
                _id: af.foodId._id.toString(),
              }
            : null,
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
}

// POST - Create a new restaurant
export async function POST(request) {
  try {
    await connectDb();

    const body = await request.json();
    const { name, description, image, deliveryTime } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Restaurant name is required" },
        { status: 400 },
      );
    }

    const restaurant = new Restaurant({
      name,
      description: description || "",
      image: image || "/api/placeholder/400/300",
      deliveryTime: deliveryTime || "",
      availableFoods: [],
      isActive: true,
    });

    await restaurant.save();

    return NextResponse.json({
      success: true,
      restaurant: {
        ...restaurant.toObject(),
        _id: restaurant._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create restaurant" },
      { status: 500 },
    );
  }
}

// PUT - Update a restaurant
export async function PUT(request) {
  try {
    await connectDb();

    const body = await request.json();
    const { _id, name, description, location, phone, image, deliveryTime, isActive } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Restaurant ID is required" },
        { status: 400 },
      );
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        location,
        phone,
        image,
        deliveryTime,
        isActive,
        updatedAt: new Date(),
      },
      { new: true },
    ).populate("availableFoods.foodId");

    if (!updatedRestaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      restaurant: {
        ...updatedRestaurant.toObject(),
        _id: updatedRestaurant._id.toString(),
        availableFoods: updatedRestaurant.availableFoods.map((af) => ({
          ...af.toObject(),
          _id: af._id.toString(),
          foodId: af.foodId
            ? {
                ...af.foodId.toObject(),
                _id: af.foodId._id.toString(),
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update restaurant" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a restaurant
export async function DELETE(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Restaurant ID is required" },
        { status: 400 },
      );
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete restaurant" },
      { status: 500 },
    );
  }
}


//  <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between mb-2">
//                       <h2 className="text-lg font-semibold text-blue-900 truncate">
//                         {r.name}
//                       </h2>
//                       <ChevronRight
//                         size={20}
//                         className="text-blue-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2"
//                       />
//                     </div>

//                     {/* Stats */}
//                     <div className="flex items-center gap-4 mb-3">
//                       <div className="flex items-center gap-1 text-sm text-blue-600/80">
//                         <Clock size={14} />
//                         <span>{r.deliveryTime}</span>
//                       </div>
//                       <div className="flex items-center gap-1 text-sm text-blue-600/80">
//                         <MapPin size={14} />
//                         <span>{r.distance}</span>
//                       </div>
//                     </div>

//                     {/* Cuisine tags - varying sizes */}
//                     <div className="flex flex-wrap gap-2">
//                       <div
//                         className={`px-3 py-1 rounded-full bg-blue-200/50 text-blue-800 text-xs font-medium `}
//                       >
//                         {r.cuisine1}
//                       </div>
//                       <div
//                         className={`px-3 py-1 rounded-full bg-blue-200/50 text-blue-800 text-xs font-medium`}
//                       >
//                         {r.cuisine2}
//                       </div>
//                       <div
//                         className={`px-3 py-1 rounded-full bg-blue-200/50 text-blue-800 text-xs font-medium`}
//                       >
//                         {r.cuisine3}
//                       </div>
//                     </div>
//                   </div>