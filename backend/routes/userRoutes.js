const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.delete(
  '/deleteAccount',
  authController.protect,
  authController.deleteAccount
);

router.delete(
  '/delete/:id',
  authController.protect,
  authController.restrictTo('admin'),
  authController.deleteUser
);

router.get('/api/nonce', authController.nonce);
router.post('/api/verify', authController.verify);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser
  );

router
  .route('/profile')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser);

router.patch(
  '/changePassword/:id',
  authController.protect,
  authController.restrictTo('admin'),
  authController.changePassword
);

router.route('/:id').get(authController.protect, userController.getUserById);

router.post(
  '/create',
  authController.protect,
  authController.restrictTo('admin'),
  userController.createUser
);

module.exports = router;
