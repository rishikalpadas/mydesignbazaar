import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "../lib/mongodb"
import { User } from "../models/User"

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

export async function verifyToken(request) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return { error: "No token provided", status: 401 }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    await connectDB()

    let user

    // Check if it's an admin token
    if (decoded.userType === "admin") {
      const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)
      user = await Admin.findById(decoded.userId).select("-password")

      if (!user) {
        return { error: "Admin not found", status: 401 }
      }

      // Add admin-specific properties
      user = {
        ...user.toObject(),
        userType: "admin",
        isAdmin: true,
      }
    } else {
      // Regular user
      user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return { error: "User not found", status: 401 }
      }

      user = {
        ...user.toObject(),
        isAdmin: false,
      }
    }

    return { user, decoded }
  } catch (error) {
    console.error("Token verification error:", error)
    return { error: "Invalid token", status: 401 }
  }
}

// Middleware for protected API routes
export function withAuth(handler) {
  return async (request, context) => {
    const authResult = await verifyToken(request)

    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    // Add user info to request
    request.user = authResult.user
    request.decoded = authResult.decoded

    return handler(request, context)
  }
}

// Role-based access control
export function withRole(roles) {
  return (handler) =>
    withAuth(async (request, context) => {
      const userType = request.user.userType

      if (!roles.includes(userType)) {
        return NextResponse.json({ error: "Access denied. Insufficient permissions." }, { status: 403 })
      }

      return handler(request, context)
    })
}

// Admin permission-based access control
export function withPermission(requiredPermissions) {
  return (handler) =>
    withAuth(async (request, context) => {
      const user = request.user

      // If not admin, deny access
      if (!user.isAdmin) {
        return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 })
      }

      // Check if admin has required permissions
      const hasPermission = requiredPermissions.some(
        (permission) => user.permissions && user.permissions.includes(permission),
      )

      if (!hasPermission) {
        return NextResponse.json({ error: "Access denied. Insufficient permissions." }, { status: 403 })
      }

      return handler(request, context)
    })
}
