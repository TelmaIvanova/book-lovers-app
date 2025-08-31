const express = require('express');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/authController');
const router = express.Router();
const optionalAuth = require('../utils/optionalAuth');

router
  .route('/')
  .get(optionalAuth, bookController.getAllBooks)
  .post(
    bookController.uploadCoverImage,
    bookController.resizeAndUploadCoverImage,
    authController.protect,
    bookController.addBook
  );
router.get('/my-books', authController.protect, bookController.getMyBooks);
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
