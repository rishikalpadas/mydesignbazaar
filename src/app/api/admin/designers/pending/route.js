import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import { User, Designer } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"

async function handler() {
  try {
    await connectDB()

    const users = await User.find({ userType: "designer", isApproved: false }).select("_id email createdAt").lean()

    // Fetch designer profiles
    const userIds = users.map((u) => u._id)
    const profiles = await Designer.find({ userId: { $in: userIds } })
      .select("userId fullName mobileNumber displayName")
      .lean()

    const profileByUser = new Map(profiles.map((p) => [String(p.userId), p]))

    const result = users.map((u) => {
      const p = profileByUser.get(String(u._id))
      return {
        id: u._id,
        email: u.email,
        createdAt: u.createdAt,
        profile: p
          ? {
              fullName: p.fullName,
              displayName: p.displayName || p.fullName,
              mobileNumber: p.mobileNumber,
            }
          : null,
      }
    })

    return NextResponse.json({ success: true, designers: result })
  } catch (error) {
    console.error("List pending designers error:", error)
    return NextResponse.json({ error: "Failed to list pending designers" }, { status: 500 })
  }
}

export const GET = withPermission(["manage_designers"])(handler)
