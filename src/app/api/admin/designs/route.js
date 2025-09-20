import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb";
import Design from "../../../../models/Design"
import { withPermission } from "../../../../middleware/auth"

async function handler(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 12
    const status = searchParams.get("status") || "approved"
    const sortBy = searchParams.get("sortBy") || "newest"
    const search = searchParams.get("search") || ""

    // Build query
    const query = {}

    // Filter by status (default to approved designs)
    if (status !== "all") {
      query.status = status
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort options
    let sortOptions = {}
    switch (sortBy) {
      case "oldest":
        sortOptions = { createdAt: 1 }
        break
      case "mostViewed":
        sortOptions = { views: -1 }
        break
      case "mostDownloaded":
        sortOptions = { downloads: -1 }
        break
      case "title":
        sortOptions = { title: 1 }
        break
      default: // newest
        sortOptions = { createdAt: -1 }
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalDesigns = await Design.countDocuments(query)
    const totalPages = Math.ceil(totalDesigns / limit)

    // Fetch designs with pagination
    const designs = await Design.find(query)
      .populate("uploadedBy", "profile.fullName email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    // Calculate stats
    const stats = await Design.aggregate([
      {
        $group: {
          _id: null,
          totalDesigns: { $sum: 1 },
          approvedDesigns: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          pendingDesigns: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          rejectedDesigns: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          totalViews: { $sum: "$views" },
          totalDownloads: { $sum: "$downloads" },
        },
      },
    ])

    const designStats = stats[0] || {
      totalDesigns: 0,
      approvedDesigns: 0,
      pendingDesigns: 0,
      rejectedDesigns: 0,
      totalViews: 0,
      totalDownloads: 0,
    }

    return NextResponse.json({
      success: true,
      designs,
      stats: designStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalDesigns,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Fetch designs error:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  }
}

export const GET = withPermission(["manage_designs"])(handler)
