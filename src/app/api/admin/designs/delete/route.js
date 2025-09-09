import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Design from "@/models/Design"
import { withPermission } from "@/middleware/auth"
import fs from "fs/promises"
import path from "path"

async function handler(request) {
  try {
    await connectDB()

    const { designId } = await request.json()
    if (!designId) {
      return NextResponse.json({ error: "designId is required" }, { status: 400 })
    }

    const design = await Design.findById(designId)
    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    // Delete associated files
    try {
      const designDir = path.join(process.cwd(), "public", "uploads", "designs", designId)
      await fs.rmdir(designDir, { recursive: true })
    } catch (fileError) {
      console.warn("Could not delete design files:", fileError.message)
    }

    // Delete from database
    await Design.findByIdAndDelete(designId)

    return NextResponse.json({
      success: true,
      message: "Design deleted successfully",
    })
  } catch (error) {
    console.error("Delete design error:", error)
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  }
}

export const DELETE = withPermission(["manage_designs"])(handler)
export const POST = withPermission(["manage_designs"])(handler)
