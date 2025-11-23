import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Design from '../../../../../models/Design';
import { verifyToken } from '../../../../../middleware/auth';

export async function POST(request, { params }) {
  try {
    await connectDB();

    // Verify user is authenticated and is a buyer
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userType = authResult.user.userType;

    // Only buyers can increment view count
    if (userType !== 'buyer') {
      return NextResponse.json(
        { error: 'Only buyers can view designs' },
        { status: 403 }
      );
    }

    const { id: designId } = await params;

    // Get design
    const design = await Design.findById(designId);
    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Design.findByIdAndUpdate(designId, {
      $inc: { views: 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'View count updated'
    }, { status: 200 });

  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
