import mongoose from 'mongoose';

// Notification Schema
const notificationSchema = new mongoose.Schema({
  // Recipient information
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipientType: {
    type: String,
    enum: ['buyer', 'designer', 'admin'],
    required: true
  },
  
  // Notification content
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'announcement'],
    default: 'info'
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  
  // Sender information (admin)
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderName: {
    type: String
  },
  
  // Additional data
  link: {
    type: String
  },
  icon: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date
  }
});

// Indexes for better query performance
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientType: 1, createdAt: -1 });

// Methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static methods
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ recipientId: userId, isRead: false });
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { recipientId: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
