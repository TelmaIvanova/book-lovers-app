const User = require('./../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter an email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You must be logged in!', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id); //used later on in restrictTo

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authorized!', 403));
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');
  if (
    !(await user.isPasswordCorrect(req.body.currentPassword, user.password))
  ) {
    return next(new AppError('Incorrect password!', 401));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');
  const { password } = req.body;

  if (!password) {
    return next(new AppError('You must enter your password!', 400));
  }

  if (!(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect password!', 401));
  }

  await user.deleteOne();
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.changeUserPassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let user = await User.findById(id);

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
  });
});
