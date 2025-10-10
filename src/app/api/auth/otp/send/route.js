import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User, Buyer, Designer } from '../../../../../models/User';
import { generateOTP, getOTPExpiry, sendEmailOTP, sendMobileOTP } from '../../../../../lib/otpService';

/**
 * POST /api/auth/otp/send
 * Send OTP to email or mobile number
 */
export async function POST(request) {
  try {
    await connectDB();

    const { email, mobileNumber, type, userId } = await request.json();

    // Validate input
    if (!type || !['email', 'mobile'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    let user;
    let userName = 'User';

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
        userName = buyer.fullName;
      } else if (designer) {
        user = await User.findById(designer.userId);
        userName = designer.fullName;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // Update user with OTP
    if (type === 'email') {
      user.emailOtp = {
        code: otp,
        expiresAt,
        verified: false
      };

      // Send email OTP
      const emailResult = await sendEmailOTP(user.email, otp, userName);

      if (!emailResult.success) {
        return NextResponse.json(
          { error: 'Failed to send email OTP', details: emailResult.error },
          { status: 500 }
        );
      }
    } else if (type === 'mobile') {
      user.mobileOtp = {
        code: otp,
        expiresAt,
        verified: false
      };

      // Get mobile number from buyer or designer profile
      let mobile = mobileNumber;
      if (!mobile) {
        const buyer = await Buyer.findOne({ userId: user._id });
        const designer = await Designer.findOne({ userId: user._id });
        mobile = buyer?.mobileNumber || designer?.mobileNumber;
      }

      if (!mobile) {
        return NextResponse.json(
          { error: 'Mobile number not found' },
          { status: 400 }
        );
      }

      // Send Mobile OTP (WhatsApp/SMS based on configuration)
      const mobileResult = await sendMobileOTP(mobile, otp, userName);

      if (!mobileResult.success) {
        return NextResponse.json(
          { error: 'Failed to send mobile OTP', details: mobileResult.error },
          { status: 500 }
        );
      }
    }

    // Save user with OTP
    await user.save();

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${type === 'email' ? 'email' : 'WhatsApp'} successfully`,
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP', details: error.message },
      { status: 500 }
    );
  }
}
