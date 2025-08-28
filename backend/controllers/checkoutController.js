const { ethers } = require('ethers');
const Cart = require('../models/cartModel');
const catchAsync = require('./../utils/catchAsync');
const Order = require('../models/orderModel');
const { User } = require('../models/userModel');
const fetch = require('node-fetch');

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

exports.checkoutPhysical = catchAsync(async (req, res, next) => {
  const cart = await getOrCreateCart(req.userId);

  await cart.populate({
    path: 'items.productId',
    select: 'type seller title unitPriceMinor',
    populate: { path: 'seller', select: 'firstName lastName' },
  });

  const physicalItems = cart.items.filter(
    (it) => it.productId && it.productId.type === 'OnPaper'
  );

  if (physicalItems.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  const order = await Order.create({
    userId: req.userId,
    type: 'OnPaper',
    items: physicalItems.map((it) => ({
      productId: it.productId._id,
      title: it.title,
      unitPriceMinor: it.unitPriceMinor,
      quantity: it.quantity || 1,
      seller: it.productId.seller ? it.productId.seller._id : null,
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
    populate: {
      path: 'seller',
      select: 'firstName lastName username ethereumAddress',
    },
  });

  const ebookItems = cart.items.filter((it) => it.productId?.type === 'E-book');
  if (ebookItems.length === 0) {
    return res.status(400).json({ message: 'No ebooks in cart' });
  }

  let txReceipt;
  try {
    txReceipt = await provider.getTransactionReceipt(txHash);
  } catch (err) {
    console.error('Provider error:', err);
    return res.status(500).json({ message: 'Ethereum provider not available' });
  }

  if (!txReceipt) {
    return res
      .status(400)
      .json({ message: 'Transaction not found or still pending' });
  }

  const status = txReceipt.status === 1 ? 'paid' : 'failed';

  const totalMinor = ebookItems.reduce(
    (sum, it) => sum + it.unitPriceMinor * (it.quantity || 1),
    0
  );

  const order = await Order.create({
    userId: req.userId,
    type: 'E-book',
    items: ebookItems.map((it) => ({
      productId: it.productId._id,
      title: it.title,
      unitPriceMinor: it.unitPriceMinor,
      quantity: it.quantity || 1,
      seller: it.productId.seller._id,
    })),
    paymentInfo: {
      method: 'eth',
      txHash,
      amountMinor: totalMinor,
      amountEth: amountETH,
      rateUsed,
    },
    status,
  });

  if (status === 'paid') {
    cart.items = cart.items.filter((it) => it.productId.type !== 'E-book');
    cart.updatedAt = new Date();
    await cart.save();
  }

  res.status(201).json({
    message: 'Ebook checkout processed',
    orderId: order._id,
    status: order.status,
    remainingItems: cart.items,
  });
});
