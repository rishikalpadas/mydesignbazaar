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
import { calculateImageHash, checkDuplicate, checkInternalDuplicates } from "../../../../lib/duplicateDetection"
import { validateRawFileMatch } from "../../../../lib/rawFileValidator"

// File size limits (in bytes)
const MAX_PREVIEW_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_RAW_SIZE = 50 * 1024 * 1024 // 50MB

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

    // Get files - support both single and multiple preview images
    const previewFiles = []
    
    // Try to get multiple preview images first
    for (let i = 0; i < 5; i++) {
      const previewFile = formData.get(`previewImage_${i}`)
      if (previewFile && previewFile.size > 0) {
        previewFiles.push(previewFile)
      }
    }
    
    // Fallback to single preview image for backward compatibility
    if (previewFiles.length === 0) {
      const singlePreview = formData.get("previewImage")
      if (singlePreview && singlePreview.size > 0) {
        previewFiles.push(singlePreview)
      }
    }

    // Validate preview files
    if (previewFiles.length === 0) {
      return NextResponse.json({ error: "At least one preview image is required" }, { status: 400 })
    }

    if (previewFiles.length > 5) {
      return NextResponse.json({ error: "Maximum 5 preview images allowed" }, { status: 400 })
    }

    for (const [index, previewFile] of previewFiles.entries()) {
      if (previewFile.size > MAX_PREVIEW_SIZE) {
        return NextResponse.json({ error: `Preview image ${index + 1} must be less than 5MB` }, { status: 400 })
      }

      if (!validateFileType(previewFile, PREVIEW_TYPES)) {
        return NextResponse.json({ error: `Preview image ${index + 1} must be JPG, PNG, or WebP` }, { status: 400 })
      }
    }

    // Get raw files - support both single and multiple
    const rawFiles = formData.getAll("rawFiles")
    const singleRawFile = formData.get("rawFile")
    
    let rawFileToProcess = null
    if (singleRawFile && singleRawFile.size > 0) {
      rawFileToProcess = singleRawFile
    } else if (rawFiles && rawFiles.length > 0 && rawFiles[0].size > 0) {
      rawFileToProcess = rawFiles[0] // Take the first one for new single file approach
    }

    // Validate raw file
    if (!rawFileToProcess) {
      return NextResponse.json({ error: "Raw file is required" }, { status: 400 })
    }

    if (rawFileToProcess.size > MAX_RAW_SIZE) {
      return NextResponse.json({ error: "Raw file must be less than 50MB" }, { status: 400 })
    }

    const fileType = getRawFileType(rawFileToProcess.type, rawFileToProcess.name)
    if (!fileType) {
      return NextResponse.json({ error: `Unsupported raw file type: ${rawFileToProcess.name}` }, { status: 400 })
    }

    // Check if this is a first-time upload and enforce minimum requirement
    const existingDesignsCount = await Design.countDocuments({ uploadedBy: user._id })
    const isFirstTimeUpload = existingDesignsCount === 0

    if (isFirstTimeUpload) {
      return NextResponse.json({
        error: "First-time uploaders must upload at least 10 designs. Please use the batch upload feature."
      }, { status: 400 })
    }

    // === DUPLICATE DETECTION ===
    // Convert preview images to buffers and check for duplicates
    const previewBuffers = []
    for (const previewFile of previewFiles) {
      const bytes = await previewFile.arrayBuffer()
      previewBuffers.push(Buffer.from(bytes))
    }

    // Check if user is uploading duplicate images within this upload
    const internalDuplicateCheck = await checkInternalDuplicates(previewBuffers, 5)
    if (internalDuplicateCheck.hasDuplicates) {
      const duplicatePairs = internalDuplicateCheck.duplicateIndices
        .map(d => `Image ${d.image1 + 1} and Image ${d.image2 + 1}`)
        .join(', ')

      return NextResponse.json({
        error: `Duplicate images detected in your upload: ${duplicatePairs}. Please upload unique designs only.`,
        duplicates: internalDuplicateCheck.duplicateIndices
      }, { status: 400 })
    }

    // Calculate hash for primary image (first preview)
    const primaryHash = internalDuplicateCheck.hashes[0]

    // Check if this design is a duplicate of designer's existing uploads
    const duplicateCheck = await checkDuplicate(primaryHash, user._id, 5)

    if (duplicateCheck.isDuplicate) {
      return NextResponse.json({
        error: `This design appears to be a duplicate of your existing design "${duplicateCheck.matchedDesign.title}" (ID: ${duplicateCheck.matchedDesign.designId}). Similarity: ${duplicateCheck.similarity}%. Please upload original, unique designs only.`,
        matchedDesign: {
          id: duplicateCheck.matchedDesign.designId,
          title: duplicateCheck.matchedDesign.title,
          similarity: duplicateCheck.similarity
        }
      }, { status: 400 })
    }

    // Generate unique design ID
    const customDesignId = await generateUniqueDesignId()

    // Capture upload metadata for copyright tracking
    const uploadMetadata = captureUploadMetadata(request)

    // Create design document with custom ID
    const design = new Design({
      designId: customDesignId,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags.slice(0, 10), // Limit to 10 tags
      uploadedBy: user._id,
      status: "pending",
      uploadMetadata,
    })

    await design.save()
    const designId = design._id.toString()
    const customId = design.designId

    try {
      // Save preview images using custom design ID and attach their hashes
      const previewImagesData = []
      for (const [index, previewFile] of previewFiles.entries()) {
        const previewImageData = await saveFile(previewFile, customId, "preview")
        previewImageData.isPrimary = index === 0 // First image is primary
        previewImageData.imageHash = internalDuplicateCheck.hashes[index] // Store hash
        previewImagesData.push(previewImageData)
      }
      design.previewImages = previewImagesData

      // Store primary image hash for quick duplicate checking
      design.primaryImageHash = primaryHash

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

      // Save raw file using custom design ID
      const rawFileData = await saveFile(rawFileToProcess, customId, "raw")
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
        console.log(`Raw file validation for ${customId}:`, {
          isMatch: validation.isMatch,
          similarity: validation.similarity,
          details: validation.details
        })
      } catch (validationError) {
        console.error('Raw file validation error:', validationError)
        // Don't fail the upload, just log the error
        design.rawFileValidation = {
          isValidated: false,
          details: `Validation failed: ${validationError.message}`
        }
      }

      // Save updated design
      await design.save()

      return NextResponse.json({
        success: true,
        message: "Design uploaded successfully and is pending approval",
        design: {
          id: design._id,
          designId: design.designId,
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
