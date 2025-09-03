const Cart = require('../models/cartModel');
const catchAsync = require('./../utils/catchAsync');
const Order = require('../models/orderModel');
const fetch = require('node-fetch');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

exports.checkoutPhysical = catchAsync(async (req, res, next) => {
  const cart = await getOrCreateCart(req.user.id);

  await cart.populate({
    path: 'items.productId',
    select: 'type seller sellerModel title unitPriceMinor',
    populate: {
      path: 'seller',
      select: 'firstName lastName username ethereumAddress',
    },
  });

  const physicalItems = cart.items.filter(
    (it) => it.productId && it.productId.type === 'OnPaper'
  );

  if (physicalItems.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  const order = await Order.create({
    userId: req.user.id,
    type: 'OnPaper',
    items: physicalItems.map((it) => ({
      productId: it.productId._id,
      title: it.title,
      unitPriceMinor: it.unitPriceMinor,
      quantity: it.quantity || 1,
      seller: it.productId.seller?._id,
      sellerModel: it.productId.sellerModel || 'User',
    })),
    paymentInfo: {
      method: 'cash',
      amountMinor: physicalItems.reduce(
        (sum, it) => sum + it.unitPriceMinor * (it.quantity || 1),
        0
      ),
    },
  });

  cart.items = cart.items.filter(
    (it) => it.productId && it.productId.type !== 'OnPaper'
  );
  cart.updatedAt = new Date();
  await cart.save();

  res.status(201).json({
    message: 'Order created',
    orderId: order._id,
    status: order.status,
    remainingItems: cart.items,
  });
});

exports.prepareEbookCheckout = catchAsync(async (req, res, next) => {
  const cart = await getOrCreateCart(req.userId);
  await cart.populate({
    path: 'items.productId',
    populate: {
      path: 'seller',
      select: 'firstName lastName username ethereumAddress',
    },
  });

  const ebookItems = cart.items.filter((it) => it.productId?.type === 'E-book');
  if (ebookItems.length === 0) {
    return res.status(400).json({ message: 'No ebooks in cart' });
  }

  const totalMinor = ebookItems.reduce(
    (sum, it) => sum + it.unitPriceMinor * (it.quantity || 1),
    0
  );
  const totalEUR = totalMinor / 100;

  const rateRes = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur'
  );
  const data = await rateRes.json();
  const rate = data.ethereum.eur;

  const amountETH = (totalEUR / rate).toFixed(6);

  res.json({
    amountEUR: totalEUR,
    amountETH,
    rateUsed: rate,
    sellers: ebookItems.map((it) => {
      const s = it.productId.seller;
      return {
        sellerId: s._id,
        address: s.ethereumAddress || null,
      };
    }),
  });
});

exports.checkoutEbooks = catchAsync(async (req, res, next) => {
  const { txHash, amountETH, rateUsed } = req.body;
  if (!txHash) {
    return res.status(400).json({ message: 'Transaction hash required' });
  }

  let cart = await getOrCreateCart(req.userId);
  cart = await cart.populate({
    path: 'items.productId',
    select: 'title type seller sellerModel unitPriceMinor',
    populate: {
      path: 'seller',
      select: 'firstName lastName username ethereumAddress',
    },
  });

  const ebookItems = cart.items.filter((it) => it.productId?.type === 'E-book');
  if (ebookItems.length === 0) {
    return res.status(400).json({ message: 'No ebooks in cart' });
  }

  const totalMinor = ebookItems.reduce(
    (sum, it) => sum + it.unitPriceMinor * (it.quantity || 1),
    0
  );

  const order = await Order.create({
    userId: req.user.id,
    type: 'E-book',
    items: ebookItems.map((it) => ({
      productId: it.productId._id,
      title: it.title,
      unitPriceMinor: it.unitPriceMinor,
      quantity: it.quantity || 1,
      seller: it.productId.seller?._id,
      sellerModel: it.productId.sellerModel,
    })),
    paymentInfo: {
      method: 'eth',
      txHash,
      amountMinor: totalMinor,
      amountEth: amountETH,
      rateUsed,
    },
    status: 'pending',
  });

  res.status(201).json({
    message: 'Ebook order created',
    orderId: order._id,
    status: order.status,
  });
});
