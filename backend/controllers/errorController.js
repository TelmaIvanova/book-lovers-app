const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'Invalid resource!';
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Invalid token! Please log in again!';
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorHandler;
