import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/mongodb';
import { Wallet, WalletTransaction } from '../../../../../../models/Wallet';
import { verifyToken } from '../../../../../../middleware/auth';

// GET - Fetch designer's wallet transactions
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

    // Only designers can access wallet transactions
    if (userType !== 'designer') {
      return NextResponse.json(
        { error: 'Only designers can access wallet transactions' },
        { status: 403 }
      );
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // Filter by transaction type
    const status = searchParams.get('status'); // Filter by status

    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { userId };
    if (type) {
      filter.type = type;
    }
    if (status) {
      filter.status = status;
    }

    // Get wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Fetch transactions with pagination
    const transactions = await WalletTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('designId', 'designId title category')
      .populate('buyerId', 'email')
      .lean();

    // Get total count for pagination
    const totalTransactions = await WalletTransaction.countDocuments(filter);
    const totalPages = Math.ceil(totalTransactions / limit);

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      walletSummary: {
        balance: wallet.balance,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawn: wallet.totalWithdrawn
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Wallet transactions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet transactions' },
      { status: 500 }
    );
  }
}
