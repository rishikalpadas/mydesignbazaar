import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit_purchase', 'design_purchase', 'refund', 'bonus'],
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Amount in INR (for credit purchases)
  },
  creditPoints: {
    type: Number,
    required: true, // Credit points added or deducted
  },
  balanceBefore: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  // Razorpay payment details
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  // Plan details (for credit purchases)
  planName: String,
  planType: String, // 'starter', 'professional', 'enterprise'
  // Design purchase details (for design purchases)
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
  },
  designName: String,
  // Additional metadata
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 })
transactionSchema.index({ razorpayOrderId: 1 })
transactionSchema.index({ razorpayPaymentId: 1 })

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

export default Transaction
