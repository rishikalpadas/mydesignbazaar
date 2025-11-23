import sharp from 'sharp';

/**
 * Calculate perceptual hash of an image using a simple blockhash implementation
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<string>} - Perceptual hash string
 */
export async function calculateImageHash(imageBuffer) {
  try {
    // Convert image to standard format for hashing
    const { data, info } = await sharp(imageBuffer)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate median value
    const values = Array.from(data);
    const sorted = values.slice().sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    // Generate hash based on median (64 bits = 8x8 pixels)
    let hash = '';
    for (let i = 0; i < data.length; i++) {
      hash += data[i] > median ? '1' : '0';
    }

    // Convert binary string to hex for more compact representation
    // Ensure consistent 16-character hex string (64 bits / 4 bits per hex = 16 chars)
    let hexHash = '';
    for (let i = 0; i < hash.length; i += 4) {
      const chunk = hash.slice(i, i + 4);
      hexHash += parseInt(chunk, 2).toString(16);
    }

    // Pad to ensure 16 characters
    return hexHash.padEnd(16, '0');
  } catch (error) {
    console.error('Error calculating image hash:', error);
    throw new Error(`Failed to calculate image hash: ${error.message}`);
  }
}

/**
 * Normalize hash to 16 characters
 * @param {string} hash - Hash string
 * @returns {string} - Normalized 16-character hash
 */
function normalizeHash(hash) {
  if (!hash) return '0'.repeat(16);
  if (hash.length >= 16) return hash.substring(0, 16);
  return hash.padEnd(16, '0');
}

/**
 * Calculate Hamming distance between two hash strings
 * @param {string} hash1 - First hash
 * @param {string} hash2 - Second hash
 * @returns {number} - Hamming distance (0 = identical, lower = more similar)
 */
export function hammingDistance(hash1, hash2) {
  // Log original hash lengths for debugging
  console.log(`[HAMMING] Comparing hashes - hash1 length: ${hash1?.length || 0}, hash2 length: ${hash2?.length || 0}`);
  
  // Normalize hashes to ensure equal length
  const normalized1 = normalizeHash(hash1);
  const normalized2 = normalizeHash(hash2);

  let distance = 0;
  for (let i = 0; i < normalized1.length; i++) {
    if (normalized1[i] !== normalized2[i]) {
      distance++;
    }
  }
  return distance;
}

/**
 * Check if two images are similar based on their hashes
 * @param {string} hash1 - First image hash
 * @param {string} hash2 - Second image hash
 * @param {number} threshold - Maximum hamming distance to consider similar (default: 5)
 * @returns {boolean} - True if images are similar
 */
export function areImagesSimilar(hash1, hash2, threshold = 5) {
  const distance = hammingDistance(hash1, hash2);
  return distance <= threshold;
}

/**
 * Find duplicate images in an array of images
 * @param {Array} images - Array of { name, buffer, hash? } objects
 * @returns {Promise<Object>} - { duplicates: [], uniqueImages: [] }
 */
export async function findDuplicatesInBatch(images) {
  const duplicates = [];
  const uniqueImages = [];
  const hashMap = new Map(); // hash -> image info

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    // Calculate hash if not provided
    if (!image.hash) {
      image.hash = await calculateImageHash(image.buffer);
    }

    // Check against all previously processed images
    let isDuplicate = false;
    
    for (const [existingHash, existingImage] of hashMap.entries()) {
      if (areImagesSimilar(image.hash, existingHash)) {
        duplicates.push({
          current: {
            index: i,
            name: image.name,
            designIndex: image.designIndex,
            imageIndex: image.imageIndex
          },
          matchedWith: {
            index: existingImage.index,
            name: existingImage.name,
            designIndex: existingImage.designIndex,
            imageIndex: existingImage.imageIndex
          },
          hammingDistance: hammingDistance(image.hash, existingHash)
        });
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      hashMap.set(image.hash, {
        index: i,
        name: image.name,
        designIndex: image.designIndex,
        imageIndex: image.imageIndex
      });
      uniqueImages.push(image);
    }
  }

  return { duplicates, uniqueImages };
}

/**
 * Check if an image hash matches any existing design in database
 * @param {string} imageHash - Hash of the image to check
 * @param {Array} existingDesigns - Array of designs from database
 * @param {number} threshold - Similarity threshold
 * @returns {Object|null} - Matched design info or null
 */
export function findMatchInDatabase(imageHash, existingDesigns, threshold = 5) {
  for (const design of existingDesigns) {
    // Check against primary image hash
    if (design.primaryImageHash && areImagesSimilar(imageHash, design.primaryImageHash, threshold)) {
      return {
        designId: design.designId || design._id,
        title: design.title,
        matchedHash: design.primaryImageHash,
        hammingDistance: hammingDistance(imageHash, design.primaryImageHash)
      };
    }

    // Check against all preview images
    if (design.previewImages && Array.isArray(design.previewImages)) {
      for (let i = 0; i < design.previewImages.length; i++) {
        const preview = design.previewImages[i];
        if (preview.imageHash && areImagesSimilar(imageHash, preview.imageHash, threshold)) {
          return {
            designId: design.designId || design._id,
            title: design.title,
            imageIndex: i,
            matchedHash: preview.imageHash,
            hammingDistance: hammingDistance(imageHash, preview.imageHash)
          };
        }
      }
    }
  }

  return null;
}

/**
 * Batch check multiple images against database
 * @param {Array} images - Array of { name, hash, designIndex, imageIndex }
 * @param {Array} existingDesigns - Designs from database
 * @returns {Array} - Array of matches
 */
export function batchCheckAgainstDatabase(images, existingDesigns) {
  const matches = [];

  for (const image of images) {
    const match = findMatchInDatabase(image.hash, existingDesigns);
    if (match) {
      matches.push({
        uploadedImage: {
          name: image.name,
          designIndex: image.designIndex,
          imageIndex: image.imageIndex,
          hash: image.hash
        },
        existingDesign: match
      });
    }
  }

  return matches;
}

export default {
  calculateImageHash,
  hammingDistance,
  areImagesSimilar,
  findDuplicatesInBatch,
  findMatchInDatabase,
  batchCheckAgainstDatabase
};
