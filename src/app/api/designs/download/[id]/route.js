import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Design from '../../../../../models/Design';
import { UserSubscription, DownloadHistory, CreditTransaction } from '../../../../../models/Subscription';
import { Buyer } from '../../../../../models/User';
import { verifyToken } from '../../../../../middleware/auth';

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

    // Get active subscription
    const activeSubscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      expiryDate: { $gt: new Date() },
      creditsRemaining: { $gt: 0 }
    }).sort({ createdAt: -1 });

    if (!activeSubscription) {
      return NextResponse.json(
        {
          error: 'No active subscription found',
          message: 'Please purchase a subscription plan to download designs',
          requiresSubscription: true
        },
        { status: 403 }
      );
    }

    // Check if subscription is valid
    if (!activeSubscription.isValid()) {
      return NextResponse.json(
        {
          error: 'Subscription expired or no credits remaining',
          message: 'Please renew your subscription to continue downloading',
          requiresSubscription: true
        },
        { status: 403 }
      );
    }

    // Check if user has already downloaded this design with current subscription
    const existingDownload = await DownloadHistory.findOne({
      userId,
      designId,
      subscriptionId: activeSubscription._id
    });

    if (existingDownload) {
      // Allow re-download without deducting credits
      return NextResponse.json({
        success: true,
        alreadyDownloaded: true,
        message: 'Design already downloaded with this subscription',
        downloadUrl: getDownloadUrl(design),
        fileName: design.rawFile?.originalName || 'design.pdf'
      }, { status: 200 });
    }

    // Deduct 1 credit
    try {
      await activeSubscription.deductCredit(1);
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Create download history record
    const downloadRecord = await DownloadHistory.create({
      userId,
      designId,
      subscriptionId: activeSubscription._id,
      creditsUsed: 1,
      downloadType: 'subscription',
      fileName: design.rawFile?.originalName || 'design.pdf',
      fileSize: design.rawFile?.size || 0
    });

    // Create credit transaction record
    await CreditTransaction.create({
      userId,
      subscriptionId: activeSubscription._id,
      type: 'debit',
      amount: 1,
      balanceAfter: activeSubscription.creditsRemaining,
      description: `Downloaded design: ${design.title}`,
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

    // Return download URL
    return NextResponse.json({
      success: true,
      message: 'Download authorized',
      downloadUrl: getDownloadUrl(design),
      fileName: design.rawFile?.originalName || 'design.pdf',
      creditsRemaining: activeSubscription.creditsRemaining,
      subscription: {
        planName: activeSubscription.planName,
        creditsTotal: activeSubscription.creditsTotal,
        creditsRemaining: activeSubscription.creditsRemaining,
        expiryDate: activeSubscription.expiryDate
      }
    }, { status: 200 });

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
