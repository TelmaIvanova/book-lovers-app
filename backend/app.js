const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'config.env' });
const CONNECTION = process.env.CONNECTION;
const app = express();
app.use(express.json());

const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);
  } catch (e) {
    console.log(e.message);
  }
};

start();
module.exports = app;
