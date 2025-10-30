import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import { User } from '../../../../models/User'
import Transaction from '../../../../models/Transaction'
import { verifyRazorpaySignature } from '../../../../lib/razorpay'
import { withAuth } from '../../../../middleware/auth'

async function handler(request) {
  try {
    await connectDB()

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId } = await request.json()

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify signature
    const isValidSignature = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValidSignature) {
      console.error('Invalid Razorpay signature')

      // Update transaction as failed
      await Transaction.findByIdAndUpdate(transactionId, {
        status: 'failed',
        updatedAt: new Date(),
      })

      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const userId = request.user.id

    // Get transaction
    const transaction = await Transaction.findById(transactionId)
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Verify transaction belongs to user
    if (transaction.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if already processed
    if (transaction.status === 'completed') {
      return NextResponse.json({
        message: 'Payment already processed',
        creditPoints: transaction.creditPoints
      }, { status: 200 })
    }

    // Update transaction
    transaction.razorpayPaymentId = razorpayPaymentId
    transaction.razorpaySignature = razorpaySignature
    transaction.status = 'completed'
    transaction.updatedAt = new Date()
    await transaction.save()

    // Add credit points to user
    const user = await User.findById(userId)
    user.creditPoints = (user.creditPoints || 0) + transaction.creditPoints
    await user.save()

    console.log(`Payment verified successfully. Added ${transaction.creditPoints} credits to user ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      creditPoints: transaction.creditPoints,
      newBalance: user.creditPoints,
      transaction: {
        id: transaction._id,
        planName: transaction.planName,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      },
    }, { status: 200 })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
