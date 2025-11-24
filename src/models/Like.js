import mongoose from 'mongoose';

/**
 * Like Schema
 * Tracks likes/favorites on designs by users
 */
const likeSchema = new mongoose.Schema({
  // User who liked the design
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Design that was liked
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Compound index to ensure a user can only like a design once
likeSchema.index({ userId: 1, designId: 1 }, { unique: true });

// Index for faster queries
likeSchema.index({ designId: 1 }); // For counting likes per design
likeSchema.index({ userId: 1 }); // For getting all likes by a user

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

export default Like;
