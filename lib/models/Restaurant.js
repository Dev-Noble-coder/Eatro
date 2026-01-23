import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    deliveryTime: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "/api/placeholder/400/300",
    },
    // Array of foods available in this restaurant with their availability status
    availableFoods: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", RestaurantSchema);
