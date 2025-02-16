const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const CONNECTION = process.env.CONNECTION;
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const app = express();
app.use(express.json());

const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const genreRouter = require('./routes/genreRoutes');
const discussionRouter = require('./routes/discussionRoutes');

app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/genres', genreRouter);
app.use('/api/discussions', discussionRouter);
app.use(express.static(`${__dirname}/public`));
app.all('*', (req, res, next) => {
  next(new AppError('The page was not found!', 404));
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);
  } catch (e) {
    console.log(e.message);
  }
};

start();
module.exports = app;
