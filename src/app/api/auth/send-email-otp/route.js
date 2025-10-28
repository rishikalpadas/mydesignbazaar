import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { generateOTP, getOTPExpiry, sendEmailOTP } from '../../../../lib/otpService';

export async function POST(request) {
  try {
    await connectDB();

    const { email, userName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists with verified email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.emailOtp?.verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // If user exists (registration in progress), update OTP
    if (existingUser) {
      existingUser.emailOtp = {
        code: otp,
        expiresAt,
        verified: false
      };
      await existingUser.save();
    }

    // Send OTP via email
    const result = await sendEmailOTP(email, otp, userName || 'User');

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please check your email configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully to your email',
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Send email OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
