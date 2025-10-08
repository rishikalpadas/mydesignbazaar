import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { UserSubscription } from '../../../../models/Subscription';
import { Buyer } from '../../../../models/User';
import { verifyToken } from '../../../../middleware/auth';

export async function GET(request) {
  try {
    await connectDB();

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const userType = authResult.user.userType;

    // Only buyers can have subscriptions
    if (userType !== 'buyer') {
      return NextResponse.json(
        { error: 'Only buyers can have subscriptions' },
        { status: 403 }
      );
    }

    // Get buyer profile (without populate to avoid schema errors)
    const buyer = await Buyer.findOne({ userId });

    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Get active subscription directly
    const activeSubscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    // Check if subscription is valid
    const hasValidSubscription = activeSubscription && activeSubscription.isValid();

    // Return subscription status
    return NextResponse.json({
      hasSubscription: !!activeSubscription,
      isValid: hasValidSubscription,
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
        daysRemaining: Math.ceil((activeSubscription.expiryDate - new Date()) / (1000 * 60 * 60 * 24)),
      } : null
    }, { status: 200 });

  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
