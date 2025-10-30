import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import Transaction from '../../../../models/Transaction'
import { withAuth } from '../../../../middleware/auth'

async function handler(request) {
  try {
    await connectDB()

    const userId = request.user.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Get transactions for user
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    // Get total count
    const total = await Transaction.countDocuments({ userId })

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, { status: 200 })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: error.message },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
