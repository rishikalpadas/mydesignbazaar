import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/mongodb"
import { Designer, Buyer } from "@/models/User"
import { withAuth } from "@/middleware/auth"

// Admin Schema (same as in other files)
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["super_admin", "designer_admin", "buyer_admin"],
    required: true,
  },
  permissions: [
    {
      type: String,
      enum: [
        "manage_designers",
        "manage_buyers",
        "manage_designs",
        "manage_payments",
        "manage_orders",
        "view_analytics",
        "manage_admins",
        "system_settings",
      ],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

async function getProfile(request) {
  try {
    await connectDB()

    const user = request.user

    // If it's an admin user
    if (user.isAdmin) {
      const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)
      const adminData = await Admin.findById(user._id).select("-password")

      if (!adminData) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 })
      }

      const adminResponse = {
        id: adminData._id,
        email: adminData.email,
        name: adminData.name,
        userType: "admin",
        role: adminData.role,
        permissions: adminData.permissions,
        isAdmin: true,
        isActive: adminData.isActive,
        lastLogin: adminData.lastLogin,
        createdAt: adminData.createdAt,
        profile: {
          fullName: adminData.name,
          displayName: adminData.name,
        },
      }

      return NextResponse.json(
        {
          user: adminResponse,
        },
        { status: 200 },
      )
    }

    // Regular user flow
    let profile
    if (user.userType === "designer") {
      profile = await Designer.findOne({ userId: user._id })
    } else if (user.userType === "buyer") {
      profile = await Buyer.findOne({ userId: user._id })
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified,
      isApproved: user.isApproved,
      isAdmin: false,
      createdAt: user.createdAt,
      profile: profile || null,
    }

    return NextResponse.json(
      {
        user: userResponse,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(getProfile)
