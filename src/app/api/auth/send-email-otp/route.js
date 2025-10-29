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

    // Check if user already exists
    let existingUser = await User.findOne({ email: email.toLowerCase() });

    // Only block if this is a fully registered user (not a temporary one)
    if (existingUser && existingUser.password !== 'temporary' && existingUser.emailOtp?.verified) {
      return NextResponse.json(
        { error: 'Email address already registered. Please login instead.' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // Update OTP for existing user (including temporary users) or create new temporary user
    if (existingUser) {
      // Reset verification status and update OTP (allows re-verification)
      existingUser.emailOtp = {
        code: otp,
        expiresAt,
        verified: false
      };
      await existingUser.save();
    } else {
      // Create temporary user for OTP verification during registration
      existingUser = new User({
        email: email.toLowerCase(),
        password: 'temporary', // Will be replaced during actual registration
        userType: 'buyer', // Default, will be updated during registration
        emailOtp: {
          code: otp,
          expiresAt,
          verified: false
        }
      });
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
