import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import Design from "../../../../../models/Design"
import { withPermission } from "../../../../../middleware/auth"

async function handler() {
  try {
    await connectDB()

    const designs = await Design.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .select("_id designId title category createdAt previewImage previewImages uploadedBy")
      .populate("uploadedBy", "email")
      .lean()

    const result = designs.map((d) => {
      const designIdToUse = d.designId || d._id
      return {
        id: d._id,
        title: d.title,
        category: d.category,
        createdAt: d.createdAt,
        previewImageUrl: d.previewImage
          ? `/api/uploads/designs/${designIdToUse}/preview/${d.previewImage.filename}`
          : (d.previewImages && d.previewImages.length > 0)
            ? `/api/uploads/designs/${designIdToUse}/preview/${d.previewImages[0].filename}`
            : null,
        uploadedBy: {
          email: d.uploadedBy?.email || "Unknown",
        },
      }
    })

    return NextResponse.json({ success: true, designs: result })
  } catch (error) {
    console.error("List pending designs error:", error)
    return NextResponse.json({ error: "Failed to list pending designs" }, { status: 500 })
  }
}

export const GET = withPermission(["manage_designs"])(handler)
