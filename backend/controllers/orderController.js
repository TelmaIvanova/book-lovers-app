const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate('items.productId', 'title type')
    .populate('items.seller', 'firstName lastName username ethAddress')
    .sort({ createdAt: -1 });

  res.status(200).json({
    results: orders.length,
    orders,
  });
});
