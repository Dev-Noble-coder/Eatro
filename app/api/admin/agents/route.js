import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Agent from "../../../../lib/models/agents";
import bcrypt from "bcryptjs"
import crypto from "crypto";

const generateRandomPassword = (length = 12) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*";
  const buffer = crypto.randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[buffer[i] % chars.length];
  }
  return password;
};

// GET - Fetch all agents with filters
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    let filter = {};

    if (status) {
      filter.verificationStatus = status;
    }

    if (isActive !== null) {
      filter.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    const agents = await Agent.find(filter)
      .select("-idNumber") // Don't return sensitive data
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Agent.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        data: agents,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          limit,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - Create/Register new agent
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "matricNumber",
      "level",
      "gender",
      "hostel",
      "bankName",
      "accountNumber",
      "accountName",
      "bankCode",
      "agreedToTerms",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Check if email already exists
    const existingEmail = await Agent.findOne({ email: body.email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 },
      );
    }

    // Check if matric number already exists
    const existingMatric = await Agent.findOne({
      matricNumber: body.matricNumber,
    });
    if (existingMatric) {
      return NextResponse.json(
        { success: false, error: "Matric number already registered" },
        { status: 400 },
      );
    }

    // Create new agent
    const plainPassword = generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const agent = new Agent({
      ...body,
      password: hashedPassword,
      temporaryPassword: plainPassword,
      temporaryPasswordCreatedAt: new Date(),
      termsAcceptedAt: new Date(),
      verificationStatus: "pending",
    });

    await agent.save();

    return NextResponse.json(
      {
        success: true,
        message: "Agent registered successfully",
        data: {
          id: agent._id,
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          temporaryPassword: plainPassword,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT - Update agent information
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { agentId, ...updateData } = body;

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: "Agent ID is required" },
        { status: 400 },
      );
    }

    const restrictedFields = [
      "matricNumber",
      "email",
      "verificationStatus",
      "onboardingCompleted",
    ];
    restrictedFields.forEach((field) => delete updateData[field]);

    const agent = await Agent.findByIdAndUpdate(agentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Agent updated successfully", data: agent },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Update verification status or payment verification
export async function PATCH(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { agentId, verificationStatus, paymentVerified, proofOfPayment } =
      body;

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: "Agent ID is required" },
        { status: 400 },
      );
    }

    const updateData = {};

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus;
      if (verificationStatus === "verified") {
        updateData.isActive = true;
        updateData.onboardingCompleted = true;
      }
    }

    if (paymentVerified !== undefined) {
      updateData.paymentVerified = paymentVerified;
    }

    if (proofOfPayment) {
      updateData.profileImage = profileImage;
    }

    const agent = await Agent.findByIdAndUpdate(agentId, updateData, {
      new: true,
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Agent verification status updated",
        data: agent,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Deactivate agent (soft delete)
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("id");

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: "Agent ID is required" },
        { status: 400 },
      );
    }

    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { isActive: false },
      { new: true },
    );

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Agent deactivated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
