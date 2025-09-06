const Book = require('./../models/bookModel');
const { User, EthereumUser } = require('../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
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
  const filter = req.userId ? { seller: { $ne: req.userId } } : {};

  const features = new APIFeatures(Book.find(filter), req.query)
    .filter()
    .paginate();
  let books = await features.query;
  if (req.user) {
    const currentUserId = req.user._id.toString();
    books = books.filter((book) => book.seller.toString() !== currentUserId);
  }

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

exports.getMyBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find({ seller: req.user._id });
  console.log(req.user._id);
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: { books },
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

exports.sellBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  await Book.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(book.seller, { $inc: { booksCount: -1 } });

  res.status(200).json({
    status: 'success',
    message: 'Book sold successfully',
  });
});
