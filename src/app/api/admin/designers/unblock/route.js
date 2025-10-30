import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User } from '../../../../../models/User';
import { unblockDesignerAccount } from '../../../../../lib/designerManagementService';
import { withAuth } from '../../../../../middleware/auth';

/**
 * @route POST /api/admin/designers/unblock
 * @desc Unblock a designer account and remove credentials from blocklist
 * @access Admin only
 */
async function handler(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, unblockRemarks } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Designer user ID is required' },
        { status: 400 }
      );
    }

    // Get admin information from the request (set by withAuth middleware)
    const adminId = request.user._id || request.decoded.userId;
    const adminUser = request.user;

    // Unblock the designer account (remarks are optional)
    const result = await unblockDesignerAccount({
      userId,
      adminId,
      unblockRemarks: unblockRemarks ? unblockRemarks.trim() : null,
      adminInfo: {
        email: adminUser.email,
        name: adminUser.name || adminUser.fullName || 'Admin',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unblocking designer:', error);

    // Handle specific error messages
    if (error.message === 'User not found') {
      return NextResponse.json(
        { success: false, message: 'Designer not found' },
        { status: 404 }
      );
    }

    if (error.message === 'User is not a designer') {
      return NextResponse.json(
        { success: false, message: 'User is not a designer' },
        { status: 400 }
      );
    }

    if (error.message === 'Designer profile not found') {
      return NextResponse.json(
        { success: false, message: 'Designer profile not found' },
        { status: 404 }
      );
    }

    if (error.message === 'Designer account is not blocked') {
      return NextResponse.json(
        { success: false, message: 'Designer account is not currently blocked' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to unblock designer account', error: error.message },
      { status: 500 }
    );
  }
}

// Export with auth and permission middleware
export const POST = withAuth(handler);
