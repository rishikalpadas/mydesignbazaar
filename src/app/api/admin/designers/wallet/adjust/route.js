import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/mongodb';
import { Wallet, WalletTransaction } from '../../../../../../models/Wallet';
import { Designer } from '../../../../../../models/User';
import { verifyToken } from '../../../../../../middleware/auth';

// POST - Admin endpoint to adjust designer wallet (credit or debit)
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

    const adminId = authResult.decoded.userId;
    const userType = authResult.user.userType;

    // Check if user is admin (you may need to add an isAdmin field to User model)
    // For now, we'll check if the user email matches admin pattern or add admin check
    const adminUser = authResult.user;
    const isAdmin = adminUser.email?.includes('admin') || adminUser.isAdmin === true;
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { designerId, amount, type, description } = body;

    // Validate input
    if (!designerId || !amount || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: designerId, amount, type, description' },
        { status: 400 }
      );
    }

    if (!['credit', 'debit', 'adjustment'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be credit, debit, or adjustment' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if designer exists
    const designer = await Designer.findOne({ userId: designerId });
    if (!designer) {
      return NextResponse.json(
        { error: 'Designer not found' },
        { status: 404 }
      );
    }

    // Find or create wallet
    let wallet = await Wallet.findOne({ userId: designerId });
    
    if (!wallet) {
      wallet = await Wallet.create({
        userId: designerId,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        currency: 'INR',
        status: 'active'
      });
    }

    const balanceBefore = wallet.balance;
    let balanceAfter = balanceBefore;

    // Apply adjustment based on type
    if (type === 'credit' || type === 'adjustment') {
      balanceAfter = balanceBefore + amount;
      wallet.balance = balanceAfter;
      wallet.totalEarnings += amount;
    } else if (type === 'debit') {
      if (balanceBefore < amount) {
        return NextResponse.json(
          { error: 'Insufficient wallet balance' },
          { status: 400 }
        );
      }
      balanceAfter = balanceBefore - amount;
      wallet.balance = balanceAfter;
    }

    wallet.updatedAt = new Date();
    await wallet.save();

    // Create transaction record
    const transaction = await WalletTransaction.create({
      walletId: wallet._id,
      userId: designerId,
      type: type,
      amount: amount,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      source: 'admin_adjustment',
      description: description,
      metadata: {
        adjustedBy: adminId,
        adjustedByEmail: adminUser.email,
        adminNote: description
      },
      status: 'completed'
    });

    return NextResponse.json({
      success: true,
      message: `Wallet ${type} successful`,
      wallet: {
        balance: wallet.balance,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawn: wallet.totalWithdrawn
      },
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
        description: transaction.description,
        createdAt: transaction.createdAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin wallet adjustment error:', error);
    return NextResponse.json(
      { error: 'Failed to adjust wallet' },
      { status: 500 }
    );
  }
}
