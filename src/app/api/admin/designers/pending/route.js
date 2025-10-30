import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import { User, Designer } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"

async function handler() {
  try {
    await connectDB()

    const users = await User.find({ userType: "designer", isApproved: false }).select("_id email createdAt").lean()

    // Calculate stats
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const totalDesigners = await User.countDocuments({ userType: "designer" })
    const pendingCount = users.length
    const thisWeekCount = users.filter(u => new Date(u.createdAt) >= oneWeekAgo).length

    const stats = {
      total: totalDesigners,
      pending: pendingCount,
      thisWeek: thisWeekCount,
    }

    // Fetch designer profiles with all details, ONLY pending (not blocked, not deleted)
    const userIds = users.map((u) => u._id)
    const profiles = await Designer.find({
      userId: { $in: userIds },
      $or: [
        { accountStatus: { $exists: false } }, // Old records without status field
        { accountStatus: 'active' } // Explicitly active but not approved yet
      ]
    }).lean()

    const profileByUser = new Map(profiles.map((p) => [String(p.userId), p]))

    // Only include users with truly pending profiles (not blocked, not deleted)
    const result = users
      .filter((u) => profileByUser.has(String(u._id)))
      .map((u) => {
        const p = profileByUser.get(String(u._id))
        return {
          id: u._id,
          email: u.email,
          createdAt: u.createdAt,
          profile: p || null,
        }
      })

    // Update stats to reflect actual pending count (after filtering)
    const actualPendingCount = result.length
    const updatedStats = {
      ...stats,
      pending: actualPendingCount,
      thisWeek: result.filter(r => new Date(r.createdAt) >= oneWeekAgo).length
    }

    return NextResponse.json({ success: true, designers: result, stats: updatedStats })
  } catch (error) {
    console.error("List pending designers error:", error)
    return NextResponse.json({ error: "Failed to list pending designers" }, { status: 500 })
  }
}

export const GET = withPermission(["manage_designers"])(handler)
