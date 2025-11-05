import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Index for faster queries
// Note: userId already has an index from compound unique index
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'items.designId': 1 });

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(designId) {
  const existingItem = this.items.find(
    item => item.designId.toString() === designId.toString()
  );

  if (!existingItem) {
    this.items.push({ designId });
  }

  return this.save();
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(designId) {
  this.items = this.items.filter(
    item => item.designId.toString() !== designId.toString()
  );
  return this.save();
};

// Method to check if design is in wishlist
wishlistSchema.methods.hasItem = function(designId) {
  return this.items.some(
    item => item.designId.toString() === designId.toString()
  );
};

// Static method to get or create wishlist for user
wishlistSchema.statics.getOrCreateWishlist = async function(userId) {
  let wishlist = await this.findOne({ userId });

  if (!wishlist) {
    wishlist = await this.create({ userId, items: [] });
  }

  return wishlist;
};

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
