import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import Design from "../../../../../models/Design"
import { Designer } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"

async function handler(request) {
  try {
    await connectDB()

    const { designId, reason } = await request.json()
    if (!designId || !reason) {
      return NextResponse.json({ error: "designId and reason are required" }, { status: 400 })
    }

    // Get design before update to check if it was approved
    const designBefore = await Design.findById(designId)
    if (!designBefore) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const wasApproved = designBefore.status === "approved"

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

    // If design was previously approved, decrement designer's approved count
    if (wasApproved) {
      await Designer.findOneAndUpdate(
        { userId: design.uploadedBy },
        { $inc: { approvedDesigns: -1 } }
      )
      console.log(`[DESIGN-REJECTION] Previously approved design ${design._id} rejected. Designer approvedDesigns count decremented.`)
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
