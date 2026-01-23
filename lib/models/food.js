import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  type: {
    type: String,
    enum: {
      values: ["spoon", "wrap"],
      message: 'Type must be either "spoon" or "wrap"',
    },
    default: "spoon",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
foodSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
});

// Update the updatedAt field on findOneAndUpdate
foodSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
});

const Food =
  mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;
