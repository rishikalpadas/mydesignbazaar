import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User } from '../../../../../models/User';
import { deleteDesignerAccount } from '../../../../../lib/designerManagementService';
import { withAuth } from '../../../../../middleware/auth';

/**
 * @route DELETE /api/admin/designers/delete
 * @desc Permanently delete a designer account (allows credential re-use)
 * @access Admin only
 */
async function handler(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, deleteReason } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Designer user ID is required' },
        { status: 400 }
      );
    }

    if (!deleteReason || deleteReason.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Delete reason is required' },
        { status: 400 }
      );
    }

    // Get admin information from the request (set by withAuth middleware)
    const adminId = request.user._id || request.decoded.userId;
    const adminUser = request.user;

    // Delete the designer account
    const result = await deleteDesignerAccount({
      userId,
      adminId,
      deleteReason: deleteReason.trim(),
      adminInfo: {
        email: adminUser.email,
        name: adminUser.name || adminUser.fullName || 'Admin',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        deletedDesignsCount: result.deletedDesignsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting designer:', error);

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

    return NextResponse.json(
      { success: false, message: 'Failed to delete designer account', error: error.message },
      { status: 500 }
    );
  }
}

// Export with auth and permission middleware
// Note: You'll need to implement withPermission middleware or adjust based on your auth setup
export const DELETE = withAuth(handler);
export const POST = withAuth(handler); // Also support POST for better compatibility
