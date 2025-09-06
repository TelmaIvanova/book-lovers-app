const Discussion = require('./../models/discussionModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllDiscussions = catchAsync(async (req, res) => {
  const features = new APIFeatures(Discussion.find, req.query)
    .filter()
    .paginate();

  const discussions = await features.query;

  res.status(200).json({
    results: discussions.length,
    data: {
      discussions,
    },
    message: 'success',
  });
});

exports.getDiscussion = catchAsync(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  res.status(200).json({
    data: {
      discussion,
    },
  });
});

exports.createDiscussion = catchAsync(async (req, res) => {
  const newDiscussion = await Discussion.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      discussion: newDiscussion,
    },
  });
});

exports.updateDiscussion = catchAsync(async (req, res) => {
  const updatedDiscussion = await Discussion.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedDiscussion,
    },
  });
});

exports.deleteDiscussion = catchAsync(async (req, res) => {
  await Discussion.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});
