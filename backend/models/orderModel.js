const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  title: { type: String, required: true },
  unitPriceMinor: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  seller: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'sellerModel',
  },
  sellerModel: {
    type: String,
    required: true,
    enum: ['User', 'EthereumUser'],
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    type: {
      type: String,
      enum: ['OnPaper', 'E-book'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentInfo: {
      method: { type: String },
      txHash: { type: String },
      amountMinor: { type: Number },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
