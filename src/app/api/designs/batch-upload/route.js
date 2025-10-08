import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import Design from "../../../../models/Design"
import { User } from "../../../../models/User"
import jwt from "jsonwebtoken"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { generateUniqueDesignId } from "../../../../lib/designIdGenerator"
import { batchWatermark } from "../../../../lib/watermark"

// File size limits (in bytes)
const MAX_PREVIEW_SIZE = 5 * 1024 * 1024 // 5MB per preview image
const MAX_RAW_SIZE = 50 * 1024 * 1024 // 50MB per raw file
const MAX_DESIGNS_PER_BATCH = 25
const MAX_PREVIEW_IMAGES_PER_DESIGN = 5

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
    
    // Get the number of designs to upload
    const designCount = parseInt(formData.get("designCount") || "1")
    
    if (designCount > MAX_DESIGNS_PER_BATCH) {
      return NextResponse.json({ 
        error: `Maximum ${MAX_DESIGNS_PER_BATCH} designs allowed per batch upload` 
      }, { status: 400 })
    }

    // Check if this is a first-time upload and enforce minimum requirement
    const existingDesignsCount = await Design.countDocuments({ uploadedBy: user._id })
    const isFirstTimeUpload = existingDesignsCount === 0
    
    if (isFirstTimeUpload && designCount < 10) {
      return NextResponse.json({ 
        error: "First-time uploaders must upload at least 10 designs" 
      }, { status: 400 })
    }

    const uploadedDesigns = []
    const errors = []

    // Process each design
    for (let i = 0; i < designCount; i++) {
      try {
        // Extract design-specific fields
        const title = formData.get(`design_${i}_title`)
        const description = formData.get(`design_${i}_description`)
        const category = formData.get(`design_${i}_category`)
        const tagsString = formData.get(`design_${i}_tags`)

        // Validate required fields
        if (!title || !description || !category) {
          errors.push({
            designIndex: i,
            error: "Title, description, and category are required"
          })
          continue
        }

        // Parse tags
        const tags = tagsString
          ? tagsString
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : []

        // Get preview images for this design
        const previewImages = []
        for (let j = 0; j < MAX_PREVIEW_IMAGES_PER_DESIGN; j++) {
          const previewFile = formData.get(`design_${i}_preview_${j}`)
          if (previewFile && previewFile.size > 0) {
            previewImages.push(previewFile)
          }
        }

        // Validate preview images
        if (previewImages.length === 0) {
          errors.push({
            designIndex: i,
            error: "At least one preview image is required"
          })
          continue
        }

        // Validate each preview image
        for (const [index, previewFile] of previewImages.entries()) {
          if (previewFile.size > MAX_PREVIEW_SIZE) {
            errors.push({
              designIndex: i,
              error: `Preview image ${index + 1} must be less than 5MB`
            })
            continue
          }

          if (!validateFileType(previewFile, PREVIEW_TYPES)) {
            errors.push({
              designIndex: i,
              error: `Preview image ${index + 1} must be JPG, PNG, or WebP`
            })
            continue
          }
        }

        // Get raw file for this design
        const rawFile = formData.get(`design_${i}_raw`)

        // Validate raw file
        if (!rawFile || rawFile.size === 0) {
          errors.push({
            designIndex: i,
            error: "Raw file is required"
          })
          continue
        }

        if (rawFile.size > MAX_RAW_SIZE) {
          errors.push({
            designIndex: i,
            error: "Raw file must be less than 50MB"
          })
          continue
        }

        const fileType = getRawFileType(rawFile.type, rawFile.name)
        if (!fileType) {
          errors.push({
            designIndex: i,
            error: `Unsupported raw file type: ${rawFile.name}`
          })
          continue
        }

        // If we got here, all validations passed, create the design
        const customDesignId = await generateUniqueDesignId()

        const design = new Design({
          designId: customDesignId,
          title: title.trim(),
          description: description.trim(),
          category,
          tags: tags.slice(0, 10), // Limit to 10 tags
          uploadedBy: user._id,
          status: "pending",
        })

        await design.save()
        const designId = design._id.toString()
        const customId = design.designId

        try {
          // Save preview images
          const previewImagesData = []
          for (const [index, previewFile] of previewImages.entries()) {
            const previewImageData = await saveFile(previewFile, customId, "preview")
            previewImageData.isPrimary = index === 0 // First image is primary
            previewImagesData.push(previewImageData)
          }
          design.previewImages = previewImagesData

          // Generate watermarked versions of preview images
          try {
            const watermarkedDir = path.join(process.cwd(), "public", "uploads", "designs", customId, "preview", "watermarked")
            await mkdir(watermarkedDir, { recursive: true })

            const watermarkPairs = previewImagesData.map((img) => ({
              input: path.join(process.cwd(), "public", "uploads", "designs", customId, "preview", img.filename),
              output: path.join(watermarkedDir, img.filename),
            }))

            await batchWatermark(watermarkPairs)
            console.log(`Generated ${watermarkPairs.length} watermarked previews for design ${customId}`)
          } catch (watermarkError) {
            console.error("Watermark generation error:", watermarkError)
            // Continue without watermarks if generation fails
          }

          // For backward compatibility, set the first preview as the main previewImage
          if (previewImagesData.length > 0) {
            design.previewImage = previewImagesData[0]
          }

          // Save raw file
          const rawFileData = await saveFile(rawFile, customId, "raw")
          rawFileData.fileType = fileType
          design.rawFile = rawFileData
          
          // For backward compatibility, also set rawFiles array
          design.rawFiles = [rawFileData]

          // Save updated design
          await design.save()

          uploadedDesigns.push({
            id: design._id,
            title: design.title,
            status: design.status,
            previewCount: previewImagesData.length
          })

        } catch (fileError) {
          // If file operations fail, delete the design document
          await Design.findByIdAndDelete(design._id)
          errors.push({
            designIndex: i,
            error: `Failed to save files for design: ${fileError.message}`
          })
        }

      } catch (designError) {
        errors.push({
          designIndex: i,
          error: `Failed to process design: ${designError.message}`
        })
      }
    }

    // Return results
    const response = {
      success: uploadedDesigns.length > 0,
      message: `${uploadedDesigns.length} design(s) uploaded successfully`,
      uploadedDesigns,
      totalUploaded: uploadedDesigns.length,
      totalFailed: errors.length
    }

    if (errors.length > 0) {
      response.errors = errors
      response.message += `, ${errors.length} failed`
    }

    return NextResponse.json(response, { 
      status: uploadedDesigns.length > 0 ? 200 : 400 
    })

  } catch (error) {
    console.error("Batch upload error:", error)
    return NextResponse.json({ 
      error: "Failed to process batch upload. Please try again." 
    }, { status: 500 })
  }
}
