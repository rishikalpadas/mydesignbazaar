import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "../../../../lib/mongodb"
import ProfilePicture from "../../../../models/ProfilePicture"
import { verifyToken } from "../../../../middleware/auth"

// Admin Schema (same as in user/profile/route.js)
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
  profile_pic: {
    type: String,
    default: null,
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

// GET - Fetch admin profile
export async function GET(request) {
  try {
    await connectDB()

    const authResult = await verifyToken(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      )
    }

    const userId = authResult.decoded.userId

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)
    const admin = await Admin.findById(userId).select("-password")

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      )
    }

    // Fetch profile picture from ProfilePicture collection
    const profilePicture = await ProfilePicture.findOne({ userId });

    return NextResponse.json({
      success: true,
      profile: {
        email: admin.email,
        name: admin.name,
        profile_pic: profilePicture ? profilePicture.imageUrl : (admin.profile_pic || null),
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
      }
    })

  } catch (error) {
    console.error("Error fetching admin profile:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT - Update admin profile
export async function PUT(request) {
  try {
    await connectDB()

    const authResult = await verifyToken(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      )
    }

    const userId = authResult.decoded.userId
    const body = await request.json()

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)
    const admin = await Admin.findById(userId)

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      )
    }

    // Update fields
    const { profile } = body

    if (profile) {
      if (profile.name) admin.name = profile.name
      // Note: profile_pic is now stored in ProfilePicture collection, not in admin document
    }

    admin.updatedAt = Date.now()
    await admin.save()

    // Fetch current profile picture
    const profilePicture = await ProfilePicture.findOne({ userId });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: admin.name,
        profile_pic: profilePicture ? profilePicture.imageUrl : null,
      }
    })

  } catch (error) {
    console.error("Error updating admin profile:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    )
  }
}
