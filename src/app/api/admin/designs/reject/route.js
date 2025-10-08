import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import Design from "../../../../../models/Design"
import { withPermission } from "../../../../../middleware/auth"

async function handler(request) {
  try {
    await connectDB()

    const { designId, reason } = await request.json()
    if (!designId || !reason) {
      return NextResponse.json({ error: "designId and reason are required" }, { status: 400 })
    }

    const design = await Design.findByIdAndUpdate(
      designId,
      {
        status: "rejected",
        rejectionReason: reason,
        approvalDate: null,
        approvedBy: request.user._id
      },
      { new: true, runValidators: false }
    )

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Design rejected",
      design: { id: design._id, status: design.status, rejectionReason: design.rejectionReason },
    })
  } catch (error) {
    console.error("Reject design error:", error)
    return NextResponse.json({ error: "Failed to reject design" }, { status: 500 })
  }
}

export const PATCH = withPermission(["manage_designs"])(handler)
export const POST = withPermission(["manage_designs"])(handler) // optional convenience
