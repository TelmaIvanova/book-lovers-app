const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('rateBook', (data) => {
    console.log('Book rated:', data);
    io.emit('ratingUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
