const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllBooks = catchAsync(async (req, res) => {
  const features = new APIFeatures(Book.find(), req.query).filter().paginate();
  const books = await features.query;

  res.status(200).json({
    results: books.length,
    data: {
      books,
    },
    message: 'success',
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError('No book was found!', 404));
  }
  res.status(200).json({
    data: {
      book,
    },
  });
});

exports.addBook = catchAsync(async (req, res) => {
  const newBook = await Book.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      book: newBook,
    },
  });
});

exports.updateBook = catchAsync(async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedBook,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});
