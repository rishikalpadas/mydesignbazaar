import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { Wallet } from '../../../../models/Wallet';
import { Designer } from '../../../../models/User';
import { verifyToken } from '../../../../middleware/auth';

// GET - Fetch designer's wallet information
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

    // Only designers can access wallet
    if (userType !== 'designer') {
      return NextResponse.json(
        { error: 'Only designers can access wallet' },
        { status: 403 }
      );
    }

    // Get designer profile to check approved designs count
    const designer = await Designer.findOne({ userId });
    if (!designer) {
      return NextResponse.json(
        { error: 'Designer profile not found' },
        { status: 404 }
      );
    }

    // Find or create wallet
    let wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await Wallet.create({
        userId,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        currency: 'INR',
        status: 'active'
      });
    }

    // Check if designer is eligible for earnings (10+ approved designs)
    const isEligible = designer.approvedDesigns >= 10;

    return NextResponse.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawn: wallet.totalWithdrawn,
        currency: wallet.currency,
        status: wallet.status,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      },
      eligibility: {
        isEligible,
        approvedDesigns: designer.approvedDesigns,
        requiredDesigns: 10,
        remainingDesigns: isEligible ? 0 : 10 - designer.approvedDesigns
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet information' },
      { status: 500 }
    );
  }
}
