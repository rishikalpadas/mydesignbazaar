import mongoose from 'mongoose';

const blockedCredentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  aadhaarNumber: {
    type: String,
    trim: true,
  },
  panNumber: {
    type: String,
    uppercase: true,
    trim: true,
  },
  alternativeContact: {
    type: String,
    trim: true,
  },
  gstNumber: {
    type: String,
    trim: true,
  },
  bankAccountNumber: {
    type: String,
    trim: true,
  },
  upiId: {
    type: String,
    trim: true,
  },
  paypalId: {
    type: String,
    trim: true,
  },
  portfolioLinks: [String],
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blockReason: {
    type: String,
    required: true,
  },
  originalUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    adminEmail: String,
    adminName: String,
    designerName: String,
    ipAddress: String,
  },
});

// Indexes for fast lookup during registration
blockedCredentialsSchema.index({ email: 1 });
blockedCredentialsSchema.index({ phoneNumber: 1 });
blockedCredentialsSchema.index({ aadhaarNumber: 1 });
blockedCredentialsSchema.index({ panNumber: 1 });
blockedCredentialsSchema.index({ alternativeContact: 1 });
blockedCredentialsSchema.index({ gstNumber: 1 });
blockedCredentialsSchema.index({ bankAccountNumber: 1 });
blockedCredentialsSchema.index({ upiId: 1 });
blockedCredentialsSchema.index({ paypalId: 1 });

// Static method to check if any credential is blocked
blockedCredentialsSchema.statics.isCredentialBlocked = async function(credentials) {
  const { 
    email, 
    phoneNumber, 
    aadhaarNumber, 
    panNumber,
    alternativeContact,
    gstNumber,
    bankAccountNumber,
    upiId,
    paypalId,
    portfolioLinks
  } = credentials;

  const query = {
    $or: []
  };

  if (email) query.$or.push({ email: email.toLowerCase().trim() });
  if (phoneNumber) query.$or.push({ phoneNumber: phoneNumber.trim() });
  if (aadhaarNumber) query.$or.push({ aadhaarNumber: aadhaarNumber.trim() });
  if (panNumber) query.$or.push({ panNumber: panNumber.toUpperCase().trim() });
  if (alternativeContact) query.$or.push({ alternativeContact: alternativeContact.trim() });
  if (gstNumber) query.$or.push({ gstNumber: gstNumber.trim() });
  if (bankAccountNumber) query.$or.push({ bankAccountNumber: bankAccountNumber.trim() });
  if (upiId) query.$or.push({ upiId: upiId.trim() });
  if (paypalId) query.$or.push({ paypalId: paypalId.trim() });
  
  // Check portfolio links
  if (portfolioLinks && portfolioLinks.length > 0) {
    portfolioLinks.forEach(link => {
      if (link) query.$or.push({ portfolioLinks: link.trim() });
    });
  }

  if (query.$or.length === 0) {
    return null;
  }

  const blockedRecord = await this.findOne(query);
  return blockedRecord;
};

// Static method to block credentials
blockedCredentialsSchema.statics.blockCredentials = async function(data) {
  const { 
    email, 
    phoneNumber, 
    aadhaarNumber, 
    panNumber, 
    alternativeContact,
    gstNumber,
    bankAccountNumber,
    upiId,
    paypalId,
    portfolioLinks,
    blockedBy, 
    blockReason, 
    originalUserId, 
    metadata 
  } = data;

  const blockedRecord = new this({
    email: email.toLowerCase().trim(),
    phoneNumber: phoneNumber?.trim(),
    aadhaarNumber: aadhaarNumber?.trim(),
    panNumber: panNumber?.toUpperCase().trim(),
    alternativeContact: alternativeContact?.trim(),
    gstNumber: gstNumber?.trim(),
    bankAccountNumber: bankAccountNumber?.trim(),
    upiId: upiId?.trim(),
    paypalId: paypalId?.trim(),
    portfolioLinks: portfolioLinks || [],
    blockedBy,
    blockReason,
    originalUserId,
    metadata,
  });

  await blockedRecord.save();
  return blockedRecord;
};

// Static method to unblock credentials (used when admin deletes instead of blocks)
blockedCredentialsSchema.statics.unblockCredentials = async function(userId) {
  const result = await this.deleteOne({ originalUserId: userId });
  return result;
};

const BlockedCredentials = mongoose.models.BlockedCredentials || mongoose.model('BlockedCredentials', blockedCredentialsSchema);

export default BlockedCredentials;
