import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { isOTPExpired } from '../../../../lib/otpService';

export async function POST(request) {
  try {
    await connectDB();

    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Find user by phone number stored in mobileOtp
    const user = await User.findOne({
      'mobileOtp.phoneNumber': cleanPhone
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No OTP request found for this number. Please request a new OTP.' },
        { status: 404 }
      );
    }

    // Check if mobile is already verified
    if (user.mobileOtp?.verified) {
      return NextResponse.json({
        message: 'Phone number already verified',
        verified: true
      });
    }

    // Check if OTP exists
    if (!user.mobileOtp || !user.mobileOtp.code) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(user.mobileOtp.expiresAt)) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.mobileOtp.code !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Mark mobile as verified
    user.mobileOtp.verified = true;
    await user.save();

    return NextResponse.json({
      message: 'Phone number verified successfully!',
      verified: true
    });

  } catch (error) {
    console.error('Verify mobile OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
