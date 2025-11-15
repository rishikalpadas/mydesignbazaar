import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Design from '../../../../models/Design';
import { verifyToken } from '../../../../middleware/auth';

export const dynamic = 'force-dynamic';

// Check if designer is a first-time uploader
export async function GET(request) {
  try {
    await connectDB();

    // Verify designer authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const userType = authResult.user.userType;

    // Only designers can check upload status
    if (userType !== 'designer') {
      return NextResponse.json(
        { error: 'Only designers can check upload status' },
        { status: 403 }
      );
    }

    // Count total designs uploaded by this designer
    const totalDesigns = await Design.countDocuments({ uploadedBy: userId });

    // Check if this is first time upload (0 designs)
    const isFirstTimeUpload = totalDesigns === 0;
    const minDesignsRequired = isFirstTimeUpload ? 2 : 1;

    return NextResponse.json({
      success: true,
      isFirstTimeUpload,
      totalDesigns,
      minDesignsRequired,
      maxDesigns: 10
    });

  } catch (error) {
    console.error('Check first upload error:', error);
    return NextResponse.json(
      { error: 'Failed to check upload status' },
      { status: 500 }
    );
  }
}
