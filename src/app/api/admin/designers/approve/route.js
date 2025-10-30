import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import { User, Designer } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"
import { sendApprovalWelcomeEmail } from "../../../../../lib/emailTemplates"

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

    const wasApproved = user.isApproved
    user.isApproved = !!approve
    await user.save()

    // Send welcome email only when approving (not when revoking) and if not already approved
    if (approve && !wasApproved) {
      // Get designer profile for full name
      const designer = await Designer.findOne({ userId: user._id })
      const designerName = designer?.fullName || designer?.displayName || 'Designer'

      // Send email in background (non-blocking)
      sendApprovalWelcomeEmail({
        email: user.email,
        designerName: designerName,
      }).catch(emailError => {
        console.error('Failed to send approval welcome email:', emailError)
        // Continue anyway - email failure shouldn't block the approval
      })
    }

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
