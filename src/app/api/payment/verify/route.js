import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '../../../../lib/mongodb';
import { verifyToken } from '../../../../middleware/auth';
import { UserSubscription } from '../../../../models/Subscription';
import { Buyer } from '../../../../models/User';

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

    if (userType !== 'buyer') {
      return NextResponse.json(
        { error: 'Only buyers can purchase subscriptions' },
        { status: 403 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      planName,
      credits,
      validityDays,
      amount
    } = await request.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    // Payment verified successfully - Create subscription
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + validityDays);

    const subscription = await UserSubscription.create({
      userId,
      planId,
      planName,
      creditsTotal: credits,
      creditsRemaining: credits,
      creditsUsed: 0,
      startDate,
      expiryDate,
      status: 'active',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: 'razorpay',
      amountPaid: amount,
      autoRenew: false
    });

    // Update buyer profile
    await Buyer.findOneAndUpdate(
      { userId },
      {
        currentSubscription: subscription._id,
        $push: { subscriptionHistory: subscription._id },
        $inc: { subscriptionCount: 1 }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated successfully!',
      subscription: {
        id: subscription._id,
        planId: subscription.planId,
        planName: subscription.planName,
        creditsTotal: subscription.creditsTotal,
        creditsRemaining: subscription.creditsRemaining,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        status: subscription.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment. Please contact support if amount was deducted.' },
      { status: 500 }
    );
  }
}
