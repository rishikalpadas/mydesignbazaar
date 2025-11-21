import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Design from '../../../../models/Design';
import { verifyToken } from '../../../../middleware/auth';
import { calculateImageHash, findDuplicatesInBatch, batchCheckAgainstDatabase } from '../../../../lib/imageHashService';

export async function POST(request) {
  try {
    console.log('[DUPLICATE-CHECK-API] Starting duplicate check...');
    await connectDB();

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      console.error('[DUPLICATE-CHECK-API] Auth error:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const userType = authResult.user.userType;

    console.log('[DUPLICATE-CHECK-API] User authenticated:', { userId, userType });

    // Only designers can check duplicates
    if (userType !== 'designer') {
      return NextResponse.json(
        { error: 'Only designers can check for duplicate images' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const images = [];

    // Parse uploaded images from form data
    let imageIndex = 0;
    while (true) {
      const file = formData.get(`image_${imageIndex}`);
      if (!file) break;

      const designIndex = formData.get(`designIndex_${imageIndex}`);
      const imageIndexInDesign = formData.get(`imageIndex_${imageIndex}`);

      console.log(`[DUPLICATE-CHECK-API] Processing image ${imageIndex}:`, file.name);

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      images.push({
        name: file.name,
        buffer: buffer,
        designIndex: parseInt(designIndex),
        imageIndex: parseInt(imageIndexInDesign),
        size: file.size
      });

      imageIndex++;
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided for duplicate check' },
        { status: 400 }
      );
    }

    console.log(`[DUPLICATE-CHECK-API] Checking ${images.length} images for duplicates`);

    // Step 1: Calculate hashes for all images
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      try {
        console.log(`[DUPLICATE-CHECK-API] Calculating hash for image ${i + 1}/${images.length}: ${image.name}`);
        image.hash = await calculateImageHash(image.buffer);
        console.log(`[DUPLICATE-CHECK-API] Hash calculated: ${image.hash.substring(0, 16)}...`);
      } catch (error) {
        console.error(`[DUPLICATE-CHECK-API] Error hashing image ${image.name}:`, error);
        return NextResponse.json(
          { 
            error: `Failed to process image: ${image.name}`,
            details: error.message,
            stack: error.stack
          },
          { status: 400 }
        );
      }
    }

    console.log('[DUPLICATE-CHECK-API] All hashes calculated successfully');

    // Step 2: Check for duplicates within the uploaded batch
    console.log('[DUPLICATE-CHECK-API] Checking for duplicates within batch...');
    const { duplicates: batchDuplicates } = await findDuplicatesInBatch(images);

    // Step 3: Fetch existing designs from database for this user
    const existingDesigns = await Design.find({
      uploadedBy: userId,
      status: { $in: ['pending', 'approved'] } // Check against pending and approved designs
    }).select('designId title previewImages primaryImageHash');

    console.log(`[DUPLICATE-CHECK] Found ${existingDesigns.length} existing designs to check against`);

    // Step 4: Check uploaded images against database
    const databaseMatches = batchCheckAgainstDatabase(
      images.map(img => ({
        name: img.name,
        hash: img.hash,
        designIndex: img.designIndex,
        imageIndex: img.imageIndex
      })),
      existingDesigns
    );

    // Prepare response
    const hasDuplicates = batchDuplicates.length > 0 || databaseMatches.length > 0;

    const response = {
      success: !hasDuplicates,
      hasDuplicates,
      totalImagesChecked: images.length,
      duplicatesInBatch: batchDuplicates.length,
      duplicatesInDatabase: databaseMatches.length,
      batchDuplicates: batchDuplicates.map(dup => ({
        current: {
          designNumber: dup.current.designIndex + 1,
          imageNumber: dup.current.imageIndex + 1,
          filename: dup.current.name
        },
        duplicate: {
          designNumber: dup.matchedWith.designIndex + 1,
          imageNumber: dup.matchedWith.imageIndex + 1,
          filename: dup.matchedWith.name
        },
        similarity: `${(100 - (dup.hammingDistance / 64 * 100)).toFixed(1)}%`
      })),
      databaseMatches: databaseMatches.map(match => ({
        uploaded: {
          designNumber: match.uploadedImage.designIndex + 1,
          imageNumber: match.uploadedImage.imageIndex + 1,
          filename: match.uploadedImage.name
        },
        existingDesign: {
          designId: match.existingDesign.designId,
          title: match.existingDesign.title,
          imageIndex: match.existingDesign.imageIndex
        },
        similarity: `${(100 - (match.existingDesign.hammingDistance / 64 * 100)).toFixed(1)}%`
      }))
    };

    if (hasDuplicates) {
      console.log(`[DUPLICATE-CHECK-API] Found duplicates:`, {
        batchDuplicates: batchDuplicates.length,
        databaseMatches: databaseMatches.length
      });
    } else {
      console.log(`[DUPLICATE-CHECK-API] No duplicates found`);
    }

    console.log('[DUPLICATE-CHECK-API] Returning success response');
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('[DUPLICATE-CHECK-API] Unexpected error:', error);
    console.error('[DUPLICATE-CHECK-API] Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to check for duplicate images',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
