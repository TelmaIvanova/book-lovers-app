const express = require('express');
const authController = require('../controllers/authController');
const sellerController = require('../controllers/sellerController');
const optionalAuth = require('../utils/optionalAuth');

const router = express.Router();

router.get('/:id', optionalAuth, sellerController.getSellerInfo);
router.patch('/:id/rate', authController.protect, sellerController.rateSeller);

module.exports = router;
