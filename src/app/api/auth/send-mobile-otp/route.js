import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { generateOTP, getOTPExpiry, sendMobileOTP } from '../../../../lib/otpService';

export async function POST(request) {
  try {
    await connectDB();

    const { phoneNumber, userName, email } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Find user by email (preferred) or phone number
    let existingUser;
    if (email) {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } else {
      existingUser = await User.findOne({ 'mobileOtp.phoneNumber': cleanPhone });
    }

    if (existingUser && existingUser.mobileOtp?.verified && existingUser.mobileOtp?.phoneNumber === cleanPhone) {
      return NextResponse.json(
        { error: 'Phone number already verified' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // Update or create user with mobile OTP
    if (existingUser) {
      existingUser.mobileOtp = {
        code: otp,
        expiresAt,
        verified: false,
        phoneNumber: cleanPhone
      };
      await existingUser.save();
    } else {
      // This shouldn't happen during normal registration flow (email OTP should create user first)
      // But handle it just in case
      return NextResponse.json(
        { error: 'Please verify your email first before verifying mobile number' },
        { status: 400 }
      );
    }

    // Send OTP via WhatsApp/SMS
    const result = await sendMobileOTP(cleanPhone, otp, userName || 'User');

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Failed to send OTP. Please check your SMS/WhatsApp configuration.',
          details: result.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully to your WhatsApp/mobile',
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Send mobile OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
