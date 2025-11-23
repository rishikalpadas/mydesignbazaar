import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { UserSubscription, CreditTransaction, UserCredits, CreditsOfUsers, User_Credits } from '../../../../../models/Subscription';
import { Buyer, User } from '../../../../../models/User';
import { verifyToken } from '../../../../../middleware/auth';

// Add credits to a buyer's subscription
export async function POST(request) {
  try {
    await connectDB();

    // Verify admin authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Check if user is admin
    if (!authResult.user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { buyerId, credits, reason, operation } = await request.json();

    // Validate input
    if (!buyerId || !credits || credits <= 0) {
      return NextResponse.json(
        { error: 'Invalid input. BuyerId and positive credits are required.' },
        { status: 400 }
      );
    }

    // Get buyer
    const buyer = await Buyer.findOne({ userId: buyerId });
    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    // Get or create User_Credits record
    let userCreditsRecord = await User_Credits.findOne({ userId: buyerId });
    
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days validity
    
    if (!userCreditsRecord) {
      userCreditsRecord = await User_Credits.create({
        userId: buyerId,
        planId: 'basic',
        planName: 'Manual Credit Addition',
        adminCredits: 0,
        creditsTotal: 0,
        creditsRemaining: 0,
        creditsUsed: 0,
        startDate,
        expiryDate,
        status: 'active',
        paymentId: 'admin_manual_' + Date.now(),
        paymentMethod: 'manual',
        amountPaid: 0,
        autoRenew: false,
        additionalPurchases: []
      });
    }

    // Store previous values for calculating changes
    const previousAdminCredits = userCreditsRecord.adminCredits || 0;
    
    // Update User_Credits based on operation
    if (operation === 'add') {
      userCreditsRecord.adminCredits = previousAdminCredits + credits;
      userCreditsRecord.creditsTotal = (userCreditsRecord.creditsTotal || 0) + credits;
      userCreditsRecord.creditsRemaining = (userCreditsRecord.creditsRemaining || 0) + credits;
    } else if (operation === 'set') {
      userCreditsRecord.adminCredits = credits;
      userCreditsRecord.creditsTotal = credits;
      userCreditsRecord.creditsRemaining = credits;
      userCreditsRecord.creditsUsed = 0;
    } else if (operation === 'deduct') {
      if (userCreditsRecord.creditsRemaining < credits) {
        return NextResponse.json(
          { error: 'Insufficient credits to deduct' },
          { status: 400 }
        );
      }
      userCreditsRecord.adminCredits = Math.max(0, previousAdminCredits - credits);
      userCreditsRecord.creditsTotal = Math.max(0, (userCreditsRecord.creditsTotal || 0) - credits);
      userCreditsRecord.creditsRemaining = Math.max(0, (userCreditsRecord.creditsRemaining || 0) - credits);
      userCreditsRecord.creditsUsed = (userCreditsRecord.creditsUsed || 0) + credits;
    }
    
    // Update other fields
    userCreditsRecord.paymentId = 'admin_manual_' + Date.now();
    userCreditsRecord.status = userCreditsRecord.creditsRemaining > 0 ? 'active' : 'expired';

    await userCreditsRecord.save();

    // Create credit transaction record
    await CreditTransaction.create({
      userId: buyerId,
      type: operation === 'deduct' ? 'debit' : 'credit',
      amount: credits,
      balanceAfter: userCreditsRecord.creditsRemaining,
      description: reason || `Admin ${operation} credits: ${credits}`
    });

    // Get updated user info
    const user = await User.findById(buyerId);

    return NextResponse.json({
      success: true,
      message: `Successfully ${operation === 'add' ? 'added' : operation === 'set' ? 'set' : 'deducted'} ${credits} credits`,
      buyer: {
        email: user.email,
        creditsRemaining: userCreditsRecord.creditsRemaining,
        creditsTotal: userCreditsRecord.creditsTotal,
        planName: userCreditsRecord.planName,
        expiryDate: userCreditsRecord.expiryDate
      },
      user_credits: {
        planId: userCreditsRecord.planId,
        planName: userCreditsRecord.planName,
        adminCredits: userCreditsRecord.adminCredits,
        creditsTotal: userCreditsRecord.creditsTotal,
        creditsRemaining: userCreditsRecord.creditsRemaining,
        creditsUsed: userCreditsRecord.creditsUsed,
        startDate: userCreditsRecord.startDate,
        expiryDate: userCreditsRecord.expiryDate,
        status: userCreditsRecord.status,
        paymentId: userCreditsRecord.paymentId,
        paymentMethod: userCreditsRecord.paymentMethod,
        amountPaid: userCreditsRecord.amountPaid,
        autoRenew: userCreditsRecord.autoRenew,
        additionalPurchases: userCreditsRecord.additionalPurchases
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin credit management error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to manage credits',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
