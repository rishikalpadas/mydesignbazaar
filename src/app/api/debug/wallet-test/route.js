import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { Designer } from '../../../../models/User';
import { Wallet, WalletTransaction } from '../../../../models/Wallet';
import Design from '../../../../models/Design';
import { verifyToken } from '../../../../middleware/auth';
import { creditDesignerWallet } from '../../../../lib/walletService';

// GET - Debug endpoint to check wallet status
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

    // Get query parameter for designer ID (admin can check any designer)
    const { searchParams } = new URL(request.url);
    const checkUserId = searchParams.get('userId') || userId;

    // Get designer profile
    const designer = await Designer.findOne({ userId: checkUserId });
    
    if (!designer) {
      return NextResponse.json({
        error: 'Designer profile not found',
        userId: checkUserId,
        userType: userType
      }, { status: 404 });
    }

    // Get wallet
    const wallet = await Wallet.findOne({ userId: checkUserId });

    // Get designer's designs
    const designs = await Design.find({ uploadedBy: checkUserId });
    const approvedDesigns = designs.filter(d => d.status === 'approved');

    // Get wallet transactions
    const transactions = await WalletTransaction.find({ userId: checkUserId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Check eligibility
    const isEligible = designer.approvedDesigns >= 10;

    return NextResponse.json({
      success: true,
      debug: {
        userId: checkUserId,
        userType: userType,
        designer: {
          exists: true,
          fullName: designer.fullName,
          approvedDesigns: designer.approvedDesigns,
          totalDesigns: designer.totalDesigns,
          isEligible: isEligible,
          requiredDesigns: 10,
          remainingDesigns: isEligible ? 0 : 10 - designer.approvedDesigns
        },
        wallet: wallet ? {
          exists: true,
          balance: wallet.balance,
          totalEarnings: wallet.totalEarnings,
          totalWithdrawn: wallet.totalWithdrawn,
          status: wallet.status,
          createdAt: wallet.createdAt
        } : {
          exists: false,
          message: 'No wallet found - will be created on first earning'
        },
        designs: {
          total: designs.length,
          approved: approvedDesigns.length,
          pending: designs.filter(d => d.status === 'pending').length,
          rejected: designs.filter(d => d.status === 'rejected').length,
          recentApproved: approvedDesigns.slice(0, 3).map(d => ({
            id: d._id,
            designId: d.designId,
            title: d.title,
            downloads: d.downloads
          }))
        },
        transactions: {
          count: transactions.length,
          recent: transactions.map(t => ({
            type: t.type,
            amount: t.amount,
            source: t.source,
            description: t.description,
            createdAt: t.createdAt
          }))
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Wallet debug error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch wallet debug info',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

// POST - Test wallet credit manually
export async function POST(request) {
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

    const body = await request.json();
    const { designId, buyerId } = body;

    if (!designId) {
      return NextResponse.json(
        { error: 'designId is required' },
        { status: 400 }
      );
    }

    // Test the wallet credit function
    console.log('[WALLET-TEST] Testing creditDesignerWallet with:', { designId, buyerId });
    const result = await creditDesignerWallet(designId, buyerId || authResult.decoded.userId, null);
    console.log('[WALLET-TEST] Result:', result);

    return NextResponse.json({
      success: true,
      testResult: result,
      message: 'Wallet credit test completed'
    }, { status: 200 });

  } catch (error) {
    console.error('Wallet test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test wallet credit',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
