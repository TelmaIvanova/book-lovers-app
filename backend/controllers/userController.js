const { User } = require('./../models/userModel');
const Book = require('./../models/bookModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter().paginate();
  const users = await features.query;

  res.status(200).json({
    results: users.length,
    data: {
      users,
    },
    message: 'success',
  });
});

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, passwordConfirm, role } =
    req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    role,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getSellerById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('Seller not found', 404));
  }

  let displayName = '';
  if (user.firstName || user.lastName) {
    displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  } else if (user.username) {
    displayName = user.username;
  } else {
    displayName = user.ethereumAddress;
  }

  const contact = user.contact || null;

  const booksCount = await Book.countDocuments({ seller: user._id });

  res.status(200).json({
    status: 'success',
    data: {
      seller: {
        id: user._id,
        displayName,
        ethereumAddress: user.ethereumAddress,
        contact,
        booksCount,
      },
    },
  });
});
