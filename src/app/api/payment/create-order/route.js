import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '../../../../lib/mongodb';
import { verifyToken } from '../../../../middleware/auth';
import { UserSubscription } from '../../../../models/Subscription';

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

    // Only buyers can purchase subscriptions
    if (userType !== 'buyer') {
      return NextResponse.json(
        { error: 'Only buyers can purchase subscriptions' },
        { status: 403 }
      );
    }

    const { planId, planName, amount, credits, validityDays } = await request.json();

    // Validate required fields
    if (!planId || !planName || !amount || !credits || !validityDays) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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
        { error: 'You already have an active subscription. Please wait for it to expire before purchasing a new one.' },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Calculate GST (18%)
    const baseAmount = amount;
    const gstAmount = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + gstAmount;

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `sub_${planId}_${userId}_${Date.now()}`,
      notes: {
        userId,
        planId,
        planName,
        credits,
        validityDays,
        baseAmount,
        gstAmount,
        totalAmount
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: totalAmount,
      baseAmount,
      gstAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      planDetails: {
        planId,
        planName,
        credits,
        validityDays
      }
    });

  } catch (error) {
    console.error('Create Razorpay order error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
