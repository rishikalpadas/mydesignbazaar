import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import connectDB from "../../../../lib/mongodb"
import { User, Designer, Buyer } from "../../../../models/User"

// Admin Schema (same as in setup route)
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

export async function POST(request) {
  try {
    // Validate critical environment variables
    if (!process.env.JWT_SECRET) {
      console.error('[LOGIN] JWT_SECRET environment variable is not set!')
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (!process.env.MONGODB_URI) {
      console.error('[LOGIN] MONGODB_URI environment variable is not set!')
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    console.log('[LOGIN] Environment check passed. NODE_ENV:', process.env.NODE_ENV)
    
    await connectDB()

    const { email, password, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const emailLower = email.toLowerCase()

    // Determine session duration based on rememberMe
    const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60 // 7 days or 1 day
    const jwtExpiry = rememberMe ? "7d" : "1d"

    // Get or create Admin model
    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)

    // First, check if it's an admin login
    const admin = await Admin.findOne({ email: emailLower })

    if (admin) {
      // Admin login flow
      const isPasswordValid = await bcrypt.compare(password, admin.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Check if admin account is active
      if (!admin.isActive) {
        return NextResponse.json({ error: "Admin account is deactivated" }, { status: 403 })
      }

      // Update last login
      admin.lastLogin = new Date()
      await admin.save()

      // Generate JWT token for admin
      const token = jwt.sign(
        {
          userId: admin._id,
          email: admin.email,
          userType: "admin",
          role: admin.role,
          permissions: admin.permissions,
        },
        process.env.JWT_SECRET,
        { expiresIn: jwtExpiry },
      )

      // Prepare admin response data
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

      // Create response with HTTP-only cookie
      const response = NextResponse.json(
        {
          message: "Admin login successful",
          user: adminResponse,
        },
        { status: 200 },
      )

      // Set HTTP-only cookie for token with enhanced production settings
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from 'strict' to 'lax' for production compatibility
        maxAge: sessionDuration, // Dynamic: 1 day or 7 days based on rememberMe
        path: "/",
      }

      // Add domain for production if needed
      if (process.env.NODE_ENV === "production" && process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN
      }

      response.cookies.set("auth-token", token, cookieOptions)

      console.log('[LOGIN] Admin login successful for:', admin.email)
      console.log('[LOGIN] Cookie set with options:', JSON.stringify(cookieOptions))
      console.log('[LOGIN] NODE_ENV:', process.env.NODE_ENV)
      return response
    }

    // If not admin, check regular users
    const user = await User.findOne({ email: emailLower })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password for regular user
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.userType === "designer" && !user.isApproved) {
      return NextResponse.json(
        { error: "Your designer application is under review. Please wait for admin approval." },
        { status: 403 },
      )
    }

    // Get profile data for regular users
    let profile
    if (user.userType === "designer") {
      profile = await Designer.findOne({ userId: user._id })
    } else if (user.userType === "buyer") {
      profile = await Buyer.findOne({ userId: user._id })
    }

    // Generate JWT token for regular user
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: jwtExpiry },
    )

    // Prepare regular user response data
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

    // Create response with HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 },
    )

    // Set HTTP-only cookie for token with enhanced production settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from 'strict' to 'lax' for production compatibility
      maxAge: sessionDuration, // Dynamic: 1 day or 7 days based on rememberMe
      path: "/",
    }

    // Add domain for production if needed
    if (process.env.NODE_ENV === "production" && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN
    }

    response.cookies.set("auth-token", token, cookieOptions)

    console.log('[LOGIN] User login successful for:', user.email, 'type:', user.userType)
    console.log('[LOGIN] Cookie set with options:', JSON.stringify(cookieOptions))
    console.log('[LOGIN] NODE_ENV:', process.env.NODE_ENV)
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
