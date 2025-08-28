const Book = require('./../models/bookModel');
const { User, EthereumUser } = require('../models/userModel');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('./../utils/cloudinary');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCoverImage = upload.single('coverImage');

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'book-covers', resource_type: 'image' },
      (error, result) => {
        if (error) reject(new AppError('Cloudinary upload failed', 500));
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
};

exports.resizeAndUploadCoverImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await streamUpload(resizedBuffer);

    req.file.cloudinaryUrl = result.secure_url;

    next();
  } catch (err) {
    next(err);
  }
};

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

exports.addBook = catchAsync(async (req, res, next) => {
  req.body.seller = req.user.id;
  req.body.sellerModel =
    req.user.userType === 'ethereum' ? 'EthereumUser' : 'User';

  if (!req.file || !req.file.cloudinaryUrl) {
    return next(new AppError('No image uploaded!', 400));
  }
  req.body.coverImage = req.file.cloudinaryUrl;

  const amount = Number(req.body['price.amount']);
  const isFree = req.body['price.isFree'] === 'true';
  const isExchange = req.body['price.isExchange'] === 'true';
  const currency = req.body['price.currency'];

  req.body.price = {
    amount: isFree || isExchange ? 0 : amount,
    currency,
    isFree,
    isExchange,
  };

  const { type } = req.body;
  if (!type || !['E-book', 'OnPaper'].includes(type)) {
    return next(new AppError('Please select a valid book type.', 400));
  }

  if (!isFree && !isExchange) {
    if (isNaN(amount) || amount < 0) {
      return next(new AppError('Please provide a valid price amount.', 400));
    }
  }

  const newBook = await Book.create(req.body);
  if (req.user.userType === 'ethereum') {
    await EthereumUser.findByIdAndUpdate(req.user.id, {
      $inc: { booksCount: 1 },
    });
  } else {
    await User.findByIdAndUpdate(req.user.id, { $inc: { booksCount: 1 } });
  }

  res.status(201).json({
    status: 'success',
    data: {
      book: newBook,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  if (req.body['price.amount'] !== undefined) {
    req.body.price = {
      amount: Number(req.body['price.amount']) || 0,
      currency: req.body['price.currency'],
      isFree: req.body['price.isFree'] === 'true',
      isExchange: req.body['price.isExchange'] === 'true',
    };
  }

  const userId = req.user.id;
  const bookId = req.params.id;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).send('Book not found');

  if (book.seller.toString() !== userId) {
    return res.status(403).send('Not authorized to update this book');
  }

  if (req.file && req.file.cloudinaryUrl) {
    req.body.coverImage = req.file.cloudinaryUrl;
  }

  if (req.body.price) {
    const { price } = req.body;
    const amount = Number(price.amount);

    if (isNaN(amount) || amount < 0) {
      return next(new AppError('Please provide a valid price amount.', 400));
    }
  }

  const { type } = req.body;
  if (type && !['E-book', 'OnPaper'].includes(type)) {
    return next(new AppError('Please select a valid book type.', 400));
  }

  Object.assign(book, req.body);
  await book.save();

  res.status(200).json({
    status: 'success',
    data: { book },
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
  console.log('Received newVote:', req.body.newVote, typeof req.body.newVote);

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

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new AppError('Book not found', 404));

  if (req.user.role !== 'admin' && book.seller.toString() !== req.user.id) {
    return next(new AppError('Not authorized to delete this book', 403));
  }

  await Book.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(book.seller, { $inc: { booksCount: -1 } });

  res.status(204).json({ status: 'success' });
});

exports.getSellerInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id).populate('seller');
  if (!book) {
    return next(new AppError('Book not found', 404));
  }

  const user = book.seller;
  if (!user) {
    return next(new AppError('Seller not found', 404));
  }

  let displayName = '';

  if (user.firstName || user.lastName) {
    displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  } else if (user.username) {
    displayName = user.username;
  }

  const result = displayName
    ? `${displayName} (${user.ethAddress})`
    : user.ethAddress;

  res.status(200).json({
    status: 'success',
    seller: result,
  });
});

exports.sellBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  await Book.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(book.seller, { $inc: { booksCount: -1 } });

  res.status(200).json({
    status: 'success',
    message: 'Book sold successfully',
  });
});
