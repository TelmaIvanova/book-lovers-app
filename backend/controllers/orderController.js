const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate('items.productId', 'title type')
    .populate({
      path: 'items.seller',
      select: 'firstName lastName username ethereumAddress',
    })
    .sort({ createdAt: -1 });
  console.log(JSON.stringify(orders[0].items[0], null, 2));

  res.status(200).json({
    results: orders.length,
    orders,
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('items.productId', 'title type')
    .populate({
      path: 'items.seller',
      select: 'firstName lastName username ethereumAddress',
    });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({ order });
});
