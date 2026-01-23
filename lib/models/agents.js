import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
    },
    temporaryPassword: {
      type: String,
      select: false,
      default: null,
    },
    temporaryPasswordCreatedAt: {
      type: Date,
      select: false,
      default: null,
    },
    
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^(\+\d{1,3})?(\d{10,})$/, "Invalid phone number"],
    },

    // Student Information
    matricNumber: {
      type: String,
      required: [true, "Matric number is required"],
      unique: true,
    },
    level: {
      type: String,
      enum: ["100", "200", "300", "400"],
      required: [true, "Level is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    hostel: {
      type: String,
      enum: ["Hostel A", "Hostel B", "Hostel C", "Hostel D"],
      required: [true, "Hostel is required"],
    },
    profileImage: {
      type: String,
      required: false,
    },

    bankName: {
      type: String,
      required: [true, "Bank name is required"],
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      match: [/^\d{10}$/, "Account number must be 10 digits"],
    },
    accountName: {
      type: String,
      required: [true, "Account name is required"],
    },
    bankCode: {
      type: String,
      required: [true, "Bank code is required"],
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationNotes: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: false,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    agreedToTerms: {
      type: Boolean,
      required: [true, "Must agree to terms"],
      default: false,
    },
    termsAcceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

agentSchema.index({ firstName: "text", lastName: "text", email: "text" });

// Index for verification status
agentSchema.index({ verificationStatus: 1 });

// Index for active agents
agentSchema.index({ isActive: 1 });

export default mongoose.models.Agent || mongoose.model("Agent", agentSchema);
