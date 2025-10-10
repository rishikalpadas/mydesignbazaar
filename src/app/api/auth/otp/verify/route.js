import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User, Buyer, Designer } from '../../../../../models/User';
import { isOTPExpired } from '../../../../../lib/otpService';

/**
 * POST /api/auth/otp/verify
 * Verify OTP for email or mobile number
 */
export async function POST(request) {
  try {
    await connectDB();

    const { email, mobileNumber, otp, type, userId } = await request.json();

    // Validate input
    if (!type || !['email', 'mobile'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    let user;

    // Find user by userId, email, or mobile
    if (userId) {
      user = await User.findById(userId);
    } else if (type === 'email' && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (type === 'mobile' && mobileNumber) {
      // Find buyer or designer with this mobile number
      const buyer = await Buyer.findOne({ mobileNumber });
      const designer = await Designer.findOne({ mobileNumber });

      if (buyer) {
        user = await User.findById(buyer.userId);
      } else if (designer) {
        user = await User.findById(designer.userId);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify OTP based on type
    let isValid = false;
    let otpData;

    if (type === 'email') {
      otpData = user.emailOtp;

      if (!otpData || !otpData.code) {
        return NextResponse.json(
          { error: 'No OTP found. Please request a new OTP.' },
          { status: 400 }
        );
      }

      if (otpData.verified) {
        return NextResponse.json(
          { error: 'Email already verified' },
          { status: 400 }
        );
      }

      if (isOTPExpired(otpData.expiresAt)) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new OTP.' },
          { status: 400 }
        );
      }

      if (otpData.code === otp) {
        isValid = true;
        user.emailOtp.verified = true;
      }

    } else if (type === 'mobile') {
      otpData = user.mobileOtp;

      if (!otpData || !otpData.code) {
        return NextResponse.json(
          { error: 'No OTP found. Please request a new OTP.' },
          { status: 400 }
        );
      }

      if (otpData.verified) {
        return NextResponse.json(
          { error: 'Mobile number already verified' },
          { status: 400 }
        );
      }

      if (isOTPExpired(otpData.expiresAt)) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new OTP.' },
          { status: 400 }
        );
      }

      if (otpData.code === otp) {
        isValid = true;
        user.mobileOtp.verified = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Check if both email and mobile are verified, then mark user as verified
    if (user.emailOtp?.verified && user.mobileOtp?.verified) {
      user.isVerified = true;
    }

    // Save user
    await user.save();

    return NextResponse.json({
      success: true,
      message: `${type === 'email' ? 'Email' : 'Mobile number'} verified successfully`,
      verified: type === 'email' ? user.emailOtp.verified : user.mobileOtp.verified,
      allVerified: user.isVerified
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP', details: error.message },
      { status: 500 }
    );
  }
}
