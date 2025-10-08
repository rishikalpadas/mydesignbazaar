import mongoose from 'mongoose';

// Subscription Plan Schema
const subscriptionPlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
    enum: ['basic', 'premium', 'elite']
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  validityDays: {
    type: Number,
    required: true,
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

// User Subscription Schema
const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  planId: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'elite']
  },
  planName: {
    type: String,
    required: true,
  },

  // Credits & Validity
  creditsTotal: {
    type: Number,
    required: true,
  },
  creditsRemaining: {
    type: Number,
    required: true,
  },
  creditsUsed: {
    type: Number,
    default: 0,
  },

  // Dates
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },

  // Payment Info
  paymentId: String,
  paymentMethod: String,
  amountPaid: {
    type: Number,
    required: true,
  },

  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: false,
  },

  // Cancellation
  cancelledAt: Date,
  cancellationReason: String,

}, {
  timestamps: true
});

// Indexes for better query performance
userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ expiryDate: 1 });

// Method to check if subscription is valid
userSubscriptionSchema.methods.isValid = function() {
  return this.status === 'active' &&
         this.expiryDate > new Date() &&
         this.creditsRemaining > 0;
};

// Method to deduct credits
userSubscriptionSchema.methods.deductCredit = async function(amount = 1) {
  if (this.creditsRemaining < amount) {
    throw new Error('Insufficient credits');
  }

  this.creditsRemaining -= amount;
  this.creditsUsed += amount;

  if (this.creditsRemaining === 0) {
    this.status = 'expired';
  }

  return await this.save();
};

// Download History Schema
const downloadHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true,
    index: true,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription',
  },

  // Download Details
  creditsUsed: {
    type: Number,
    default: 1,
  },
  downloadType: {
    type: String,
    enum: ['subscription', 'pay-per-download'],
    default: 'subscription',
  },

  // Payment Info (for pay-per-download)
  amountPaid: Number,
  paymentId: String,

  // File Info
  fileName: String,
  fileSize: Number,

  downloadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Indexes
downloadHistorySchema.index({ userId: 1, downloadedAt: -1 });
downloadHistorySchema.index({ designId: 1 });

// Credit Transaction Schema (for tracking all credit movements)
const creditTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription',
  },

  // Transaction Type
  type: {
    type: String,
    enum: ['credit', 'debit', 'refund', 'bonus', 'expiry'],
    required: true,
  },

  // Amount
  amount: {
    type: Number,
    required: true,
  },

  // Balance after transaction
  balanceAfter: {
    type: Number,
    required: true,
  },

  // Reason/Description
  description: {
    type: String,
    required: true,
  },

  // Related entities
  relatedDesignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
  },
  relatedDownloadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DownloadHistory',
  },

  transactionDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

creditTransactionSchema.index({ userId: 1, transactionDate: -1 });

// Create models
const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const UserSubscription = mongoose.models.UserSubscription || mongoose.model('UserSubscription', userSubscriptionSchema);
const DownloadHistory = mongoose.models.DownloadHistory || mongoose.model('DownloadHistory', downloadHistorySchema);
const CreditTransaction = mongoose.models.CreditTransaction || mongoose.model('CreditTransaction', creditTransactionSchema);

export { SubscriptionPlan, UserSubscription, DownloadHistory, CreditTransaction };
