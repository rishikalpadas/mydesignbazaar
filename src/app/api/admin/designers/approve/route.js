import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import { User } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"

async function handler(request) {
  try {
    await connectDB()

    const { userId, approve = true } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (user.userType !== "designer") {
      return NextResponse.json({ error: "Target user is not a designer" }, { status: 400 })
    }

    user.isApproved = !!approve
    await user.save()

    return NextResponse.json({
      success: true,
      message: approve ? "Designer approved successfully" : "Designer approval revoked",
      user: { id: user._id, isApproved: user.isApproved },
    })
  } catch (error) {
    console.error("Approve designer error:", error)
    return NextResponse.json({ error: "Failed to update approval" }, { status: 500 })
  }
}

export const PATCH = withPermission(["manage_designers"])(handler)
export const POST = withPermission(["manage_designers"])(handler) // optional convenience
