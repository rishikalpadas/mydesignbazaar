import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    return NextResponse.json({
      success: true,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        razorpayKeyIdExists: !!razorpayKeyId,
        razorpayKeySecretExists: !!razorpayKeySecret,
        razorpayKeyIdValue: razorpayKeyId ? `${razorpayKeyId.substring(0, 10)}...` : 'Not Set',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
