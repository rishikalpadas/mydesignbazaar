import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User_Credits, User_Subscription_Credits } from '../../../../../models/Subscription';
import { verifyToken } from '../../../../../middleware/auth';

export async function GET(request) {
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

    const userType = authResult.user.userType;
    if (userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get all user subscription credits (from paid plans) - can have multiple records
    const allSubscriptionCredits = await User_Subscription_Credits.find({ 
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });
    
    // Get user credits (admin added)
    const adminCredits = await User_Credits.findOne({ userId });

    // Calculate total from all subscription purchases
    const subscriptionCreditsTotal = allSubscriptionCredits.reduce((sum, sub) => sum + sub.creditsTotal, 0);
    const subscriptionCreditsRemaining = allSubscriptionCredits.reduce((sum, sub) => sum + sub.creditsRemaining, 0);
    const subscriptionCreditsUsed = allSubscriptionCredits.reduce((sum, sub) => sum + sub.creditsUsed, 0);

    // Combine both credit sources
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

    // Get the latest subscription for display
    const latestSubscription = allSubscriptionCredits.length > 0 
      ? allSubscriptionCredits.sort((a, b) => b.createdAt - a.createdAt)[0]
      : null;

    // Return subscription status
    return NextResponse.json({
      hasSubscription: hasAnyCredits,
      isValid: hasValidCredits,
      subscription: hasAnyCredits ? {
        id: latestSubscription?._id || adminCredits?._id,
        planId: latestSubscription?.planId || adminCredits?.planId,
        planName: latestSubscription?.planName || adminCredits?.planName,
        creditsTotal: totalCreditsTotal,
        creditsRemaining: totalCreditsRemaining,
        creditsUsed: totalCreditsUsed,
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
        startDate: latestSubscription?.startDate || adminCredits?.startDate,
        expiryDate: latestSubscription?.expiryDate || adminCredits?.expiryDate,
        status: hasValidCredits ? 'active' : 'expired',
        daysRemaining: latestSubscription?.expiryDate ? Math.ceil((latestSubscription.expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : 
                      adminCredits?.expiryDate ? Math.ceil((adminCredits.expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null,
      } : null
    }, { status: 200 });

  } catch (error) {
    console.error('[ADMIN] Buyer subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer subscription status' },
      { status: 500 }
    );
  }
}
