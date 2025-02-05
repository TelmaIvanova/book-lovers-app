const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');

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

exports.getUser = (req, res) => {
  res.status(200).json({
    message: "API isn't implemented yet!",
  });
};

exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      book: 'updated here',
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
