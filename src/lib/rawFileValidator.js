import { PDFDocument } from 'pdf-lib'
import sharp from 'sharp'
import { calculateImageHash, hammingDistance } from './duplicateDetection.js'
import fs from 'fs/promises'
import path from 'path'

/**
 * Extract visual content from raw file as image buffer
 * @param {string} filePath - Absolute path to the raw file
 * @param {string} fileType - Type of file (pdf, ai, eps, svg, cdr)
 * @returns {Promise<Buffer>} - Image buffer for comparison
 */
export async function extractRawFileContent(filePath, fileType) {
  try {
    const fileBuffer = await fs.readFile(filePath)

    switch (fileType.toLowerCase()) {
      case 'pdf':
      case 'ai': // AI files are PDF-based
        return await extractPDFPage(fileBuffer)

      case 'svg':
        return await convertSVGToImage(fileBuffer)

      case 'eps':
        // EPS is tricky - try to convert to image
        // If it has a preview embedded, sharp might handle it
        try {
          return await sharp(fileBuffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer()
        } catch (epsError) {
          console.warn('EPS conversion failed, file may need manual verification:', epsError.message)
          return null
        }

      case 'cdr':
        // CDR files are proprietary CorelDRAW format
        // Cannot extract without CorelDRAW - skip validation
        console.warn('CDR files cannot be automatically validated. Skipping validation.')
        return null

      default:
        console.warn(`Unsupported file type for validation: ${fileType}`)
        return null
    }
  } catch (error) {
    console.error('Error extracting raw file content:', error)
    return null
  }
}

/**
 * Extract first page from PDF as image
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} - PNG image buffer
 */
async function extractPDFPage(pdfBuffer) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pages = pdfDoc.getPages()

    if (pages.length === 0) {
      throw new Error('PDF has no pages')
    }

    // Get first page
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    // Create a new PDF with just the first page
    const newPdfDoc = await PDFDocument.create()
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [0])
    newPdfDoc.addPage(copiedPage)

    // Save as buffer
    const pdfBytes = await newPdfDoc.save()

    // Convert PDF page to image using Sharp
    // Sharp can handle PDF files and convert them to images
    const imageBuffer = await sharp(pdfBytes, { density: 150 })
      .png()
      .toBuffer()

    return imageBuffer
  } catch (error) {
    console.error('Error extracting PDF page:', error)
    throw error
  }
}

/**
 * Convert SVG to raster image
 * @param {Buffer} svgBuffer - SVG file buffer
 * @returns {Promise<Buffer>} - PNG image buffer
 */
async function convertSVGToImage(svgBuffer) {
  try {
    const imageBuffer = await sharp(svgBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()

    return imageBuffer
  } catch (error) {
    console.error('Error converting SVG:', error)
    throw error
  }
}

/**
 * Compare raw file content with preview images
 * @param {string} rawFilePath - Absolute path to raw file
 * @param {string} rawFileType - Type of raw file
 * @param {Array<string>} previewImagePaths - Array of absolute paths to preview images
 * @param {number} threshold - Hamming distance threshold for similarity (default: 10)
 * @returns {Promise<Object>} - { isMatch: boolean, similarity: number, matchedPreview: string, details: string }
 */
export async function validateRawFileMatch(rawFilePath, rawFileType, previewImagePaths, threshold = 10) {
  try {
    // Extract content from raw file
    const rawImageBuffer = await extractRawFileContent(rawFilePath, rawFileType)

    // If extraction not supported, skip validation
    if (!rawImageBuffer) {
      return {
        isMatch: true, // Allow to pass through
        similarity: 0,
        matchedPreview: null,
        details: `Automatic validation not available for ${rawFileType.toUpperCase()} files. Manual verification required.`,
        skipped: true
      }
    }

    // Calculate hash for raw file content
    const rawFileHash = await calculateImageHash(rawImageBuffer)

    // Compare with each preview image
    let bestMatch = {
      distance: Infinity,
      similarity: 0,
      previewPath: null,
      previewIndex: -1
    }

    for (let i = 0; i < previewImagePaths.length; i++) {
      const previewPath = previewImagePaths[i]

      try {
        // Read preview image
        const previewBuffer = await fs.readFile(previewPath)

        // Calculate hash for preview
        const previewHash = await calculateImageHash(previewBuffer)

        // Calculate distance
        const distance = hammingDistance(rawFileHash, previewHash)
        const similarity = Math.round((1 - distance / rawFileHash.length) * 100)

        if (distance < bestMatch.distance) {
          bestMatch = {
            distance,
            similarity,
            previewPath,
            previewIndex: i
          }
        }

        // If we find a very close match, we can return early
        if (distance <= threshold) {
          return {
            isMatch: true,
            similarity,
            matchedPreview: path.basename(previewPath),
            matchedPreviewIndex: i,
            hammingDistance: distance,
            details: `Raw file matches preview image #${i + 1} with ${similarity}% similarity.`
          }
        }
      } catch (previewError) {
        console.error(`Error processing preview image ${i}:`, previewError)
        continue
      }
    }

    // Check if best match is acceptable
    const isMatch = bestMatch.distance <= threshold

    return {
      isMatch,
      similarity: bestMatch.similarity,
      matchedPreview: bestMatch.previewPath ? path.basename(bestMatch.previewPath) : null,
      matchedPreviewIndex: bestMatch.previewIndex,
      hammingDistance: bestMatch.distance,
      details: isMatch
        ? `Raw file matches preview image #${bestMatch.previewIndex + 1} with ${bestMatch.similarity}% similarity.`
        : `Raw file does NOT match any preview images. Best match is ${bestMatch.similarity}% similar (threshold: ${Math.round((1 - threshold / rawFileHash.length) * 100)}%). This may indicate mismatched files.`
    }

  } catch (error) {
    console.error('Error validating raw file match:', error)
    return {
      isMatch: false,
      similarity: 0,
      matchedPreview: null,
      details: `Validation error: ${error.message}`,
      error: error.message
    }
  }
}

/**
 * Batch validate multiple designs' raw files
 * @param {Array<Object>} designs - Array of design objects with rawFilePath, rawFileType, and previewImagePaths
 * @returns {Promise<Array<Object>>} - Array of validation results
 */
export async function batchValidateRawFiles(designs) {
  const results = []

  for (let i = 0; i < designs.length; i++) {
    const design = designs[i]

    try {
      const validation = await validateRawFileMatch(
        design.rawFilePath,
        design.rawFileType,
        design.previewImagePaths,
        design.threshold || 10
      )

      results.push({
        designIndex: i,
        designId: design.designId,
        ...validation
      })
    } catch (error) {
      results.push({
        designIndex: i,
        designId: design.designId,
        isMatch: false,
        similarity: 0,
        details: `Validation failed: ${error.message}`,
        error: error.message
      })
    }
  }

  return results
}
