const express = require('express');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(authController.protect, bookController.addBook);
router
  .route('/:id')
  .get(bookController.getBook)
  .patch(
    authController.protect,
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.deleteBook
  );
  router.patch('/:id/rate', authController.protect, bookController.rateBook);

module.exports = router;
