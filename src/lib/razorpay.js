import Razorpay from 'razorpay'

// Pricing plans with credit points
export const PRICING_PLANS = {
  basic: {
    name: 'Basic',
    price: 600, // INR
    credits: 10,
    description: 'Perfect for Startups',
    features: [
      '10 download credits',
      'Valid for 15 days',
      'Commercial rights',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    price: 5000, // INR
    credits: 100,
    description: 'Best for Growing Business',
    features: [
      '100 download credits',
      'Valid for 90 days',
      'AI designs access',
      'Priority support',
      '10% off extras'
    ],
    popular: true
  },
  elite: {
    name: 'Elite',
    price: 50000, // INR
    credits: 1200,
    description: 'For Large Enterprises',
    features: [
      '1200 download credits',
      'Valid for 365 days',
      'Full AI access',
      'Dedicated manager',
      'Custom requests'
    ]
  }
}

// Initialize Razorpay instance
let razorpayInstance = null

export function getRazorpayInstance() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured')
    }

    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }

  return razorpayInstance
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature(orderId, paymentId, signature) {
  const crypto = require('crypto')
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return generatedSignature === signature
}
