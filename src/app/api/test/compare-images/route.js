import { NextResponse } from 'next/server';
import { calculateImageHash, hammingDistance, areImagesSimilar } from '../../../../lib/imageHashService';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image1 = formData.get('image1');
    const image2 = formData.get('image2');

    if (!image1 || !image2) {
      return NextResponse.json(
        { error: 'Two images required for comparison' },
        { status: 400 }
      );
    }

    // Convert to buffers
    const buffer1 = Buffer.from(await image1.arrayBuffer());
    const buffer2 = Buffer.from(await image2.arrayBuffer());

    // Calculate hashes
    const hash1 = await calculateImageHash(buffer1);
    const hash2 = await calculateImageHash(buffer2);

    // Calculate similarity
    const distance = hammingDistance(hash1, hash2);
    const areSimilar = areImagesSimilar(hash1, hash2);
    const similarityPercentage = ((64 - distance) / 64 * 100).toFixed(1);

    return NextResponse.json({
      success: true,
      image1: {
        name: image1.name,
        size: image1.size,
        hash: hash1
      },
      image2: {
        name: image2.name,
        size: image2.size,
        hash: hash2
      },
      comparison: {
        hammingDistance: distance,
        areSimilar,
        similarityPercentage: `${similarityPercentage}%`,
        interpretation: distance === 0 
          ? 'Identical images' 
          : distance <= 5 
          ? 'Very similar (considered duplicates)' 
          : distance <= 10 
          ? 'Similar' 
          : 'Different images'
      }
    });

  } catch (error) {
    console.error('Test comparison error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to compare images',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
