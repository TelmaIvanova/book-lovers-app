const { User, EthereumUser } = require('./../models/userModel');
const { promisify } = require('util');
const { generateNonce, SiweMessage, ErrorTypes } = require('siwe');
const sendMail = require('./../utils/email');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
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

  const token = signToken(newUser._id, newUser.userType);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
      type: newUser.userType,
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

  const token = signToken(user._id, user.userType);
  res.status(200).json({
    status: 'success',
    token,
    type: user.userType,
  });
});

const generateNonceToken = (nonce) =>
  jwt.sign({ nonce }, process.env.JWT_SECRET, { expiresIn: '1m' });

exports.nonce = catchAsync(async (req, res) => {
  const nonce = generateNonce();
  const nonceToken = generateNonceToken(nonce);

  res.status(200).json({ nonce, nonceToken });
});

const validateSIWEMessage = async (req) => {
  if (!req.body.message || !req.body.nonceToken) {
    throw new AppError('Expected message and nonceToken in body.', 422);
  }

  let decoded;
  try {
    decoded = jwt.verify(req.body.nonceToken, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired nonce token.', 440);
  }

  const siweMessage = new SiweMessage(req.body.message);
  const { data: message } = await siweMessage.verify({
    signature: req.body.signature,
    nonce: decoded.nonce,
  });

  return message;
};

const getOrCreateEthereumUser = async (address) => {
  let user = await EthereumUser.findOne({ ethereumAddress: address });
  if (!user) {
    user = await EthereumUser.create({ ethereumAddress: address });
  }
  return user;
};

exports.verify = catchAsync(async (req, res) => {
  try {
    const message = await validateSIWEMessage(req);
    const user = await getOrCreateEthereumUser(message.address);

    const token = signToken(user._id, 'ethereum');

    res.status(200).json({ token });
  } catch (e) {
    console.error(e);

    const status = [
      ErrorTypes.EXPIRED_MESSAGE,
      ErrorTypes.INVALID_SIGNATURE,
    ].includes(e)
      ? e === ErrorTypes.EXPIRED_MESSAGE
        ? 440
        : 422
      : 500;

    res.status(status).json({ message: e.message });
  }
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

  let user;
  if (decoded.userType === 'ethereum') {
    user = await EthereumUser.findById(decoded.id);
  } else {
    user = await User.findById(decoded.id);
  }

  if (!user) {
    return next(new AppError('User not found!', 401));
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User has recently changed the password! Please log in again!',
        401
      )
    );
  }

  req.user = user;

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('The reset password link is sent!', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id, user.userType);
  res.status(200).json({
    status: 'success',
    token,
    type: user.userType,
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
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

exports.changePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let user = await User.findById(id);

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.deleteEthereumUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await EthereumUser.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteEthereumAccount = catchAsync(async (req, res, next) => {
  await EthereumUser.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
