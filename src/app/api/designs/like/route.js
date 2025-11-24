import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Like from '../../../../models/Like';
import Design from '../../../../models/Design';
import jwt from 'jsonwebtoken';

// GET - Fetch like count and user's like status for a design
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('designId');

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      );
    }

    // Get total like count for the design
    const likeCount = await Like.countDocuments({ designId });

    // Check if current user has liked this design (if authenticated)
    let isLiked = false;
    const token = request.cookies.get('auth-token')?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const existingLike = await Like.findOne({
          userId: decoded.userId,
          designId: designId,
        });
        isLiked = !!existingLike;
      } catch (error) {
        // Invalid token, just return isLiked as false
        console.log('Invalid token for like check');
      }
    }

    return NextResponse.json({
      success: true,
      likeCount,
      isLiked,
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like data' },
      { status: 500 }
    );
  }
}

// POST - Toggle like (add or remove)
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { designId } = await request.json();

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      );
    }

    // Check if design exists
    const design = await Design.findById(designId);
    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    // Check if like already exists
    const existingLike = await Like.findOne({
      userId: decoded.userId,
      designId: designId,
    });

    let isLiked;
    let likeCount;

    if (existingLike) {
      // Remove like (unlike)
      await Like.deleteOne({ _id: existingLike._id });
      
      // Decrement like count in Design model
      const currentLikes = design.likes || 0;
      await Design.findByIdAndUpdate(designId, {
        $set: { likes: Math.max(0, currentLikes - 1) }
      });
      
      isLiked = false;
    } else {
      // Add like
      await Like.create({
        userId: decoded.userId,
        designId: designId,
      });
      
      // Increment like count in Design model
      const currentLikes = design.likes || 0;
      await Design.findByIdAndUpdate(designId, {
        $set: { likes: currentLikes + 1 }
      });
      
      isLiked = true;
    }

    // Get updated like count from the database
    likeCount = await Like.countDocuments({ designId });

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
      message: isLiked ? 'Design liked successfully' : 'Like removed successfully',
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already liked this design' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
