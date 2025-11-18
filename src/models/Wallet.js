import mongoose from 'mongoose';

// Wallet Schema - Tracks designer earnings
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user has only one wallet
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP'],
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
walletSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Wallet Transaction Schema - Logs all wallet activities
const walletTransactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'withdrawal', 'refund', 'adjustment'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  balanceBefore: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  // Transaction source
  source: {
    type: String,
    enum: ['design_purchase', 'bonus', 'withdrawal', 'refund', 'admin_adjustment'],
    required: true,
  },
  // Related entities
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
  },
  downloadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DownloadHistory',
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Description and metadata
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
walletSchema.index({ userId: 1 });
walletSchema.index({ status: 1 });

walletTransactionSchema.index({ walletId: 1, createdAt: -1 });
walletTransactionSchema.index({ userId: 1, createdAt: -1 });
walletTransactionSchema.index({ designId: 1 });
walletTransactionSchema.index({ type: 1, status: 1 });

// Create models
const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
const WalletTransaction = mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema);

export { Wallet, WalletTransaction };
