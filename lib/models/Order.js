import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ["spoon", "wrap", "plate", "bowl", "other"],
      default: "plate",
    },
  },
  { _id: true },
);

const orderStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "order_received",
      "payment_confirmed",
      "kitchen_preparing",
      "on_the_way",
      "delivered",
      "cancelled",
    ],
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notes: {
    type: String,
    trim: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    deliveryDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
      roomNumber: {
        type: String,
        required: true,
        trim: true,
      },
      hostel: {
        type: String,
        required: true,
        trim: true,
      },
      deliveryNotes: {
        type: String,
        trim: true,
      },
    },
    pickupOption: {
      type: String,
      enum: ["self", "agent", "delivery"],
      default: "agent",
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      index: true,
    },
    agentDetails: {
      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
      },
      agentName: String,
      agentPhone: String,
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      amount: {
        type: Number,
        required: true,
      },
      tipAmount: {
        type: Number,
        default: 0,
      },
      promoCode: String,
      discountAmount: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: [
        "order_received",
        "payment_confirmed",
        "kitchen_preparing",
        "on_the_way",
        "delivered",
        "cancelled",
      ],
      default: "order_received",
      index: true,
    },
    statusHistory: [orderStatusHistorySchema],
    estimatedDeliveryTime: {
      type: Date,
    },
    actualDeliveryTime: {
      type: Date,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    rating: {
      stars: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      ratedAt: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for formatted order status
orderSchema.virtual("statusText").get(function () {
  const statusMap = {
    order_received: "Order Received",
    payment_confirmed: "Payment Confirmed",
    kitchen_preparing: "Kitchen Preparing",
    on_the_way: "On The Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return statusMap[this.status] || this.status;
});

// Virtual for estimated time remaining
orderSchema.virtual("estimatedTimeRemaining").get(function () {
  if (this.status === "delivered" || this.status === "cancelled") {
    return 0;
  }

  const now = new Date();
  if (this.estimatedDeliveryTime) {
    return Math.max(0, Math.ceil((this.estimatedDeliveryTime - now) / 60000));
  }

  // Default estimates based on status
  const estimates = {
    order_received: 45,
    payment_confirmed: 40,
    kitchen_preparing: 25,
    on_the_way: 15,
  };
  return estimates[this.status] || 30;
});

// Pre-validate middleware to generate order number
orderSchema.pre("validate", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Get count of orders today for sequential number
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const count = await mongoose.models.Order.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    const sequential = (count + 1).toString().padStart(4, "0");
    this.orderNumber = `ORD${year}${month}${day}${sequential}`;
  }

  // Initialize status history if new
  if (this.isNew) {
    this.statusHistory = [
      {
        status: this.status,
        updatedAt: new Date(),
        notes: "Order created",
      },
    ];
  }

});





orderSchema.methods.updateStatus = async function (newStatus, updatedBy, notes) {
  this.status = newStatus;
  this.statusHistory.push({ status: newStatus, updatedAt: new Date(), updatedBy, notes });
  await this.save();
  return this;
};

orderSchema.methods.assignAgent = async function (agentId, agentDetails) {
  this.assignedAgent = agentId;
  this.agentDetails = { ...this.agentDetails, ...agentDetails, agentId };
  await this.save();
  return this;
};

// Indexes for better query performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ assignedAgent: 1, status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "deliveryDetails.hostel": 1, status: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
