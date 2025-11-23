import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '../../../../lib/mongodb';
import { verifyToken } from '../../../../middleware/auth';
import { UserSubscription } from '../../../../models/Subscription';

export async function POST(request) {
  try {
    console.log('[CREATE-ORDER] Starting payment order creation...');
    console.log('[CREATE-ORDER] Razorpay import:', typeof Razorpay, Razorpay.name);
    
    await connectDB();
    console.log('[CREATE-ORDER] Database connected');

    // Verify user authentication
    const authResult = await verifyToken(request);
    console.log('[CREATE-ORDER] Auth result:', { 
      hasError: !!authResult.error, 
      userId: authResult.decoded?.userId,
      userType: authResult.user?.userType 
    });
    
    if (authResult.error) {
      console.error('[CREATE-ORDER] Authentication failed:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const userType = authResult.user.userType;

    // Only buyers can purchase subscriptions
    if (userType !== 'buyer') {
      console.error('[CREATE-ORDER] User is not a buyer:', userType);
      return NextResponse.json(
        { error: 'Only buyers can purchase subscriptions' },
        { status: 403 }
      );
    }

    const { planId, planName, amount, credits, validityDays } = await request.json();
    console.log('[CREATE-ORDER] Request data:', { planId, planName, amount, credits, validityDays });

    // Validate required fields
    if (!planId || !planName || !amount || !credits || !validityDays) {
      console.error('[CREATE-ORDER] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      console.error('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not Set');
      console.error('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not Set');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('[CREATE-ORDER] Initializing Razorpay with Key ID:', process.env.RAZORPAY_KEY_ID);

    let razorpay;
    try {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      console.log('[CREATE-ORDER] Razorpay instance created successfully');
    } catch (rzpError) {
      console.error('[CREATE-ORDER] Failed to initialize Razorpay:', rzpError);
      throw new Error(`Razorpay initialization failed: ${rzpError.message}`);
    }

    // Calculate GST (5%)
    const baseAmount = amount;
    const gstAmount = Math.round(baseAmount * 0.05);
    const totalAmount = baseAmount + gstAmount;

    console.log('[CREATE-ORDER] Amounts calculated:', { baseAmount, gstAmount, totalAmount });

    // Create Razorpay order
    // Receipt must be ≤40 characters, so use a short unique identifier
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const userIdShort = userId.toString().slice(-6); // Last 6 chars of userId
    const receipt = `sub_${userIdShort}_${timestamp}`; // Format: sub_<userId>_<timestamp>
    
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: receipt,
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

    console.log('[CREATE-ORDER] Creating Razorpay order with options:', options);
    console.log('[CREATE-ORDER] Razorpay instance type:', typeof razorpay);
    console.log('[CREATE-ORDER] Razorpay.orders type:', typeof razorpay.orders);
    console.log('[CREATE-ORDER] Razorpay.orders.create type:', typeof razorpay.orders.create);

    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log('[CREATE-ORDER] Razorpay order created successfully:', order.id);
    } catch (rzpOrderError) {
      console.error('[CREATE-ORDER] Razorpay order.create() failed - Full error:', rzpOrderError);
      console.error('[CREATE-ORDER] Error type:', typeof rzpOrderError);
      console.error('[CREATE-ORDER] Error keys:', Object.keys(rzpOrderError || {}));
      
      // Razorpay errors can have different structures
      const errorMessage = rzpOrderError?.error?.description || 
                          rzpOrderError?.description || 
                          rzpOrderError?.message || 
                          JSON.stringify(rzpOrderError);
      
      throw new Error(`Razorpay order creation failed: ${errorMessage}`);
    }

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
    console.error('[CREATE-ORDER] ERROR:', error);
    console.error('[CREATE-ORDER] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      statusCode: error.statusCode,
      description: error.description
    });
    
    // Return more descriptive error
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create payment order. Please try again.',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          name: error.name,
          description: error.description
        } : undefined
      },
      { status: 500 }
    );
  }
}
