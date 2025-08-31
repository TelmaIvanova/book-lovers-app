const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { User, EthereumUser } = require('../models/userModel');

module.exports = async function optionalAuth(req, res, next) {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      let user;
      if (decoded.userType === 'ethereum') {
        user = await EthereumUser.findById(decoded.id);
      } else {
        user = await User.findById(decoded.id);
      }

      if (user) {
        req.user = user;
        req.userId = user._id.toString();
      }
    }
    next(); //continue even without token
  } catch (err) {
    //if the token is invalid - treat the user as guest
    next();
  }
};
