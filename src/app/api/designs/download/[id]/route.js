import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Design from '../../../../../models/Design';
import { UserSubscription, DownloadHistory, CreditTransaction, User_Subscription_Credits, User_Credits } from '../../../../../models/Subscription';
import { Buyer } from '../../../../../models/User';
import { verifyToken } from '../../../../../middleware/auth';
import { creditDesignerWallet } from '../../../../../lib/walletService';

export async function POST(request, { params }) {
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

    // Only buyers can download designs
    if (userType !== 'buyer') {
      return NextResponse.json(
        { error: 'Only buyers can download designs' },
        { status: 403 }
      );
    }

    const { id: designId } = await params;

    // Get design
    const design = await Design.findById(designId);
    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    // Priority 1: Check for active purchased subscription plans (expiring soonest first)
    const activePurchasedPlans = await User_Subscription_Credits.find({
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() },
      creditsRemaining: { $gt: 0 }
    }).sort({ expiryDate: 1 }); // Sort by expiry date ascending (earliest expiry first)

    let creditSource = null;
    let subscriptionRecord = null;

    if (activePurchasedPlans && activePurchasedPlans.length > 0) {
      // Use the plan that expires soonest
      creditSource = 'purchased_plan';
      subscriptionRecord = activePurchasedPlans[0];
      console.log(`[DOWNLOAD] Using purchased plan: ${subscriptionRecord.planName}, expires: ${subscriptionRecord.expiryDate}`);
    } else {
      // Priority 2: Check for admin credits only if no purchased plans
      const adminCredits = await User_Credits.findOne({
        userId,
        status: 'active',
        adminCredits: { $gt: 0 }
      });

      if (adminCredits) {
        creditSource = 'admin_credits';
        subscriptionRecord = adminCredits;
        console.log(`[DOWNLOAD] Using admin credits: ${subscriptionRecord.adminCredits} remaining`);
      }
    }

    // If no credits available from any source
    if (!creditSource || !subscriptionRecord) {
      return NextResponse.json(
        {
          error: 'No credits available',
          message: 'Please purchase a subscription plan to download designs',
          requiresSubscription: true
        },
        { status: 403 }
      );
    }

    // Check if user has already downloaded this design with current subscription
    const existingDownload = await DownloadHistory.findOne({
      userId,
      designId,
      subscriptionId: subscriptionRecord._id
    });

    if (existingDownload) {
      // Allow re-download without deducting credits
      return NextResponse.json({
        success: true,
        alreadyDownloaded: true,
        message: 'Design already downloaded with this subscription',
        downloadUrl: getDownloadUrl(design),
        fileName: design.rawFile?.originalName || 'design.pdf',
        creditSource: creditSource,
        creditsRemaining: subscriptionRecord.creditsRemaining
      }, { status: 200 });
    }

    // Deduct 1 credit based on source
    try {
      if (creditSource === 'purchased_plan') {
        // Deduct from purchased plan
        subscriptionRecord.creditsRemaining -= 1;
        subscriptionRecord.creditsUsed += 1;
        
        // Check if credits exhausted
        if (subscriptionRecord.creditsRemaining === 0) {
          subscriptionRecord.status = 'expired';
        }
        
        await subscriptionRecord.save();
        console.log(`[DOWNLOAD] Deducted 1 credit from purchased plan. Remaining: ${subscriptionRecord.creditsRemaining}`);
      } else if (creditSource === 'admin_credits') {
        // Deduct from admin credits
        subscriptionRecord.adminCredits -= 1;
        subscriptionRecord.creditsRemaining -= 1;
        subscriptionRecord.creditsUsed += 1;
        
        await subscriptionRecord.save();
        console.log(`[DOWNLOAD] Deducted 1 credit from admin credits. Remaining: ${subscriptionRecord.adminCredits}`);
      }
    } catch (error) {
      console.error('[DOWNLOAD] Credit deduction error:', error);
      return NextResponse.json(
        { error: 'Failed to deduct credits' },
        { status: 400 }
      );
    }

    // Create download history record
    const downloadRecord = await DownloadHistory.create({
      userId,
      designId,
      subscriptionId: subscriptionRecord._id,
      creditsUsed: 1,
      downloadType: creditSource === 'purchased_plan' ? 'subscription' : 'admin_credits',
      fileName: design.rawFile?.originalName || 'design.pdf',
      fileSize: design.rawFile?.size || 0
    });

    // Create credit transaction record
    await CreditTransaction.create({
      userId,
      subscriptionId: subscriptionRecord._id,
      type: 'debit',
      amount: 1,
      balanceAfter: creditSource === 'purchased_plan' ? subscriptionRecord.creditsRemaining : subscriptionRecord.adminCredits,
      description: `Downloaded design: ${design.title} (Source: ${creditSource === 'purchased_plan' ? subscriptionRecord.planName : 'Admin Credits'})`,
      relatedDesignId: designId,
      relatedDownloadId: downloadRecord._id
    });

    // Update buyer stats
    await Buyer.findOneAndUpdate(
      { userId },
      {
        $inc: { totalPurchases: 1 }
      }
    );

    // Increment design download count
    await Design.findByIdAndUpdate(designId, {
      $inc: { downloads: 1 }
    });

    // Credit designer wallet based on tier system
    // - 50-99 approved designs: ₹10 per download (Standard)
    // - 100+ approved designs: ₹25 per download (Premium)
    try {
      console.log(`[DOWNLOAD] Attempting to credit designer wallet for design: ${designId}`);
      const walletResult = await creditDesignerWallet(designId, userId, downloadRecord._id);
      console.log(`[DOWNLOAD] Wallet result:`, walletResult);
      if (walletResult.success && walletResult.credited) {
        console.log(`[DOWNLOAD] ✓ Designer wallet credited: ₹${walletResult.amount} (${walletResult.tier} tier), new balance: ₹${walletResult.newBalance}`);
      } else if (walletResult.success && !walletResult.eligible) {
        console.log(`[DOWNLOAD] Designer not yet eligible for wallet earnings (${walletResult.approvedDesigns}/50 approved designs)`);
      } else if (!walletResult.success) {
        console.error(`[DOWNLOAD] Wallet credit failed: ${walletResult.error}`);
      }
    } catch (walletError) {
      // Don't fail the download if wallet credit fails, just log it
      console.error('[DOWNLOAD] Wallet credit failed but download proceeds:', walletError);
    }

    // Return download URL with appropriate credit info
    const responseData = {
      success: true,
      message: 'Download authorized',
      downloadUrl: getDownloadUrl(design),
      fileName: design.rawFile?.originalName || 'design.pdf',
      creditSource: creditSource,
      creditsRemaining: subscriptionRecord.creditsRemaining // Use creditsRemaining for both sources
    };

    // Add subscription details if from purchased plan
    if (creditSource === 'purchased_plan') {
      responseData.subscription = {
        planName: subscriptionRecord.planName,
        creditsTotal: subscriptionRecord.creditsTotal,
        creditsRemaining: subscriptionRecord.creditsRemaining,
        expiryDate: subscriptionRecord.expiryDate
      };
    } else {
      // For admin credits, also return the creditsRemaining field
      responseData.adminCreditsRemaining = subscriptionRecord.creditsRemaining;
    }

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}

// Helper function to get download URL
function getDownloadUrl(design) {
  const designIdToUse = design.designId || design._id.toString();
  if (design.rawFile) {
    return `/api/uploads/designs/${designIdToUse}/raw/${design.rawFile.filename}`;
  }
  const files = Array.isArray(design.rawFiles) ? design.rawFiles : [];
  if (files.length > 0) {
    return `/api/uploads/designs/${designIdToUse}/raw/${files[0].filename}`;
  }
  return null;
}
