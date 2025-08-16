const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must contain a title!'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'A book must contain an author!'],
    trim: true,
  },
  price: {
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    currency: {
      type: String,
      enum: ['BGN', 'EUR', 'ETH'],
      required: true,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isExchange: {
      type: Boolean,
      default: false,
    },
  },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isbn: {
    type: String,
    required: [true, 'A book must contain an ISBN!'],
    trim: true,
    // validate: {
    //   validator: function (val) {
    //     return validator.isISBN(val);
    //   },
    //   message: 'A book must contain valid ISBN!',
    // },
  },
  publishedYear: {
    type: Number,
    required: [true, 'A book must contain a published year!'],
    trim: true,
  },
  coverImage: {
    type: String,
    required: [true, 'A book must contain cover image!'],
  },
  genre: {
    type: String,
    required: [true, 'A book must contain a genre!'],
  },
  status: {
    type: String,
    enum: ['New', 'VeryGood', 'Good', 'Bad'],
    required: true,
  },
  type: {
    type: String,
    enum: ['E-book', 'OnPaper'],
    required: [true, 'Please select book type.'],
  },
  language: {
    type: String,
    required: [true, 'Please enter language.'],
  },
  pages: {
    type: Number,
    required: [true, 'Please enter pages.'],
  },
  publisher: String,
  cover: {
    type: String,
    enum: ['hardcover', 'softcover'],
  },
  summary: {
    type: String,
    required: [true, 'A book must contain a summary!'],
  },
  comment: String,
  rating: { type: Number, default: 0 },
  r1: { type: Number, default: 0 },
  r2: { type: Number, default: 0 },
  r3: { type: Number, default: 0 },
  r4: { type: Number, default: 0 },
  r5: { type: Number, default: 0 },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
