const Genre = require('./../models/genreModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllGenres = catchAsync(async (req, res) => {
  const features = new APIFeatures(Genre.find(), req.query).filter().paginate();
  const genres = await features.query;

  res.status(200).json({
    results: genres.length,
    data: {
      genres,
    },
    message: 'success',
  });
});

exports.getGenre = catchAsync(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  res.status(200).json({
    data: {
      genre,
    },
  });
});

exports.addGenre = catchAsync(async (req, res) => {
  const newGenre = await Genre.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      genre: newGenre,
    },
  });
});

exports.updateGenre = catchAsync(async (req, res) => {
  const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedGenre,
    },
  });
});

exports.deleteGenre = catchAsync(async (req, res) => {
  await Genre.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});
