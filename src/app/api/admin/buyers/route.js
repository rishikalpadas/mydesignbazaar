import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { UserSubscription } from '../../../../models/Subscription';
import { Buyer, User } from '../../../../models/User';
import { verifyToken } from '../../../../middleware/auth';

// Get all buyers with their subscription details
export async function GET(request) {
  try {
    await connectDB();

    // Verify admin authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Check if user is admin
    if (!authResult.user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all buyers
    const buyers = await Buyer.find().lean();

    // Enrich with user data and subscription info
    const buyersWithDetails = await Promise.all(
      buyers.map(async (buyer) => {
        // Get user data
        const user = await User.findById(buyer.userId).select('-password').lean();

        // Get active subscription
        const activeSubscription = await UserSubscription.findOne({
          userId: buyer.userId,
          status: 'active',
          expiryDate: { $gt: new Date() }
        }).lean();

        // Get subscription history count
        const subscriptionCount = await UserSubscription.countDocuments({
          userId: buyer.userId
        });

        return {
          _id: buyer._id,
          userId: buyer.userId,
          email: user?.email,
          fullName: buyer.fullName,
          mobileNumber: buyer.mobileNumber,
          businessType: buyer.businessType,
          totalPurchases: buyer.totalPurchases || 0,
          totalSpent: buyer.totalSpent || 0,
          isVerified: user?.isVerified || false,
          createdAt: user?.createdAt,

          // Complete profile information
          address: buyer.address || {},
          paymentMethods: buyer.paymentMethods || [],
          billingCurrency: buyer.billingCurrency || 'INR',
          interestedCategories: buyer.interestedCategories || [],
          purchaseFrequency: buyer.purchaseFrequency || '',
          agreements: buyer.agreements || {},

          subscription: activeSubscription ? {
            id: activeSubscription._id,
            planId: activeSubscription.planId,
            planName: activeSubscription.planName,
            creditsTotal: activeSubscription.creditsTotal,
            creditsRemaining: activeSubscription.creditsRemaining,
            creditsUsed: activeSubscription.creditsUsed,
            startDate: activeSubscription.startDate,
            expiryDate: activeSubscription.expiryDate,
            status: activeSubscription.status,
            daysRemaining: Math.ceil((new Date(activeSubscription.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
          } : null,
          subscriptionCount
        };
      })
    );

    // Sort by creation date (newest first)
    buyersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      buyers: buyersWithDetails,
      count: buyersWithDetails.length
    }, { status: 200 });

  } catch (error) {
    console.error('Get buyers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    );
  }
}
