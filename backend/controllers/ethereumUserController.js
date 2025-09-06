const { EthereumUser } = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllEthereumUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(EthereumUser.find(), req.query)
    .filter()
    .paginate();
  const users = await features.query;

  res.status(200).json({
    results: users.length,
    data: {
      users,
    },
    message: 'success',
  });
});

exports.getEthereumUserById = async (req, res, next) => {
  try {
    const user = await EthereumUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No Ethereum user found with that ID',
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

exports.getEthereumUser = catchAsync(async (req, res) => {
  const user = await EthereumUser.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('Ethereum user not found');
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateEthereumUser = catchAsync(async (req, res) => {
  const user = await EthereumUser.findByIdAndUpdate(req.user.id, req.body, {
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
