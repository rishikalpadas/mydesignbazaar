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
import { captureUploadMetadata } from "../../../../lib/deviceTracking"
import { calculateImageHash, checkDuplicate } from "../../../../lib/duplicateDetection"
import { validateRawFileMatch } from "../../../../lib/rawFileValidator"

// File size limits (in bytes)
const MAX_PREVIEW_SIZE = 5 * 1024 * 1024 // 5MB per preview image
const MAX_RAW_SIZE = 50 * 1024 * 1024 // 50MB per raw file
const MAX_PREVIEW_IMAGES_PER_DESIGN = 5

// Route segment config for Next.js App Router
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes (for Vercel/production)

// Allowed file types
const PREVIEW_TYPES = ["image/jpeg", "image/png", "image/webp"]
const RAW_TYPES = {
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
    // Verify content type
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({
        error: "Invalid request format. Expected multipart/form-data.",
        contentType
      }, { status: 400 })
    }

    // Parse form data
    let formData
    try {
      formData = await request.formData()
    } catch (formError) {
      console.error("FormData parsing error:", formError)
      return NextResponse.json({
        error: "Failed to parse form data",
        details: formError.message,
        cause: "This might be due to file size limits or network issues",
        contentLength: request.headers.get('content-length'),
        contentType: request.headers.get('content-type')
      }, { status: 400 })
    }

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

    // Get design data
    const title = formData.get('title')
    const description = formData.get('description')
    const category = formData.get('category')
    const tagsString = formData.get('tags')
    const exclusiveRequest = formData.get('exclusiveRequest') === 'true'
    const designIndex = formData.get('designIndex') || '0'
    const totalDesigns = parseInt(formData.get('totalDesigns') || '1')
    const isFirstTimeUpload = formData.get('isFirstTimeUpload') === 'true'

    console.log(`Processing single design upload (${parseInt(designIndex) + 1}/${totalDesigns})...`)

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({
        success: false,
        error: "Title, description, and category are required"
      }, { status: 400 })
    }

    // Parse tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : []

    // Get preview images
    const previewImages = []
    for (let j = 0; j < MAX_PREVIEW_IMAGES_PER_DESIGN; j++) {
      const previewFile = formData.get(`preview_${j}`)
      if (previewFile && previewFile.size > 0) {
        previewImages.push(previewFile)
      }
    }

    // Validate preview images
    if (previewImages.length === 0) {
      return NextResponse.json({
        success: false,
        error: "At least one preview image is required"
      }, { status: 400 })
    }

    // Validate each preview image
    for (const [index, previewFile] of previewImages.entries()) {
      if (previewFile.size > MAX_PREVIEW_SIZE) {
        return NextResponse.json({
          success: false,
          error: `Preview image ${index + 1} must be less than 5MB`
        }, { status: 400 })
      }

      if (!validateFileType(previewFile, PREVIEW_TYPES)) {
        return NextResponse.json({
          success: false,
          error: `Preview image ${index + 1} must be JPG, PNG, or WebP`
        }, { status: 400 })
      }
    }

    // Get raw file
    const rawFile = formData.get('raw')

    // Validate raw file
    if (!rawFile || rawFile.size === 0) {
      return NextResponse.json({
        success: false,
        error: "Raw file is required"
      }, { status: 400 })
    }

    if (rawFile.size > MAX_RAW_SIZE) {
      return NextResponse.json({
        success: false,
        error: "Raw file must be less than 50MB"
      }, { status: 400 })
    }

    const fileType = getRawFileType(rawFile.type, rawFile.name)
    if (!fileType) {
      return NextResponse.json({
        success: false,
        error: `Unsupported raw file type: ${rawFile.name}`
      }, { status: 400 })
    }

    // === DUPLICATE DETECTION ===
    console.log(`Checking for duplicates...`)
    try {
      // Calculate hash for primary preview image
      const primaryPreviewBytes = await previewImages[0].arrayBuffer()
      const primaryBuffer = Buffer.from(primaryPreviewBytes)
      const primaryHash = await calculateImageHash(primaryBuffer)

      // Check against existing designs
      const duplicateCheck = await checkDuplicate(primaryHash, user._id, 5)

      if (duplicateCheck.isDuplicate) {
        console.log(`Duplicate detected!`)
        return NextResponse.json({
          success: false,
          error: `Duplicate of existing design "${duplicateCheck.matchedDesign.title}" (${duplicateCheck.similarity}% similar)`,
          isDuplicate: true,
          matchedDesign: {
            id: duplicateCheck.matchedDesign.designId,
            title: duplicateCheck.matchedDesign.title
          }
        }, { status: 400 })
      }

      console.log(`No duplicates found, proceeding with upload...`)

      // Store the hash for later use
      var designPrimaryHash = primaryHash

    } catch (hashError) {
      console.error(`Error during duplicate detection:`, hashError)
      // Continue with upload even if duplicate detection fails
      var designPrimaryHash = null
    }

    // Capture upload metadata for copyright tracking
    const uploadMetadata = captureUploadMetadata(request)

    // Create the design
    console.log(`All validations passed, creating database entry...`)
    const customDesignId = await generateUniqueDesignId()

    const design = new Design({
      designId: customDesignId,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags.slice(0, 10), // Limit to 10 tags
      exclusiveRequest: exclusiveRequest,
      uploadedBy: user._id,
      status: "pending",
      uploadMetadata,
      primaryImageHash: designPrimaryHash // Store hash
    })

    await design.save()
    console.log(`Database entry created with ID: ${customDesignId}`)
    const designId = design._id.toString()
    const customId = design.designId

    try {
      console.log(`Starting file uploads...`)
      // Save preview images
      const previewImagesData = []
      for (const [index, previewFile] of previewImages.entries()) {
        console.log(`Uploading preview image ${index + 1}/${previewImages.length}...`)
        const previewImageData = await saveFile(previewFile, customId, "preview")
        previewImageData.isPrimary = index === 0 // First image is primary
        previewImagesData.push(previewImageData)
      }
      design.previewImages = previewImagesData
      console.log(`All preview images uploaded successfully`)

      // Generate watermarked versions of preview images
      try {
        console.log(`Generating watermarked versions...`)
        const watermarkedDir = path.join(process.cwd(), "public", "uploads", "designs", customId, "preview", "watermarked")
        await mkdir(watermarkedDir, { recursive: true })

        const watermarkPairs = previewImagesData.map((img) => ({
          input: path.join(process.cwd(), "public", "uploads", "designs", customId, "preview", img.filename),
          output: path.join(watermarkedDir, img.filename),
        }))

        await batchWatermark(watermarkPairs)
        console.log(`Generated ${watermarkPairs.length} watermarked previews`)
      } catch (watermarkError) {
        console.error(`Watermark generation error:`, watermarkError)
        // Continue without watermarks if generation fails
      }

      // For backward compatibility, set the first preview as the main previewImage
      if (previewImagesData.length > 0) {
        design.previewImage = previewImagesData[0]
      }

      // Save raw file
      console.log(`Uploading raw file...`)
      const rawFileData = await saveFile(rawFile, customId, "raw")
      rawFileData.fileType = fileType
      design.rawFile = rawFileData

      // For backward compatibility, also set rawFiles array
      design.rawFiles = [rawFileData]

      // Validate raw file matches preview images (automatic validation)
      try {
        const publicDir = path.join(process.cwd(), 'public')
        const rawFilePath = path.join(publicDir, rawFileData.path)
        const previewImagePaths = previewImagesData.map(img => path.join(publicDir, img.path))

        const validation = await validateRawFileMatch(
          rawFilePath,
          fileType,
          previewImagePaths,
          10 // threshold
        )

        // Store validation results
        design.rawFileValidation = {
          isValidated: true,
          isMatch: validation.isMatch,
          similarity: validation.similarity,
          matchedPreview: validation.matchedPreview,
          matchedPreviewIndex: validation.matchedPreviewIndex,
          hammingDistance: validation.hammingDistance,
          details: validation.details,
          validatedAt: new Date(),
          skipped: validation.skipped || false
        }

        // Log validation results for admin review
        console.log(`Raw file validation:`, {
          isMatch: validation.isMatch,
          similarity: validation.similarity,
          details: validation.details
        })
      } catch (validationError) {
        console.error(`Raw file validation error:`, validationError)
        // Don't fail the upload, just log the error
        design.rawFileValidation = {
          isValidated: false,
          details: `Validation failed: ${validationError.message}`
        }
      }

      // Save updated design
      await design.save()
      console.log(`Upload completed successfully!`)

      // Return success response
      return NextResponse.json({
        success: true,
        message: "Design uploaded successfully",
        design: {
          id: design._id,
          designId: design.designId,
          title: design.title,
          status: design.status,
          previewCount: previewImagesData.length
        }
      }, { status: 200 })

    } catch (fileError) {
      // If file operations fail, delete the design document
      console.error(`File operations failed:`, fileError)
      await Design.findByIdAndDelete(design._id)
      return NextResponse.json({
        success: false,
        error: `Failed to save files: ${fileError.message}`
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Single upload error:", error)
    console.error("Error stack:", error.stack)
    return NextResponse.json({
      success: false,
      error: "Failed to process design upload. Please try again.",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      code: error.code
    }, { status: 500 })
  }
}
