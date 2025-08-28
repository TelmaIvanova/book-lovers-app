const express = require('express');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    bookController.uploadCoverImage,
    bookController.resizeAndUploadCoverImage,
    authController.protect,
    bookController.addBook
  );
router.patch('/:id/rate', authController.protect, bookController.rateBook);
router.get('/:id/seller', bookController.getSellerInfo);
router.route('/:id/sell').post(authController.protect, bookController.sellBook);
router
  .route('/:id')
  .get(bookController.getBook)
  .patch(
    bookController.uploadCoverImage,
    bookController.resizeAndUploadCoverImage,
    authController.protect,
    bookController.updateBook
  )
  .delete(authController.protect, bookController.deleteBook);

module.exports = router;
