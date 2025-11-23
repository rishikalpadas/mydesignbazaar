import mongoose from 'mongoose';

// Base User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['designer', 'buyer'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false, // For designers, needs admin approval
  },
  // OTP Verification
  emailOtp: {
    code: String,
    expiresAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  mobileOtp: {
    code: String,
    expiresAt: Date,
    phoneNumber: String, // Store the phone number being verified
    verified: {
      type: Boolean,
      default: false,
    },
  },
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  // Credit Points (for buyers to purchase designs)
  creditPoints: {
    type: Number,
    default: 0,
  },
  // Profile Picture
  profile_pic: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Designer Schema
const designerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Personal Information
  fullName: {
    type: String,
    required: true,
  },
  displayName: String,
  profile_pic: {
    type: String,
    default: null,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  alternativeContact: String,
  aadhaarNumber: {
    type: String,
    required: true,
  },
  aadhaarFiles: [String], // File paths for Aadhaar card (front & back)

  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  
  // Identity & Tax
  governmentId: String, // File path (deprecated, use aadhaarFiles)
  panNumber: {
    type: String,
    required: true,
  },
  panCardFile: String, // File path for PAN card
  gstNumber: String,
  
  // Bank Details
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    branch: String,
    ifscCode: String,
    upiId: String,
    paypalId: String,
  },
  
  // Portfolio
  sampleDesigns: [String], // File paths
  portfolioLink: String, // Deprecated, use portfolioLinks
  portfolioLinks: [String], // Array of portfolio URLs
  specializations: [String],
  otherSpecialization: String,
  
  // Agreement flags
  agreements: {
    originalWork: { type: Boolean, required: true },
    noResponsibility: { type: Boolean, required: true },
    monetizationPolicy: { type: Boolean, required: true },
    platformPricing: { type: Boolean, required: true },
    designRemoval: { type: Boolean, required: true },
    minimumUploads: { type: Boolean, required: true },
  },
  
  // Stats
  totalDesigns: { type: Number, default: 0 },
  approvedDesigns: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },

  // Account Status
  accountStatus: {
    type: String,
    enum: ['active', 'blocked', 'deleted'],
    default: 'active',
  },
  blockedAt: Date,
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blockReason: String,
  unblockedAt: Date,
  unblockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  unblockRemarks: String,
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deleteReason: String,
});

// Buyer Schema
const buyerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Business Information
  fullName: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
    default: null,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
    enum: ['manufacturer', 'exporter', 'boutique', 'freelancer', 'fashion-brand', 'student', 'other'],
  },
  
  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    gstNumber: String,
  },
  
  // Payment Preferences
  paymentMethods: [String],
  billingCurrency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP'],
  },
  
  // Design Requirements
  interestedCategories: [String],
  purchaseFrequency: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'occasionally'],
  },
  
  // Agreement flags
  agreements: {
    licensedUse: { type: Boolean, required: true },
    noCopyright: { type: Boolean, required: true },
    refundPolicy: { type: Boolean, required: true },
    noIllegalDesigns: { type: Boolean, required: true },
    compliance: { type: Boolean, required: true },
  },
  
  // Stats
  totalPurchases: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },

  // Subscription Info (reference to current active subscription)
  currentSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription',
  },
  subscriptionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription',
  }],
});

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Designer = mongoose.models.Designer || mongoose.model('Designer', designerSchema);
const Buyer = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);

export { User, Designer, Buyer };