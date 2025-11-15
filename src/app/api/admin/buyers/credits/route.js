import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { UserSubscription, CreditTransaction } from '../../../../../models/Subscription';
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

    // Get active subscription
    let subscription = await UserSubscription.findOne({
      userId: buyerId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    // If no active subscription, create one
    if (!subscription) {
      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days validity

      subscription = await UserSubscription.create({
        userId: buyerId,
        planId: 'basic', // Use basic as default for manual additions
        planName: 'Manual Credit Addition',
        creditsTotal: credits,
        creditsRemaining: credits,
        creditsUsed: 0,
        startDate,
        expiryDate,
        status: 'active',
        paymentId: 'admin_manual_' + Date.now(),
        paymentMethod: 'manual',
        amountPaid: 0,
        autoRenew: false
      });

      // Update buyer profile
      await Buyer.findOneAndUpdate(
        { userId: buyerId },
        {
          currentSubscription: subscription._id,
          $push: { subscriptionHistory: subscription._id }
        }
      );
    } else {
      // Update existing subscription
      if (operation === 'add') {
        subscription.creditsRemaining += credits;
        subscription.creditsTotal += credits;
      } else if (operation === 'set') {
        subscription.creditsRemaining = credits;
      } else if (operation === 'deduct') {
        if (subscription.creditsRemaining < credits) {
          return NextResponse.json(
            { error: 'Insufficient credits to deduct' },
            { status: 400 }
          );
        }
        // Only reduce creditsRemaining, do NOT increase creditsUsed
        // Admin deduction should not be counted as buyer usage
        // creditsTotal remains unchanged - it represents total credits available
        subscription.creditsRemaining -= credits;
      }

      await subscription.save();
    }

    // Create credit transaction record
    await CreditTransaction.create({
      userId: buyerId,
      subscriptionId: subscription._id,
      type: operation === 'deduct' ? 'debit' : 'credit',
      amount: credits,
      balanceAfter: subscription.creditsRemaining,
      description: reason || `Admin ${operation} credits: ${credits}`
    });

    // Get updated user info
    const user = await User.findById(buyerId);

    return NextResponse.json({
      success: true,
      message: `Successfully ${operation === 'add' ? 'added' : operation === 'set' ? 'set' : 'deducted'} ${credits} credits`,
      buyer: {
        email: user.email,
        creditsRemaining: subscription.creditsRemaining,
        creditsTotal: subscription.creditsTotal,
        planName: subscription.planName,
        expiryDate: subscription.expiryDate
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin credit management error:', error);
    return NextResponse.json(
      { error: 'Failed to manage credits' },
      { status: 500 }
    );
  }
}
