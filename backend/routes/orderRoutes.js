const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.use(protect);
router.get('/', orderController.getMyOrders);

module.exports = router;
