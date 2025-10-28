import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { isOTPExpired } from '../../../../lib/otpService';

export async function POST(request) {
  try {
    await connectDB();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      );
    }

    // Check if email is already verified
    if (user.emailOtp?.verified) {
      return NextResponse.json({
        message: 'Email already verified',
        verified: true
      });
    }

    // Check if OTP exists
    if (!user.emailOtp || !user.emailOtp.code) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(user.emailOtp.expiresAt)) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.emailOtp.code !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailOtp.verified = true;
    user.isVerified = true; // Also mark main user as verified
    await user.save();

    return NextResponse.json({
      message: 'Email verified successfully!',
      verified: true
    });

  } catch (error) {
    console.error('Verify email OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
