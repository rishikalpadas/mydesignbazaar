import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { UserSubscription } from '../../../../models/Subscription';
import { Buyer } from '../../../../models/User';
import { verifyToken } from '../../../../middleware/auth';

export async function POST(request) {
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
        { error: 'Only buyers can create subscriptions' },
        { status: 403 }
      );
    }

    // Check if user already has an active subscription
    const existingSubscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Create test subscription (Basic plan)
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15); // 15 days validity for Basic

    const subscription = await UserSubscription.create({
      userId,
      planId: 'basic',
      planName: 'Basic',
      creditsTotal: 10,
      creditsRemaining: 10,
      creditsUsed: 0,
      startDate,
      expiryDate,
      status: 'active',
      paymentId: 'test_payment_' + Date.now(),
      paymentMethod: 'test',
      amountPaid: 600,
      autoRenew: false
    });

    // Update buyer profile
    await Buyer.findOneAndUpdate(
      { userId },
      {
        currentSubscription: subscription._id,
        $push: { subscriptionHistory: subscription._id }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Test subscription created successfully',
      subscription: {
        id: subscription._id,
        planId: subscription.planId,
        planName: subscription.planName,
        creditsTotal: subscription.creditsTotal,
        creditsRemaining: subscription.creditsRemaining,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create test subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create test subscription' },
      { status: 500 }
    );
  }
}
