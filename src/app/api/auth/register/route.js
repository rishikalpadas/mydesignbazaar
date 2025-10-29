import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/mongodb';
import { User, Designer, Buyer } from '../../../../models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userType, email, password, ...profileData } = body;

    // Validate required fields
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email: email.toLowerCase() });

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    let savedUser;

    if (existingUser) {
      // User exists from OTP verification - update with registration data
      // Only allow if this is a temporary user (password is still 'temporary')
      if (existingUser.password !== 'temporary') {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 400 }
        );
      }

      // Update temporary user with actual registration data
      existingUser.password = hashedPassword;
      existingUser.userType = userType;
      existingUser.isVerified = existingUser.emailOtp?.verified || false;
      existingUser.isApproved = userType === 'buyer' ? true : false;

      savedUser = await existingUser.save();
    } else {
      // Create new user (shouldn't happen with OTP flow, but keep as fallback)
      const newUser = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        userType,
        isVerified: false,
        isApproved: userType === 'buyer' ? true : false,
        emailOtp: {
          code: null,
          expiresAt: null,
          verified: false
        }
      });

      savedUser = await newUser.save();
    }

    // Create profile based on user type
    let profile;
    if (userType === 'designer') {
      profile = new Designer({
        userId: savedUser._id,
        fullName: profileData.fullName,
        displayName: profileData.displayName,
        mobileNumber: profileData.mobileNumber,
        alternativeContact: profileData.alternativeContact,
        aadhaarNumber: profileData.aadhaarNumber,
        aadhaarFiles: profileData.aadhaarFiles || [],
        address: {
          street: profileData.address?.street,
          city: profileData.address?.city,
          state: profileData.address?.state,
          postalCode: profileData.address?.postalCode,
          country: profileData.address?.country,
        },
        panNumber: profileData.panNumber,
        panCardFile: profileData.panCardFile,
        gstNumber: profileData.gstNumber,
        bankDetails: {
          accountHolderName: profileData.bankDetails?.accountHolderName,
          accountNumber: profileData.bankDetails?.accountNumber,
          bankName: profileData.bankDetails?.bankName,
          branch: profileData.bankDetails?.branch,
          ifscCode: profileData.bankDetails?.ifscCode,
          upiId: profileData.bankDetails?.upiId,
          paypalId: profileData.bankDetails?.paypalId,
        },
        portfolioLink: profileData.portfolioLink,
        portfolioLinks: profileData.portfolioLinks || [],
        specializations: profileData.specializations || [],
        otherSpecialization: profileData.otherSpecialization,
        agreements: {
          originalWork: profileData.agreements?.originalWork || false,
          noResponsibility: profileData.agreements?.noResponsibility || false,
          monetizationPolicy: profileData.agreements?.monetizationPolicy || false,
          platformPricing: profileData.agreements?.platformPricing || false,
          designRemoval: profileData.agreements?.designRemoval || false,
          minimumUploads: profileData.agreements?.minimumUploads || false,
        },
      });
    } else if (userType === 'buyer') {
      profile = new Buyer({
        userId: savedUser._id,
        fullName: profileData.fullName,
        mobileNumber: profileData.mobileNumber,
        businessType: profileData.businessType,
        address: {
          street: profileData.address?.street,
          city: profileData.address?.city,
          state: profileData.address?.state,
          postalCode: profileData.address?.postalCode,
          country: profileData.address?.country,
          gstNumber: profileData.address?.gstNumber,
        },
        paymentMethods: profileData.paymentMethods || [],
        billingCurrency: profileData.billingCurrency || 'INR',
        interestedCategories: profileData.interestedCategories || [],
        purchaseFrequency: profileData.purchaseFrequency,
        agreements: {
          licensedUse: profileData.agreements?.licensedUse || false,
          noCopyright: profileData.agreements?.noCopyright || false,
          refundPolicy: profileData.agreements?.refundPolicy || false,
          noIllegalDesigns: profileData.agreements?.noIllegalDesigns || false,
          compliance: profileData.agreements?.compliance || false,
        },
      });
    }

    if (profile) {
      await profile.save();
    }

    // Return success response (exclude password)
    const userResponse = {
      id: savedUser._id,
      email: savedUser.email,
      userType: savedUser.userType,
      isVerified: savedUser.isVerified,
      isApproved: savedUser.isApproved,
      createdAt: savedUser.createdAt,
    };

    return NextResponse.json({
      message: userType === 'designer' 
        ? 'Designer application submitted successfully. Admin review within 3-7 working days.'
        : 'Account created successfully. Please check your email for verification.',
      user: userResponse,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}