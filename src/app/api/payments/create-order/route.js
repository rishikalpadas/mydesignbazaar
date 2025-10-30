import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import { User } from '../../../../models/User'
import Transaction from '../../../../models/Transaction'
import SystemSettings from '../../../../models/SystemSettings'
import { getRazorpayInstance, PRICING_PLANS } from '../../../../lib/razorpay'
import { withAuth } from '../../../../middleware/auth'

async function handler(request) {
  try {
    await connectDB()

    const { planType } = await request.json()

    // Validate plan type
    if (!PRICING_PLANS[planType]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const plan = PRICING_PLANS[planType]
    const userId = request.user.id

    // Verify user exists
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch dynamic price from settings
    const priceKey = `price_${planType}_plan`
    const priceSetting = await SystemSettings.findOne({ key: priceKey, isActive: true })
    const dynamicPrice = priceSetting ? priceSetting.getParsedValue() : plan.price

    // Create Razorpay order using dynamic price
    const razorpay = getRazorpayInstance()
    const options = {
      amount: dynamicPrice * 100, // Amount in paise (INR)
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        planType,
        planName: plan.name,
        creditPoints: plan.credits,
      },
    }

    const order = await razorpay.orders.create(options)

    // Create pending transaction
    const transaction = new Transaction({
      userId,
      type: 'credit_purchase',
      amount: dynamicPrice,
      creditPoints: plan.credits,
      balanceBefore: user.creditPoints || 0,
      balanceAfter: (user.creditPoints || 0) + plan.credits,
      status: 'pending',
      razorpayOrderId: order.id,
      planName: plan.name,
      planType,
      description: `Credit purchase - ${plan.name}`,
    })

    await transaction.save()

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction._id,
      plan: {
        name: plan.name,
        credits: plan.credits,
        price: dynamicPrice,
      },
    }, { status: 200 })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
