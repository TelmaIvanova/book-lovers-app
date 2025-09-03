const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');
const { createAndFormatMessage } = require('../utils/messageHelper');
const EthereumUser = require('../models/userModel');

const formatUser = (user) => {
  if (!user) return 'Unknown';
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  if (user.username) return user.username;
  return 'User';
};

exports.getMessages = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId })
    .populate('sender', 'firstName lastName username')
    .populate('receiver', 'firstName lastName username')
    .sort({ createdAt: 1 });

  const formatted = messages.map((m) => ({
    _id: m._id,
    roomId: m.roomId,
    text: m.text,
    createdAt: m.createdAt,
    sender: m.sender
      ? {
          id: m.sender._id,
          displayName: formatUser(m.sender),
          modelType: m.senderModel,
        }
      : { id: null, displayName: 'Unknown' },
    receiver: m.receiver
      ? {
          id: m.receiver._id,
          displayName: formatUser(m.receiver),
          modelType: m.receiverModel,
        }
      : { id: null, displayName: 'Unknown' },
  }));

  res.status(200).json({
    status: 'success',
    results: formatted.length,
    messages: formatted,
  });
});

exports.getConversations = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate('sender', 'firstName lastName username')
    .populate('receiver', 'firstName lastName username')
    .sort({ createdAt: -1 });

  const map = new Map();

  messages.forEach((m) => {
    const other =
      m.sender && m.sender._id.toString() === userId.toString()
        ? m.receiver
        : m.sender;

    if (!other) return;

    if (!map.has(other._id.toString())) {
      map.set(other._id.toString(), {
        otherUser: {
          id: other._id,
          displayName: formatUser(other),
          modelType:
            m.sender && m.sender._id.toString() === userId.toString()
              ? m.receiverModel
              : m.senderModel,
        },
        lastMessage: {
          text: m.text,
          createdAt: m.createdAt,
        },
      });
    }
  });

  const conversations = Array.from(map.values());

  res.status(200).json({
    status: 'success',
    results: conversations.length,
    conversations,
  });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  const { roomId, receiver, text } = req.body;
  const sender = req.user._id;
  const senderModel = req.user.isEthereum ? 'EthereumUser' : 'User';

  let receiverModel = 'User';
  const existsInEth = await EthereumUser.findById(receiver);
  if (existsInEth) receiverModel = 'EthereumUser';

  const formatted = await createAndFormatMessage({
    roomId,
    sender,
    senderModel,
    receiver,
    receiverModel,
    text,
  });

  res.status(201).json({
    status: 'success',
    message: formatted,
  });
});
