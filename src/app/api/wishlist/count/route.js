import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Wishlist from '../../../../models/Wishlist';
import { verifyToken } from '../../../../middleware/auth';

// GET - Fetch wishlist item count
export async function GET(request) {
  try {
    await connectDB();

    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: true, count: 0 },
        { status: 200 }
      );
    }

    const userId = authResult.decoded.userId;

    const wishlist = await Wishlist.findOne({ userId });
    const count = wishlist ? wishlist.items.length : 0;

    return NextResponse.json({
      success: true,
      count,
    });

  } catch (error) {
    console.error('Error fetching wishlist count:', error);
    return NextResponse.json(
      { success: true, count: 0 },
      { status: 200 }
    );
  }
}
