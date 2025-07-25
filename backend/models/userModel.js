const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'Please enter first name!'] },
  lastName: { type: String, required: [true, 'Please enter last name!'] },
  email: {
    type: String,
    required: [true, 'Please enter email!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter password!'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match!",
    },
  },
  passwordResetToken: String,
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['reader', 'admin'],
    default: 'reader',
  },
  userType: {
    type: String,
    default: 'regular',
    immutable: true,
  },
});

const ethereumUserSchema = new mongoose.Schema({
  ethereumAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['reader'],
    default: 'reader',
    immutable: true,
  },
  userType: {
    type: String,
    default: 'ethereum',
    immutable: true,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.isPasswordCorrect = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  //generate token in hexadecimal
  const resetToken = crypto.randomBytes(32).toString('hex');

  //encrypt token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //set to expire after 10 minutes in miliseconds
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
const EthereumUser = mongoose.model('EthereumUser', ethereumUserSchema);
module.exports = {
  User,
  EthereumUser,
};
