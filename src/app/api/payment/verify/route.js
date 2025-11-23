import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '../../../../lib/mongodb';
import { verifyToken } from '../../../../middleware/auth';
import { UserSubscription, User_Subscription_Credits } from '../../../../models/Subscription';
import { Buyer } from '../../../../models/User';

export async function POST(request) {
  try {
    console.log('[PAYMENT-VERIFY] Starting payment verification...');
    await connectDB();
    console.log('[PAYMENT-VERIFY] Database connected');

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      console.error('[PAYMENT-VERIFY] Auth failed:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const userType = authResult.user.userType;
    console.log('[PAYMENT-VERIFY] User authenticated:', { userId, userType });

    if (userType !== 'buyer') {
      console.error('[PAYMENT-VERIFY] User is not a buyer');
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

    console.log('[PAYMENT-VERIFY] Payment data:', {
      razorpay_order_id,
      razorpay_payment_id,
      planId,
      planName,
      credits,
      validityDays,
      amount
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('[PAYMENT-VERIFY] Missing payment verification data');
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
      console.error('[PAYMENT-VERIFY] Signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    console.log('[PAYMENT-VERIFY] Razorpay signature verified successfully');

    // Payment verified successfully - Create new subscription record in User_Subscription_Credits
    console.log('[PAYMENT-VERIFY] Creating new subscription credits record...');
    
    // Create new subscription credits record for each purchase
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + validityDays);

    console.log('[PAYMENT-VERIFY] Creating with data:', {
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

    const subscriptionCredits = await User_Subscription_Credits.create({
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
      autoRenew: false,
      additionalPurchases: []
    });

    console.log('[PAYMENT-VERIFY] Subscription credits created successfully:', subscriptionCredits._id);

    // Update buyer profile with new subscription
    await Buyer.findOneAndUpdate(
      { userId },
      {
        $inc: { subscriptionCount: 1 }
      }
    );
    console.log('[PAYMENT-VERIFY] Buyer profile updated');

    console.log('[PAYMENT-VERIFY] Payment verification completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated successfully!',
      subscription: {
        id: subscriptionCredits._id,
        planId: subscriptionCredits.planId,
        planName: subscriptionCredits.planName,
        creditsTotal: subscriptionCredits.creditsTotal,
        creditsRemaining: subscriptionCredits.creditsRemaining,
        startDate: subscriptionCredits.startDate,
        expiryDate: subscriptionCredits.expiryDate,
        status: subscriptionCredits.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[PAYMENT-VERIFY] ERROR:', error);
    console.error('[PAYMENT-VERIFY] Error name:', error.name);
    console.error('[PAYMENT-VERIFY] Error message:', error.message);
    console.error('[PAYMENT-VERIFY] Error stack:', error.stack);
    
    // Log more details about MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('[PAYMENT-VERIFY] MongoDB Error Code:', error.code);
      console.error('[PAYMENT-VERIFY] MongoDB Error Details:', error.writeErrors);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to verify payment. Please contact support if amount was deducted.',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          name: error.name,
          code: error.code
        } : undefined
      },
      { status: 500 }
    );
  }
}
