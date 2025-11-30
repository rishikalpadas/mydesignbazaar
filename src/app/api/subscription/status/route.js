import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { UserSubscription, User_Credits, User_Subscription_Credits } from '../../../../models/Subscription';
import { Buyer } from '../../../../models/User';
import { verifyToken } from '../../../../middleware/auth';

export async function GET(request) {
  try {
    await connectDB();

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const userType = authResult.user.userType;

    // Only buyers can have subscriptions
    if (userType !== 'buyer') {
      return NextResponse.json(
        { error: 'Only buyers can have subscriptions' },
        { status: 403 }
      );
    }

    // Get buyer profile (without populate to avoid schema errors)
    const buyer = await Buyer.findOne({ userId });

    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Get all user subscription credits (from paid plans) - sorted by expiry date (earliest first)
    const allSubscriptionCredits = await User_Subscription_Credits.find({ 
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() },
      creditsRemaining: { $gt: 0 }
    }).sort({ expiryDate: 1 }); // Sort by expiry date ascending
    
    // Get user credits (admin added)
    const adminCredits = await User_Credits.findOne({ userId });

    // Get the active plan that will be used next (earliest expiry with credits)
    const activePlan = allSubscriptionCredits.length > 0 ? allSubscriptionCredits[0] : null;

    // Calculate total from all subscription purchases
    const subscriptionCreditsTotal = allSubscriptionCredits.reduce((sum, sub) => sum + sub.creditsTotal, 0);
    const subscriptionCreditsRemaining = allSubscriptionCredits.reduce((sum, sub) => sum + sub.creditsRemaining, 0);
    const subscriptionCreditsUsed = allSubscriptionCredits.reduce((sum, sub) => sum + sub.creditsUsed, 0);

    // For display, show only the active plan's credits (the one that will be used next)
    // Priority: Active purchased plan > Admin credits
    const displayCreditsRemaining = activePlan ? activePlan.creditsRemaining : (adminCredits?.creditsRemaining || 0);
    const displayCreditsTotal = activePlan ? activePlan.creditsTotal : (adminCredits?.creditsTotal || 0);

    // Combine both credit sources for total available
    const totalCreditsRemaining = subscriptionCreditsRemaining + (adminCredits?.creditsRemaining || 0);
    const totalCreditsTotal = subscriptionCreditsTotal + (adminCredits?.creditsTotal || 0);
    const totalCreditsUsed = subscriptionCreditsUsed + (adminCredits?.creditsUsed || 0);

    // Check if user has valid credits
    const hasValidSubscriptionCredits = allSubscriptionCredits.length > 0;
    const hasValidAdminCredits = adminCredits && 
                                 adminCredits.status === 'active' && 
                                 adminCredits.creditsRemaining > 0 &&
                                 (!adminCredits.expiryDate || adminCredits.expiryDate > new Date());

    const hasAnyCredits = allSubscriptionCredits.length > 0 || adminCredits;
    const hasValidCredits = hasValidSubscriptionCredits || hasValidAdminCredits;

    // Get the latest subscription for additional info
    const latestSubscription = allSubscriptionCredits.length > 0 
      ? allSubscriptionCredits.sort((a, b) => b.createdAt - a.createdAt)[0]
      : null;

    // Return subscription status
    return NextResponse.json({
      hasSubscription: hasAnyCredits,
      isValid: hasValidCredits,
      subscription: hasAnyCredits ? {
        id: activePlan?._id || latestSubscription?._id || adminCredits?._id,
        planId: activePlan?.planId || latestSubscription?.planId || adminCredits?.planId,
        planName: activePlan?.planName || latestSubscription?.planName || (adminCredits ? 'Admin Credits' : null),
        creditsTotal: displayCreditsTotal,
        creditsRemaining: displayCreditsRemaining,
        creditsUsed: activePlan?.creditsUsed || latestSubscription?.creditsUsed || adminCredits?.creditsUsed || 0,
        // Include total credits info for reference
        totalCreditsAvailable: totalCreditsRemaining,
        totalCreditsAcrossAllPlans: totalCreditsTotal,
        allSubscriptions: allSubscriptionCredits.map(sub => ({
          id: sub._id,
          planId: sub.planId,
          planName: sub.planName,
          creditsTotal: sub.creditsTotal,
          creditsRemaining: sub.creditsRemaining,
          creditsUsed: sub.creditsUsed,
          startDate: sub.startDate,
          expiryDate: sub.expiryDate,
          status: sub.status,
          amountPaid: sub.amountPaid,
          paymentId: sub.paymentId
        })),
        adminCredits: adminCredits ? {
          total: adminCredits.adminCredits,
          remaining: adminCredits.creditsRemaining,
          used: adminCredits.creditsUsed,
          expiryDate: adminCredits.expiryDate,
          status: adminCredits.status
        } : null,
        startDate: activePlan?.startDate || latestSubscription?.startDate || adminCredits?.startDate,
        expiryDate: activePlan?.expiryDate || latestSubscription?.expiryDate || adminCredits?.expiryDate,
        status: hasValidCredits ? 'active' : 'expired',
        daysRemaining: activePlan?.expiryDate ? Math.ceil((activePlan.expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : 
                      latestSubscription?.expiryDate ? Math.ceil((latestSubscription.expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : 
                      adminCredits?.expiryDate ? Math.ceil((adminCredits.expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null,
      } : null
    }, { status: 200 });

  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
