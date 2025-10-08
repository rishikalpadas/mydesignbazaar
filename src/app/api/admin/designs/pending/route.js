import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import Design from "../../../../../models/Design"
import { withPermission } from "../../../../../middleware/auth"

async function handler() {
  try {
    await connectDB()

    const designs = await Design.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .select("_id designId title category createdAt previewImage previewImages rawFile rawFiles uploadedBy")
      .populate("uploadedBy", "email")
      .lean()

    const result = designs.map((d) => {
      const designIdToUse = d.designId || d._id

      // Map preview images
      const previewImageUrls = (d.previewImages || []).map((preview, idx) => ({
        url: `/api/uploads/designs/${designIdToUse}/preview/${preview.filename}`,
        originalName: preview.originalName || preview.filename,
        isPrimary: preview.isPrimary || idx === 0,
      }))

      // Map raw files
      const rawFileUrls = (d.rawFiles || (d.rawFile ? [d.rawFile] : [])).map((raw) => ({
        url: `/api/uploads/designs/${designIdToUse}/raw/${raw.filename}`,
        originalName: raw.originalName || raw.filename,
        size: raw.size,
        fileType: raw.fileType,
      }))

      return {
        id: d._id,
        designId: designIdToUse,
        title: d.title,
        category: d.category,
        createdAt: d.createdAt,
        previewImageUrl: previewImageUrls[0]?.url || null,
        previewImageUrls,
        rawFileUrls,
        rawFileUrl: rawFileUrls[0]?.url || null,
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
