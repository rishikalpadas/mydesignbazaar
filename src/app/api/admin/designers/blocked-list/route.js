import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User, Designer } from '../../../../../models/User';
import { withAuth } from '../../../../../middleware/auth';

/**
 * @route GET /api/admin/designers/blocked-list
 * @desc Get list of blocked designers
 * @access Admin only
 */
async function handler(request) {
  try {
    await connectDB();

    // Find all designers with blocked status
    const blockedDesigners = await Designer.find({
      accountStatus: 'blocked'
    }).populate('userId', 'email isApproved isVerified createdAt');

    // Format the response
    const formattedDesigners = blockedDesigners.map(designer => ({
      _id: designer.userId._id,
      email: designer.userId.email,
      isApproved: designer.userId.isApproved,
      isVerified: designer.userId.isVerified,
      createdAt: designer.userId.createdAt,
      profile: {
        fullName: designer.fullName,
        displayName: designer.displayName,
        mobileNumber: designer.mobileNumber,
        accountStatus: designer.accountStatus,
        blockedAt: designer.blockedAt,
        blockedBy: designer.blockedBy,
        blockReason: designer.blockReason,
      }
    }));

    return NextResponse.json(
      {
        success: true,
        designers: formattedDesigners,
        count: formattedDesigners.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blocked designers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blocked designers', error: error.message },
      { status: 500 }
    );
  }
}

// Export with auth middleware
export const GET = withAuth(handler);
