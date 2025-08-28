const Cart = require('../models/cartModel');
const catchAsync = require('./../utils/catchAsync');
const Book = require('../models/bookModel');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await getOrCreateCart(req.userId);

  cart = await cart.populate({
    path: 'items.productId',
    populate: {
      path: 'seller',
      select: 'firstName lastName username ethereumAddress',
    },
  });

  const physicalItems = [];
  const ebookItems = [];

  for (const it of cart.items) {
    if (!it.productId) continue;

    const itemData = {
      _id: it._id,
      productId: it.productId._id,
      title: it.title,
      unitPriceMinor: it.unitPriceMinor,
      seller: it.productId.seller,
    };

    if (it.productId.type === 'OnPaper') {
      physicalItems.push(itemData);
    } else if (it.productId.type === 'E-book') {
      ebookItems.push(itemData);
    }
  }

  res.json({ physicalItems, ebookItems });
});

exports.addItem = catchAsync(async (req, res, next) => {
  const { productId, title, unitPriceMinor } = req.body;
  if (
    !productId ||
    !title ||
    !Number.isInteger(unitPriceMinor) ||
    unitPriceMinor < 0
  ) {
    return res.status(400).json({ message: 'Invalid payload' });
  }
  const book = await Book.findById(productId);
  const cart = await getOrCreateCart(req.userId);
  const exists = cart.items.some(
    (i) => String(i.productId) === String(productId)
  );
  if (exists) return res.status(409).json({ message: 'ALREADY_IN_CART' });

  cart.items.push({
    productId: book._id,
    title,
    unitPriceMinor: book.price.amount,
  });
  cart.updatedAt = new Date();
  await cart.save();

  res.status(201).json({ items: cart.items });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be >= 1' });
  }

  const cart = await getOrCreateCart(req.userId);
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.quantity = quantity;
  cart.updatedAt = new Date();
  await cart.save();

  res.status(201).json({ items: cart.items });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await getOrCreateCart(req.userId);
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.deleteOne();
  cart.updatedAt = new Date();
  await cart.save();

  res.status(201).json({ items: cart.items });
});
