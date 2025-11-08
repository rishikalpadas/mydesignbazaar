import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Wishlist from '../../../models/Wishlist';
import Design from '../../../models/Design';
import { verifyToken } from '../../../middleware/auth';

// GET - Fetch user's wishlist with populated design details
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

    // Get or create wishlist
    let wishlist = await Wishlist.getOrCreateWishlist(userId);

    // Populate design details
    wishlist = await wishlist.populate({
      path: 'items.designId',
      select: 'designId title description category previewImages previewImage tags uploadedBy status featured',
      populate: {
        path: 'uploadedBy',
        select: 'email',
        populate: {
          path: 'userId',
          model: 'Designer',
          select: 'fullName displayName'
        }
      }
    });

    // Filter out any null designs (in case design was deleted)
    wishlist.items = wishlist.items.filter(item => item.designId !== null);
    await wishlist.save();

    return NextResponse.json({
      success: true,
      wishlist: {
        items: wishlist.items,
        count: wishlist.items.length,
      }
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
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

    // Get or create wishlist and add item
    const wishlist = await Wishlist.getOrCreateWishlist(userId);
    await wishlist.addItem(designId);

    // Populate and return updated wishlist
    await wishlist.populate({
      path: 'items.designId',
      select: 'designId title description category previewImages previewImage tags uploadedBy status',
    });

    return NextResponse.json({
      success: true,
      message: 'Design added to wishlist',
      wishlist: {
        items: wishlist.items,
        count: wishlist.items.length,
      }
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
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

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: 'Wishlist not found' },
        { status: 404 }
      );
    }

    await wishlist.removeItem(designId);

    // Populate and return updated wishlist
    await wishlist.populate({
      path: 'items.designId',
      select: 'designId title description category previewImages previewImage tags uploadedBy status',
    });

    return NextResponse.json({
      success: true,
      message: 'Design removed from wishlist',
      wishlist: {
        items: wishlist.items,
        count: wishlist.items.length,
      }
    });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
