import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import { User, Designer } from "../../../../../models/User"
import { withPermission } from "../../../../../middleware/auth"
import { sendRejectionNotificationEmail } from "../../../../../lib/emailTemplates"

async function handler(request) {
  try {
    await connectDB()

    const { userId, rejectionReason } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      return NextResponse.json({ error: "Rejection reason is required (minimum 10 characters)" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (user.userType !== "designer") {
      return NextResponse.json({ error: "Target user is not a designer" }, { status: 400 })
    }

    // Get designer info for email before deletion
    const designer = await Designer.findOne({ userId })
    const designerName = designer?.fullName || designer?.displayName || user.email
    const designerEmail = user.email

    // Delete the designer profile and user account
    await Designer.deleteOne({ userId: userId })
    await User.deleteOne({ _id: userId })

    // Send rejection notification email (non-blocking - don't fail if email fails)
    sendRejectionNotificationEmail({
      email: designerEmail,
      designerName: designerName,
      rejectionReason: rejectionReason.trim(),
    }).catch(emailError => {
      console.error('Failed to send rejection notification email:', emailError);
      // Continue anyway - email failure shouldn't block the operation
    });

    return NextResponse.json({
      success: true,
      message: "Designer application rejected and notification sent successfully",
    })
  } catch (error) {
    console.error("Reject designer error:", error)
    return NextResponse.json({ error: "Failed to reject designer" }, { status: 500 })
  }
}

export const PATCH = withPermission(["manage_designers"])(handler)
export const POST = withPermission(["manage_designers"])(handler)