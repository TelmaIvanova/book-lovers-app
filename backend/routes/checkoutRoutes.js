const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/physical',
  authController.protect,
  checkoutController.checkoutPhysical
);

router.post(
  '/ebooks',
  authController.protect,
  checkoutController.checkoutEbooks
);

router.get(
  '/prepare',
  authController.protect,
  checkoutController.prepareEbookCheckout
);
module.exports = router;
