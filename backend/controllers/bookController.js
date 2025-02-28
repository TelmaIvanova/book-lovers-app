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

exports.updateBook = catchAsync(async (req, res, next) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    return next(new AppError('Book not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedBook,
    },
  });
});

function calculateAverageRating(r1, r2, r3, r4, r5) {
  const totalVotes = r1 + r2 + r3 + r4 + r5;
  if (totalVotes === 0) return 0;

  const totalRating = 5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + 1 * r1;
  return Math.round((totalRating / totalVotes) * 100) / 100;
}

exports.rateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new AppError('Book not found!', 404));
  }

  if (book.votes.includes(req.user.id)) {
    return next(new AppError('You have already voted for this book!', 403));
  }

  const { newVote } = req.body;

  if (newVote === 1) book.r1 += 1;
  if (newVote === 2) book.r2 += 1;
  if (newVote === 3) book.r3 += 1;
  if (newVote === 4) book.r4 += 1;
  if (newVote === 5) book.r5 += 1;

  book.votes.push(req.user.id);

  book.rating = calculateAverageRating(
    book.r1,
    book.r2,
    book.r3,
    book.r4,
    book.r5
  );

  await book.save();

  // const io = req.app.get('io');
  // io.emit('ratingUpdated', { bookId: book._id, newRating: book.rating });

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});
