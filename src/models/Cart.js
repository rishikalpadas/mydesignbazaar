import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
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
cartSchema.index({ userId: 1 });
// Note: items.designId automatically gets an index because it's a reference
// Removing explicit index to avoid duplicate index warning

// Method to add item to cart
cartSchema.methods.addItem = function(designId) {
  const existingItem = this.items.find(
    item => item.designId.toString() === designId.toString()
  );

  if (!existingItem) {
    this.items.push({ designId });
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(designId) {
  this.items = this.items.filter(
    item => item.designId.toString() !== designId.toString()
  );
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ userId });

  if (!cart) {
    cart = await this.create({ userId, items: [] });
  }

  return cart;
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
