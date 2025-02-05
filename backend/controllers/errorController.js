const AppError = require('../utils/appError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  if (err.name === 'CastError')
    return res.status(400).json({
      status: 'error',
      message: 'Invalid resource!',
    });
  return next(err);
};

module.exports = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token! Please log in again!',
    });
  return next(err);
};
