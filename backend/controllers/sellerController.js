const Book = require('../models/bookModel');
const { User, EthereumUser } = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getSellerInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let seller = await User.findById(id);
  if (!seller) seller = await EthereumUser.findById(id);
  if (!seller) return next(new AppError('Seller not found', 404));

  const userId = req.userId;
  const hasVoted = userId ? seller.votes?.includes(userId) : false;

  const books = await Book.find({ seller: id });

  const displayName =
    seller.firstName || seller.lastName
      ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim()
      : seller.username || `Ethereum User`;

  res.status(200).json({
    status: 'success',
    seller: {
      _id: seller._id,
      firstName: seller.firstName,
      lastName: seller.lastName,
      username: seller.username,
      contact: seller.contact,
      booksCount: books.length,
      rating: seller.rating,
      votesCount: seller.r1 + seller.r2 + seller.r3 + seller.r4 + seller.r5,
      hasVoted,
      displayName,
    },
    books,
  });
});

function calculateAverageSellerRating(r1, r2, r3, r4, r5) {
  const totalVotes = r1 + r2 + r3 + r4 + r5;
  if (totalVotes === 0) return 0;
  const totalRating = 5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + 1 * r1;
  return Math.round((totalRating / totalVotes) * 100) / 100;
}

exports.rateSeller = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let seller = await User.findById(id);
  if (!seller) seller = await EthereumUser.findById(id);
  if (!seller) return next(new AppError('Seller not found', 404));

  const userId = req.userId;
  if (!userId) return next(new AppError('Not authenticated', 401));

  if (seller.votes?.includes(userId)) {
    return next(new AppError('You have already rated this seller!', 403));
  }

  const { newVote } = req.body;

  if (newVote === 1) seller.r1 += 1;
  if (newVote === 2) seller.r2 += 1;
  if (newVote === 3) seller.r3 += 1;
  if (newVote === 4) seller.r4 += 1;
  if (newVote === 5) seller.r5 += 1;

  seller.votes = seller.votes || [];
  seller.votes.push(req.user.id);

  seller.rating = calculateAverageSellerRating(
    seller.r1,
    seller.r2,
    seller.r3,
    seller.r4,
    seller.r5
  );

  await seller.save();

  res.status(200).json({
    status: 'success',
    seller,
  });
});
