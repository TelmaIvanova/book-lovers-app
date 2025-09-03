const Message = require('../models/messageModel');
const formatUser = require('./formatUser');

async function createAndFormatMessage({
  roomId,
  sender,
  receiver,
  senderModel,
  receiverModel,
  text,
}) {
  const msg = await Message.create({
    roomId,
    sender,
    receiver,
    senderModel,
    receiverModel,
    text,
  });

  await msg.populate('sender', 'firstName lastName username');
  await msg.populate('receiver', 'firstName lastName username');

  return {
    _id: msg._id,
    roomId: msg.roomId,
    text: msg.text,
    createdAt: msg.createdAt,
    sender: msg.sender
      ? {
          id: msg.sender._id,
          displayName: formatUser(msg.sender),
          modelType: senderModel,
        }
      : { id: null, displayName: 'Unknown' },
    receiver: msg.receiver
      ? {
          id: msg.receiver._id,
          displayName: formatUser(msg.receiver),
          modelType: receiverModel,
        }
      : { id: null, displayName: 'Unknown' },
  };
}

module.exports = { createAndFormatMessage };
