const express = require('express');
const cors = require('cors');

require('dotenv').config({ path: '.env' });
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const ethereumUserRoute = require('./routes/ethereumUserRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const messageRoutes = require('./routes/messageRoutes');
const genreRouter = require('./routes/genreRoutes');
const discussionRouter = require('./routes/discussionRoutes');

app.use('/api/books', bookRouter);
app.use('/api/sellers', sellerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRouter);
app.use('/api/ethereumUsers', ethereumUserRoute);
app.use('/api/nonce', userRouter);
app.use('/api/verify', userRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/genres', genreRouter);
app.use('/api/discussions', discussionRouter);
app.use(express.static(`${__dirname}/public`));
app.use('/img', express.static(`${__dirname}/public/img`));

app.all('*', (req, res, next) => {
  next(new AppError('The page was not found!', 404));
});

app.use(errorHandler);

module.exports = app;
