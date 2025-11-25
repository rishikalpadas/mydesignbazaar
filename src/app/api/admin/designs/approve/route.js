import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import Design from "../../../../../models/Design"
import { Designer } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"

async function handler(request) {
  try {
    await connectDB()

    const { designId, isExclusive } = await request.json()
    if (!designId) {
      return NextResponse.json({ error: "designId is required" }, { status: 400 })
    }

    const design = await Design.findById(designId)
    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    design.status = "approved"
    design.rejectionReason = undefined
    design.approvalDate = new Date()
    design.approvedBy = request.user._id
    
    // Handle exclusive design - admin can mark any design as exclusive
    design.isExclusive = isExclusive === true
    
    await design.save()

    // Increment designer's approved designs count
    await Designer.findOneAndUpdate(
      { userId: design.uploadedBy },
      { $inc: { approvedDesigns: 1 } }
    )

    console.log(`[DESIGN-APPROVAL] Design ${design._id} approved. Designer approvedDesigns count incremented.`)

    return NextResponse.json({
      success: true,
      message: "Design approved successfully",
      design: { id: design._id, status: design.status, approvalDate: design.approvalDate },
    })
  } catch (error) {
    console.error("Approve design error:", error)
    return NextResponse.json({ error: "Failed to approve design" }, { status: 500 })
  }
}

export const PATCH = withPermission(["manage_designs"])(handler)
export const POST = withPermission(["manage_designs"])(handler) // optional convenience
