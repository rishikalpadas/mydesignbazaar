import blockhash from 'blockhash'
import sharp from 'sharp'
import Design from '../models/Design'

/**
 * Calculate perceptual hash of an image file
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Promise<string>} - Perceptual hash string
 */
export async function calculateImageHash(imageBuffer) {
  try {
    // Convert image to raw pixel data using sharp
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true })

    // Prepare image data for blockhash
    const bits = 16 // 16x16 hash for good accuracy
    const method = 2 // 2 = precise method

    // blockhashData expects { width, height, data } object
    const imageData = {
      width: info.width,
      height: info.height,
      data: data
    }

    const hash = blockhash.blockhashData(imageData, bits, method)

    return hash
  } catch (error) {
    console.error('Error calculating image hash:', error)
    throw new Error('Failed to calculate image hash')
  }
}

/**
 * Calculate Hamming distance between two hashes
 * @param {string} hash1 - First hash
 * @param {string} hash2 - Second hash
 * @returns {number} - Hamming distance (0 = identical, higher = more different)
 */
export function hammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) {
    return Infinity
  }

  let distance = 0
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++
    }
  }
  return distance
}

/**
 * Check if an image is a duplicate or very similar to existing designs
 * @param {string} imageHash - Hash of the image to check
 * @param {string} uploaderId - ID of the user uploading
 * @param {number} threshold - Maximum hamming distance to consider as duplicate (default: 5)
 * @returns {Promise<Object>} - { isDuplicate: boolean, matchedDesign: Design | null, similarity: number }
 */
export async function checkDuplicate(imageHash, uploaderId, threshold = 5) {
  try {
    // Get all APPROVED/REJECTED designs by this uploader
    // Don't check against pending designs to avoid false duplicates within same batch upload
    const designs = await Design.find({
      uploadedBy: uploaderId,
      primaryImageHash: { $exists: true },
      status: { $in: ['approved', 'rejected'] } // Only check against reviewed designs
    }).select('designId title primaryImageHash previewImages status').lean()

    if (!designs || designs.length === 0) {
      return {
        isDuplicate: false,
        matchedDesign: null,
        similarity: 0
      }
    }

    let closestMatch = null
    let minDistance = Infinity

    // Check against each design's primary image hash
    for (const design of designs) {
      const distance = hammingDistance(imageHash, design.primaryImageHash)

      if (distance < minDistance) {
        minDistance = distance
        closestMatch = design
      }

      // If we find an exact or very close match, return early
      if (distance <= threshold) {
        return {
          isDuplicate: true,
          matchedDesign: design,
          similarity: Math.round((1 - distance / imageHash.length) * 100), // Percentage similarity
          hammingDistance: distance
        }
      }
    }

    // Calculate similarity percentage for closest match
    const similarity = closestMatch
      ? Math.round((1 - minDistance / imageHash.length) * 100)
      : 0

    return {
      isDuplicate: false,
      matchedDesign: minDistance < 15 ? closestMatch : null, // Return close match for reference
      similarity,
      hammingDistance: minDistance
    }

  } catch (error) {
    console.error('Error checking for duplicates:', error)
    // In case of error, allow upload but log the issue
    return {
      isDuplicate: false,
      matchedDesign: null,
      similarity: 0,
      error: error.message
    }
  }
}

/**
 * Check if multiple preview images are duplicates
 * @param {Array<Buffer>} imageBuffers - Array of image buffers
 * @param {number} threshold - Maximum hamming distance to consider as duplicate
 * @returns {Promise<Object>} - { hasDuplicates: boolean, duplicateIndices: Array }
 */
export async function checkInternalDuplicates(imageBuffers, threshold = 5) {
  try {
    // Calculate hashes for all images
    const hashes = await Promise.all(
      imageBuffers.map(buffer => calculateImageHash(buffer))
    )

    const duplicateIndices = []

    // Compare each hash with every other hash
    for (let i = 0; i < hashes.length; i++) {
      for (let j = i + 1; j < hashes.length; j++) {
        const distance = hammingDistance(hashes[i], hashes[j])
        if (distance <= threshold) {
          duplicateIndices.push({ image1: i, image2: j, distance })
        }
      }
    }

    return {
      hasDuplicates: duplicateIndices.length > 0,
      duplicateIndices,
      hashes
    }

  } catch (error) {
    console.error('Error checking internal duplicates:', error)
    return {
      hasDuplicates: false,
      duplicateIndices: [],
      hashes: [],
      error: error.message
    }
  }
}
