import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { User, Designer } from '../../../../models/User';
import Design from '../../../../models/Design';
import ProfilePicture from '../../../../models/ProfilePicture';
import { verifyToken } from '../../../../middleware/auth';

// GET - Fetch designer profile with monetization stats
export async function GET(request) {
  try {
    await connectDB();

    const authResult = await verifyToken(request);
    if (authResult.error) {
      console.error('[PROFILE] Auth failed:', authResult.error);
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const userId = authResult.decoded.userId;
    console.log('[PROFILE] Fetching profile for user:', userId);

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      console.error('[PROFILE] User not found:', userId);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('[PROFILE] User found, type:', user.userType);

    if (user.userType !== 'designer') {
      console.error('[PROFILE] Not a designer account:', user.userType);
      return NextResponse.json(
        { success: false, message: 'Designer account not found' },
        { status: 404 }
      );
    }

    // Get designer details
    const designer = await Designer.findOne({ userId: user._id });
    if (!designer) {
      console.error('[PROFILE] Designer profile not found for user:', userId);
      return NextResponse.json(
        { success: false, message: 'Designer profile not found' },
        { status: 404 }
      );
    }

    console.log('[PROFILE] Designer profile found:', designer.fullName);

    // Fetch profile picture from ProfilePicture collection
    const profilePicture = await ProfilePicture.findOne({ userId: user._id });

    // Get design statistics
    const totalDesigns = await Design.countDocuments({ uploadedBy: user._id });
    const approvedDesigns = await Design.countDocuments({
      uploadedBy: user._id,
      status: 'approved'
    });
    const pendingDesigns = await Design.countDocuments({
      uploadedBy: user._id,
      status: 'pending'
    });
    const rejectedDesigns = await Design.countDocuments({
      uploadedBy: user._id,
      status: 'rejected'
    });

    // Monetization eligibility calculation
    const MONETIZATION_THRESHOLD = 100; // Needs 100 approved designs
    const monetizationProgress = Math.min((approvedDesigns / MONETIZATION_THRESHOLD) * 100, 100);
    const isMonetizationEligible = approvedDesigns >= MONETIZATION_THRESHOLD;
    const remainingDesigns = Math.max(MONETIZATION_THRESHOLD - approvedDesigns, 0);

    // Prepare response
    const profileData = {
      // User basic info
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified,
      isApproved: user.isApproved,
      creditPoints: user.creditPoints || 0,
      createdAt: user.createdAt,

      // Designer details
      fullName: designer.fullName,
      displayName: designer.displayName,
      profile_pic: profilePicture ? profilePicture.imageUrl : (designer.profile_pic || null),
      mobileNumber: designer.mobileNumber,
      alternativeContact: designer.alternativeContact,
      aadhaarNumber: designer.aadhaarNumber,
      aadhaarFiles: designer.aadhaarFiles || [],
      panNumber: designer.panNumber,
      panCardFile: designer.panCardFile || null,
      gstNumber: designer.gstNumber,

      // Address
      address: designer.address,

      // Bank details (masked for security)
      bankDetails: {
        accountHolderName: designer.bankDetails?.accountHolderName || null,
        bankName: designer.bankDetails?.bankName || null,
        branch: designer.bankDetails?.branch || null,
        ifscCode: designer.bankDetails?.ifscCode || null,
        accountNumber: designer.bankDetails?.accountNumber
          ? `****${designer.bankDetails.accountNumber.slice(-4)}`
          : null,
        upiId: designer.bankDetails?.upiId || null,
        paypalId: designer.bankDetails?.paypalId || null,
      },

      // Portfolio
      portfolioLinks: designer.portfolioLinks || [],
      specializations: designer.specializations || [],
      otherSpecialization: designer.otherSpecialization,

      // Stats
      stats: {
        totalDesigns,
        approvedDesigns,
        pendingDesigns,
        rejectedDesigns,
        totalEarnings: designer.totalEarnings || 0,
      },

      // Monetization info
      monetization: {
        threshold: MONETIZATION_THRESHOLD,
        currentApproved: approvedDesigns,
        remainingDesigns,
        progress: parseFloat(monetizationProgress.toFixed(2)),
        isEligible: isMonetizationEligible,
        status: isMonetizationEligible ? 'eligible' : 'in_progress',
      },

      // Account status
      accountStatus: designer.accountStatus || 'active',
    };

    return NextResponse.json({
      success: true,
      profile: profileData,
    });

  } catch (error) {
    console.error('Error fetching designer profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update designer profile
export async function PUT(request) {
  try {
    await connectDB();

    const authResult = await verifyToken(request);
    if (authResult.error) {
      console.error('[PROFILE UPDATE] Auth failed:', authResult.error);
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const userId = authResult.decoded.userId;
    const body = await request.json();
    
    console.log('[PROFILE UPDATE] Updating profile for user:', userId);

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.userType !== 'designer') {
      return NextResponse.json(
        { success: false, message: 'Not a designer account' },
        { status: 403 }
      );
    }

    // Get designer profile
    const designer = await Designer.findOne({ userId: user._id });
    if (!designer) {
      return NextResponse.json(
        { success: false, message: 'Designer profile not found' },
        { status: 404 }
      );
    }

    // Update fields
    const { profile, address, bankDetails } = body;

    if (profile) {
      if (profile.fullName) designer.fullName = profile.fullName;
      if (profile.displayName !== undefined) designer.displayName = profile.displayName;
      // Note: profile_pic is now stored in ProfilePicture collection, not in designer document
      if (profile.mobileNumber) designer.mobileNumber = profile.mobileNumber;
      if (profile.alternativeContact !== undefined) designer.alternativeContact = profile.alternativeContact;
    }

    if (address) {
      designer.address = { ...designer.address, ...address };
    }

    if (bankDetails) {
      designer.bankDetails = { ...designer.bankDetails, ...bankDetails };
    }

    await designer.save();

    console.log('[PROFILE UPDATE] Profile updated successfully');

    // Fetch current profile picture
    const profilePicture = await ProfilePicture.findOne({ userId: user._id });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        fullName: designer.fullName,
        displayName: designer.displayName,
        profile_pic: profilePicture ? profilePicture.imageUrl : null,
        mobileNumber: designer.mobileNumber,
        alternativeContact: designer.alternativeContact,
        address: designer.address,
      }
    });

  } catch (error) {
    console.error('Error updating designer profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
