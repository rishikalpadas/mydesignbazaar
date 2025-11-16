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
    default: 0,
  },
  creditsRemaining: {
    type: Number,
    required: true,
  },
  creditsUsed: {
    type: Number,
    default: 0,
  },
  adminCredits: {
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
  orderId: String,
  paymentMethod: String,
  amountPaid: {
    type: Number,
    required: true,
  },

  // Additional Purchases (for stacking subscriptions)
  additionalPurchases: [{
    planId: String,
    planName: String,
    credits: Number,
    creditsAdded: Number,
    validityExtended: Number,
    amountPaid: Number,
    paymentId: String,
    orderId: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],

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

// Pre-save hook to calculate creditsTotal
userSubscriptionSchema.pre('save', function(next) {
  // Calculate total credits from additionalPurchases
  const additionalCredits = this.additionalPurchases.reduce((total, purchase) => {
    return total + (purchase.credits || 0);
  }, 0);
  
  // Update creditsTotal: adminCredits + credits from additionalPurchases
  this.creditsTotal = (this.adminCredits || 0) + additionalCredits;
  
  next();
});

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

// Credits of Users Schema - Stores user credit information
const creditsOfUsersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  
  planId: {
    type: String,
    default: 'basic',
  },
  
  planName: {
    type: String,
    default: 'Manual Credit Addition',
  },
  
  creditsTotal: {
    type: Number,
    default: 0,
  },
  
  creditsRemaining: {
    type: Number,
    default: 0,
  },
  
  creditsUsed: {
    type: Number,
    default: 0,
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  
  expiryDate: {
    type: Date,
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  
  // Payment Info
  paymentId: String,
  paymentMethod: {
    type: String,
    default: 'manual',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: false,
  },
  
  // Additional credit purchases
  additionalPurchases: [{
    planId: String,
    planName: String,
    credits: Number,
    creditsAdded: Number,
    validityExtended: Number,
    amountPaid: Number,
    paymentId: String,
    orderId: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  
}, {
  timestamps: true
});

// Index for better query performance
creditsOfUsersSchema.index({ userId: 1 });

// User_Credits Schema - Stores user credit information with admin credits
const user_creditsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  
  planId: {
    type: String,
    default: 'basic',
  },
  
  planName: {
    type: String,
    default: 'Manual Credit Addition',
  },
  
  adminCredits: {
    type: Number,
    default: 0,
  },
  
  creditsTotal: {
    type: Number,
    default: 0,
  },
  
  creditsRemaining: {
    type: Number,
    default: 0,
  },
  
  creditsUsed: {
    type: Number,
    default: 0,
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  
  expiryDate: {
    type: Date,
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  
  // Payment Info
  paymentId: String,
  paymentMethod: {
    type: String,
    default: 'manual',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: false,
  },
  
  // Additional credit purchases
  additionalPurchases: [{
    planId: String,
    planName: String,
    credits: Number,
    creditsAdded: Number,
    validityExtended: Number,
    amountPaid: Number,
    paymentId: String,
    orderId: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  
}, {
  timestamps: true
});

// Index for better query performance
user_creditsSchema.index({ userId: 1 });

// User_Subscription_Credits Schema - Stores credit points from paid plans (Razorpay)
const user_subscription_creditsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  planId: {
    type: String,
    enum: ['basic', 'premium', 'elite'],
  },
  
  planName: {
    type: String,
  },
  
  creditsTotal: {
    type: Number,
    default: 0,
  },
  
  creditsRemaining: {
    type: Number,
    default: 0,
  },
  
  creditsUsed: {
    type: Number,
    default: 0,
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  
  expiryDate: {
    type: Date,
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  
  // Payment Info (Razorpay)
  paymentId: String,
  orderId: String,
  paymentMethod: {
    type: String,
    default: 'razorpay',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: false,
  },
  
  // Additional credit purchases from plans
  additionalPurchases: [{
    planId: String,
    planName: String,
    credits: Number,
    creditsAdded: Number,
    validityExtended: Number,
    amountPaid: Number,
    paymentId: String,
    orderId: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  
}, {
  timestamps: true
});

// Index for better query performance
user_subscription_creditsSchema.index({ userId: 1 });

// User Credits Schema - Stores admin-added credits and additional purchases
const userCreditsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  
  planId: {
    type: String,
    default: 'basic',
  },
  
  planName: {
    type: String,
    default: 'Manual Credit Addition',
  },
  
  // Credits added by admin
  adminCredits: {
    type: Number,
    default: 0,
  },
  
  // Total credits (auto-calculated)
  creditsTotal: {
    type: Number,
    default: 0,
  },
  
  creditsRemaining: {
    type: Number,
    default: 0,
  },
  
  creditsUsed: {
    type: Number,
    default: 0,
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  
  expiryDate: {
    type: Date,
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  
  // Payment Info
  paymentId: String,
  paymentMethod: {
    type: String,
    default: 'manual',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: false,
  },
  
  // Additional credit purchases
  additionalPurchases: [{
    planId: String,
    planName: String,
    credits: Number,
    creditsAdded: Number,
    validityExtended: Number,
    amountPaid: Number,
    paymentId: String,
    orderId: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  
}, {
  timestamps: true
});

// Index for better query performance
userCreditsSchema.index({ userId: 1 });

// Pre-save hook to calculate creditsTotal
userCreditsSchema.pre('save', function(next) {
  // Calculate total credits from additionalPurchases
  const additionalCredits = this.additionalPurchases.reduce((total, purchase) => {
    return total + (purchase.credits || 0);
  }, 0);
  
  // Update creditsTotal: adminCredits + credits from additionalPurchases
  this.creditsTotal = (this.adminCredits || 0) + additionalCredits;
  
  next();
});

// Create models
const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const UserSubscription = mongoose.models.UserSubscription || mongoose.model('UserSubscription', userSubscriptionSchema);
const DownloadHistory = mongoose.models.DownloadHistory || mongoose.model('DownloadHistory', downloadHistorySchema);
const CreditTransaction = mongoose.models.CreditTransaction || mongoose.model('CreditTransaction', creditTransactionSchema);
const CreditsOfUsers = mongoose.models.CreditsOfUsers || mongoose.model('CreditsOfUsers', creditsOfUsersSchema);
const User_Credits = mongoose.models.User_Credits || mongoose.model('User_Credits', user_creditsSchema);
const User_Subscription_Credits = mongoose.models.User_Subscription_Credits || mongoose.model('User_Subscription_Credits', user_subscription_creditsSchema);
const UserCredits = mongoose.models.UserCredits || mongoose.model('UserCredits', userCreditsSchema);

export { SubscriptionPlan, UserSubscription, DownloadHistory, CreditTransaction, CreditsOfUsers, User_Credits, User_Subscription_Credits, UserCredits };
