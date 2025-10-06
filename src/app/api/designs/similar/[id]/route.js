import { NextResponse } from "next/server"
import connectDB from "../../../../../lib/mongodb"
import Design from "../../../../../models/Design"

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    // Get the current design to extract its tags and category
    const currentDesign = await Design.findById(id).lean()

    if (!currentDesign) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    // Build query to find similar designs
    const query = {
      _id: { $ne: id }, // Exclude current design
      status: "approved", // Only show approved designs
      $or: []
    }

    // Add tag-based similarity (if tags exist)
    if (currentDesign.tags && currentDesign.tags.length > 0) {
      query.$or.push({
        tags: { $in: currentDesign.tags }
      })
    }

    // Add category-based similarity
    query.$or.push({
      category: currentDesign.category
    })

    // If no tags and no category match criteria, return empty
    if (query.$or.length === 0) {
      return NextResponse.json({
        success: true,
        designs: []
      })
    }

    // Fetch similar designs (limit to 12)
    const similarDesigns = await Design.find(query)
      .select('_id designId title description category tags previewImages previewImage views downloads')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean()

    // Add image URLs
    const designsWithUrls = similarDesigns.map(design => {
      const designIdToUse = design.designId || design._id

      if (design.previewImages && design.previewImages.length > 0) {
        design.previewImageUrls = design.previewImages.map(img => ({
          ...img,
          url: `/api/uploads/designs/${designIdToUse}/preview/${img.filename}`
        }))
        const primary = design.previewImages.find(img => img.isPrimary) || design.previewImages[0]
        design.previewImageUrl = `/api/uploads/designs/${designIdToUse}/preview/${primary.filename}`
      } else if (design.previewImage) {
        design.previewImageUrl = `/api/uploads/designs/${designIdToUse}/preview/${design.previewImage.filename}`
        design.previewImageUrls = [{
          ...design.previewImage,
          url: `/api/uploads/designs/${designIdToUse}/preview/${design.previewImage.filename}`,
          isPrimary: true
        }]
      }

      return design
    })

    return NextResponse.json({
      success: true,
      designs: designsWithUrls,
      count: designsWithUrls.length
    })

  } catch (error) {
    console.error("Fetch similar designs error:", error)
    return NextResponse.json(
      { error: "Failed to fetch similar designs" },
      { status: 500 }
    )
  }
}
