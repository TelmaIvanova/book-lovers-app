const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config({ path: '.env' });
const rateLimit = require('express-rate-limit');
const CONNECTION = process.env.CONNECTION;
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const app = express();

//Set security HTTP Headers
app.use(helmet());

const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const ethereumUserRoute = require('./routes/ethereumUserRoutes');
const genreRouter = require('./routes/genreRoutes');
const discussionRouter = require('./routes/discussionRoutes');

//Limit to 100 requests from the same IP in 1h
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //calculated in miliseconds
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb'}))

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization agains XSS
app.use(xss());

//Prevent parameter polution
app.use(hpp()); 

app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/ethereumUsers', ethereumUserRoute);
app.use('/api/nonce', userRouter);
app.use('/api/verify', userRouter);
app.use('/api/genres', genreRouter);
app.use('/api/discussions', discussionRouter);

app.use(express.json());
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
