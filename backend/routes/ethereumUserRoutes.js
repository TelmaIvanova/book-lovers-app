const express = require('express');
const ethereumUserController = require('./../controllers/ethereumUserController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/nonce', authController.nonce);

router.post('/verify', authController.verify);

router
  .route('/ethereumProfile')
  .get(authController.protect, ethereumUserController.getEthereumUser)
  .patch(authController.protect, ethereumUserController.updateEthereumUser);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    ethereumUserController.getAllEthereumUsers
  );

router
  .route('/:id')
  .get(authController.protect, ethereumUserController.getEthereumUserById);

router.delete(
  '/delete-ethereum-user/:id',
  authController.protect,
  authController.restrictTo('admin'),
  authController.deleteEthereumUser
);

router.delete(
  '/delete-ethereum-account',
  authController.protect,
  authController.deleteEthereumAccount
);

module.exports = router;
