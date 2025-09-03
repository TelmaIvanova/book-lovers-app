const http = require('http');
const { Server } = require('socket.io');
const { createAndFormatMessage } = require('./utils/messageHelper');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const app = require('./app');
const CONNECTION = process.env.CONNECTION;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on(
    'sendMessage',
    async ({
      roomId,
      message,
      sender,
      senderModel,
      receiver,
      receiverModel,
    }) => {
      try {
        const formatted = await createAndFormatMessage({
          roomId,
          sender,
          receiver,
          senderModel,
          receiverModel,
          text: message,
        });

        io.to(roomId).emit('receiveMessage', formatted);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    }
  );

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);
    console.log('MongoDB connected');
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  } catch (err) {
    console.error(err.message);
  }
};

start();
