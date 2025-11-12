import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Cart from '../../../../models/Cart';
import Design from '../../../../models/Design';
import { verifyToken } from '../../../../middleware/auth';

// GET - Fetch cart items with design details
export async function GET(request) {
  try {
    await connectDB();

    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const userId = authResult.decoded.userId;

    // Get or create cart
    let cart = await Cart.getOrCreateCart(userId);

    // Populate design details
    await cart.populate({
      path: 'items.designId',
      select: 'designId title description category previewImages previewImage price status featured views downloads uploadedBy',
    });

    // Filter out any null designs (in case design was deleted)
    cart.items = cart.items.filter(item => item.designId !== null);
    await cart.save();

    return NextResponse.json({
      success: true,
      cart: {
        items: cart.items,
        count: cart.items.length,
        totalItems: cart.items.length
      }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    await connectDB();

    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const userId = authResult.decoded.userId;
    const { designId } = await request.json();

    if (!designId) {
      return NextResponse.json(
        { success: false, message: 'Design ID is required' },
        { status: 400 }
      );
    }

    // Check if design exists and is approved
    const design = await Design.findById(designId);
    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Design not found' },
        { status: 404 }
      );
    }

    if (design.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Design is not available' },
        { status: 400 }
      );
    }

    // Get or create cart and add item
    const cart = await Cart.getOrCreateCart(userId);
    await cart.addItem(designId);

    // Populate and return updated cart
    await cart.populate({
      path: 'items.designId',
      select: 'designId title description category previewImages previewImage price status featured views downloads',
    });

    return NextResponse.json({
      success: true,
      message: 'Design added to cart',
      cart: {
        items: cart.items,
        count: cart.items.length,
        totalItems: cart.items.length
      }
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request) {
  try {
    await connectDB();

    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const userId = authResult.decoded.userId;
    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('designId');

    if (!designId) {
      return NextResponse.json(
        { success: false, message: 'Design ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    await cart.removeItem(designId);

    // Populate and return updated cart
    await cart.populate({
      path: 'items.designId',
      select: 'designId title description category previewImages previewImage price status featured views downloads',
    });

    return NextResponse.json({
      success: true,
      message: 'Design removed from cart',
      cart: {
        items: cart.items,
        count: cart.items.length,
        totalItems: cart.items.length
      }
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
