import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Cart from '../../../../models/Cart';
import { verifyToken } from '../../../../middleware/auth';

// GET - Fetch cart item count
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

    const cart = await Cart.findOne({ userId });
    const count = cart ? cart.items.length : 0;

    return NextResponse.json({
      success: true,
      count,
    });

  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json(
      { success: true, count: 0 },
      { status: 200 }
    );
  }
}
