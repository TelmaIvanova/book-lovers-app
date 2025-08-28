const express = require('express');
const authController = require('./../controllers/authController');
const cartController = require('./../controllers/cartController');

const router = express.Router();

router.get('/', authController.protect, cartController.getCart);
router.post('/items', authController.protect, cartController.addItem);

router.patch(
  '/items/:itemId',
  authController.protect,
  cartController.updateItem
);

router.delete(
  '/items/:itemId',
  authController.protect,
  cartController.deleteItem
);

module.exports = router;
