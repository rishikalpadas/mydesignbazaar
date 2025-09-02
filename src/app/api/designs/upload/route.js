import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Design from "@/models/Design"
import { User } from "@/models/User"
import jwt from "jsonwebtoken"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// File size limits (in bytes)
const MAX_PREVIEW_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_RAW_SIZE = 50 * 1024 * 1024 // 50MB

// Allowed file types
const PREVIEW_TYPES = ["image/jpeg", "image/png", "image/webp"]
const RAW_TYPES = {
  "application/x-photoshop": "psd",
  "application/pdf": "pdf",
  "application/postscript": "ai",
  "application/illustrator": "ai",
  "image/svg+xml": "svg",
  "application/x-coreldraw": "cdr",
  "application/eps": "eps",
}

// Helper function to validate file type
function validateFileType(file, allowedTypes) {
  return allowedTypes.includes(file.type)
}

// Helper function to get file extension
function getFileExtension(filename) {
  return filename.split(".").pop().toLowerCase()
}

// Helper function to determine raw file type
function getRawFileType(mimetype, filename) {
  if (RAW_TYPES[mimetype]) {
    return RAW_TYPES[mimetype]
  }

  // Fallback to extension-based detection
  const ext = getFileExtension(filename)
  const extensionMap = {
    psd: "psd",
    pdf: "pdf",
    ai: "ai",
    eps: "eps",
    svg: "svg",
    cdr: "cdr",
  }

  return extensionMap[ext] || null
}

// Helper function to save file
async function saveFile(file, designId, folder) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const fileExtension = getFileExtension(file.name)
  const uniqueFilename = `${uuidv4()}.${fileExtension}`

  // Create directory path
  const uploadDir = path.join(process.cwd(), "public", "uploads", "designs", designId, folder)
  const filePath = path.join(uploadDir, uniqueFilename)

  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true })

  // Write file
  await writeFile(filePath, buffer)

  return {
    filename: uniqueFilename,
    originalName: file.name,
    path: `uploads/designs/${designId}/${folder}/${uniqueFilename}`,
    size: file.size,
    mimetype: file.type,
  }
}

export async function POST(request) {
  try {
    // Connect to database
    await connectDB()

    // Get and verify JWT token
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user and verify they're a designer
    const user = await User.findById(decoded.userId)
    if (!user || user.userType !== "designer") {
      return NextResponse.json({ error: "Only designers can upload designs" }, { status: 403 })
    }

    if (!user.isApproved) {
      return NextResponse.json(
        { error: "Your designer account is pending approval. You can upload once approved by an admin." },
        { status: 403 },
      )
    }

    // Parse form data
    const formData = await request.formData()

    // Extract text fields
    const title = formData.get("title")
    const description = formData.get("description")
    const category = formData.get("category")
    const tagsString = formData.get("tags")

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 })
    }

    // Parse tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : []

    // Get files
    const previewFile = formData.get("previewImage")
    const rawFiles = formData.getAll("rawFiles")

    // Validate preview file
    if (!previewFile || previewFile.size === 0) {
      return NextResponse.json({ error: "Preview image is required" }, { status: 400 })
    }

    if (previewFile.size > MAX_PREVIEW_SIZE) {
      return NextResponse.json({ error: "Preview image must be less than 5MB" }, { status: 400 })
    }

    if (!validateFileType(previewFile, PREVIEW_TYPES)) {
      return NextResponse.json({ error: "Preview image must be JPG, PNG, or WebP" }, { status: 400 })
    }

    // Validate raw files
    if (!rawFiles || rawFiles.length === 0 || rawFiles[0].size === 0) {
      return NextResponse.json({ error: "At least one raw file is required" }, { status: 400 })
    }

    for (const rawFile of rawFiles) {
      if (rawFile.size > 0) {
        // Skip empty files
        if (rawFile.size > MAX_RAW_SIZE) {
          return NextResponse.json({ error: `Raw file ${rawFile.name} must be less than 50MB` }, { status: 400 })
        }

        const fileType = getRawFileType(rawFile.type, rawFile.name)
        if (!fileType) {
          return NextResponse.json({ error: `Unsupported raw file type: ${rawFile.name}` }, { status: 400 })
        }
      }
    }

    // Create design document first to get ID
    const design = new Design({
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags.slice(0, 10), // Limit to 10 tags
      uploadedBy: user._id,
      status: "pending",
    })

    await design.save()
    const designId = design._id.toString()

    try {
      // Save preview image
      const previewImageData = await saveFile(previewFile, designId, "preview")
      design.previewImage = previewImageData

      // Save raw files
      const rawFilesData = []
      for (const rawFile of rawFiles) {
        if (rawFile.size > 0) {
          // Skip empty files
          const rawFileData = await saveFile(rawFile, designId, "raw")
          rawFileData.fileType = getRawFileType(rawFile.type, rawFile.name)
          rawFilesData.push(rawFileData)
        }
      }
      design.rawFiles = rawFilesData

      // Save updated design
      await design.save()

      return NextResponse.json({
        success: true,
        message: "Design uploaded successfully and is pending approval",
        design: {
          id: design._id,
          title: design.title,
          status: design.status,
        },
      })
    } catch (fileError) {
      // If file operations fail, delete the design document
      await Design.findByIdAndDelete(design._id)
      throw fileError
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload design. Please try again." }, { status: 500 })
  }
}
