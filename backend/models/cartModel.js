const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    title: { type: String, required: true },
    unitPriceMinor: { type: Number, required: true },
  },
  { _id: true }
);

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    index: true,
  },
  items: { type: [CartItemSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

CartSchema.index({ userId: 1, 'items.productId': 1 }, { unique: true });

CartSchema.methods.computeSubtotal = function () {
  return this.items.reduce((s, it) => s + (it.unitPriceMinor || 0), 0);
};

module.exports = mongoose.model('Cart', CartSchema);
