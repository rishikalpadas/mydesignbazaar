import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Design from "@/models/Design"

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params
    const design = await Design.findById(id)
      .populate("uploadedBy", "profile.fullName email")
      .populate("approvedBy", "profile.fullName email")
      .lean()

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    // Add image URLs
    if (design.previewImages && design.previewImages.length > 0) {
      design.previewImageUrls = design.previewImages.map((img) => ({
        ...img,
        url: `/api/uploads/designs/${design._id}/preview/${img.filename}`,
      }))
      const primary = design.previewImages.find((img) => img.isPrimary) || design.previewImages[0]
      design.previewImageUrl = `/api/uploads/designs/${design._id}/preview/${primary.filename}`
    }

    return NextResponse.json({
      success: true,
      design,
    })
  } catch (error) {
    console.error("Fetch design error:", error)
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 })
  }
}
