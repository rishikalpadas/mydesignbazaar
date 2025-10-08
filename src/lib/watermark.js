import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Add watermark to an image
 * @param {string} inputPath - Path to the original image
 * @param {string} outputPath - Path where watermarked image will be saved
 * @param {string} watermarkText - Text to use as watermark (default: "mydesignbazaar")
 * @returns {Promise<string>} - Path to the watermarked image
 */
export async function addWatermarkToImage(inputPath, outputPath, watermarkText = 'mydesignbazaar') {
  try {
    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate dimensions
    const width = metadata.width;
    const height = metadata.height;

    // Create watermark SVG with repeating pattern
    const istStamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const fullText = `${watermarkText} — ${istStamp}`;

    // Calculate how many repetitions we need based on image size
    const tileWidth = 280;
    const tileHeight = 180;
    const tilesX = Math.ceil(width / tileWidth) + 1;
    const tilesY = Math.ceil(height / tileHeight) + 1;

    // Generate watermark tiles
    let watermarkSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .watermark-text {
              font: 600 16px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
              fill: rgba(255,255,255,0.25);
              stroke: rgba(0,0,0,0.2);
              stroke-width: 1;
              paint-order: stroke;
            }
          </style>
        </defs>
    `;

    // Create a repeating pattern
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const offsetX = x * tileWidth;
        const offsetY = y * tileHeight;

        watermarkSvg += `
          <g transform="translate(${offsetX}, ${offsetY}) rotate(-30 140 90)">
            <text x="20" y="40" class="watermark-text">${fullText}</text>
            <text x="20" y="100" class="watermark-text">${fullText}</text>
            <text x="20" y="160" class="watermark-text">${fullText}</text>
          </g>
        `;
      }
    }

    watermarkSvg += '</svg>';

    // Convert SVG to buffer
    const watermarkBuffer = Buffer.from(watermarkSvg);

    // Composite watermark onto image
    await image
      .composite([{
        input: watermarkBuffer,
        blend: 'over',
        gravity: 'northwest'
      }])
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Watermark error:', error);
    throw new Error(`Failed to add watermark: ${error.message}`);
  }
}

/**
 * Batch watermark multiple images
 * @param {Array<{input: string, output: string}>} imagePairs - Array of input/output path pairs
 * @param {string} watermarkText - Text to use as watermark
 * @returns {Promise<Array<string>>} - Array of output paths
 */
export async function batchWatermark(imagePairs, watermarkText = 'mydesignbazaar') {
  const results = [];

  for (const { input, output } of imagePairs) {
    try {
      const result = await addWatermarkToImage(input, output, watermarkText);
      results.push(result);
    } catch (error) {
      console.error(`Failed to watermark ${input}:`, error);
      results.push(null);
    }
  }

  return results;
}

/**
 * Create watermarked version of uploaded preview images
 * @param {string} originalPath - Path to original image
 * @param {string} designId - Design ID for folder structure
 * @returns {Promise<string>} - Path to watermarked image
 */
export async function createWatermarkedPreview(originalPath, designId) {
  const parsedPath = path.parse(originalPath);
  const watermarkedFilename = `${parsedPath.name}-watermarked${parsedPath.ext}`;
  const watermarkedPath = path.join(parsedPath.dir, watermarkedFilename);

  await addWatermarkToImage(originalPath, watermarkedPath);

  return watermarkedPath;
}

/**
 * Check if watermarked version exists, create if not
 * @param {string} originalPath - Path to original image
 * @param {string} designId - Design ID
 * @returns {Promise<string>} - Path to watermarked image
 */
export async function getOrCreateWatermarkedImage(originalPath, designId) {
  const parsedPath = path.parse(originalPath);
  const watermarkedFilename = `${parsedPath.name}-watermarked${parsedPath.ext}`;
  const watermarkedPath = path.join(parsedPath.dir, watermarkedFilename);

  try {
    // Check if watermarked version already exists
    await fs.access(watermarkedPath);
    return watermarkedPath;
  } catch {
    // Doesn't exist, create it
    return await createWatermarkedPreview(originalPath, designId);
  }
}
