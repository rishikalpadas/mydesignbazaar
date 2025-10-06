import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import connectDB from "../../../../lib/mongodb"
import { User, Designer, Buyer } from "../../../../models/User"

// Admin Schema (same as in login route)
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

export async function GET(request) {
  try {
    await connectDB()

    // Get token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify JWT token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get or create Admin model
    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)

    // Check if user is admin
    if (decoded.userType === "admin") {
      const admin = await Admin.findById(decoded.userId)

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 })
      }

      if (!admin.isActive) {
        return NextResponse.json({ error: "Admin account is deactivated" }, { status: 403 })
      }

      const adminResponse = {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        userType: "admin",
        role: admin.role,
        permissions: admin.permissions,
        isAdmin: true,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        profile: {
          fullName: admin.name,
          displayName: admin.name,
        },
      }

      return NextResponse.json({ user: adminResponse }, { status: 200 })
    }

    // For regular users (designer/buyer)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get profile data
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
      profile: profile
        ? {
            fullName: profile.fullName,
            displayName: profile.displayName || profile.fullName,
            mobileNumber: profile.mobileNumber,
            businessType: profile.businessType, // for buyers
            specializations: profile.specializations, // for designers
            totalDesigns: profile.totalDesigns, // for designers
            totalPurchases: profile.totalPurchases, // for buyers
          }
        : null,
    }

    return NextResponse.json({ user: userResponse }, { status: 200 })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
