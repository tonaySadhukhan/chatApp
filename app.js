const express = require('express');
const router = require('./routes');
const connection = require('./connection');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const messageModel = require('./models/messages');
const chatModel = require('./models/chat');
const app = express();

app.use(cors({
  origin: "*", // later restrict to frontend URL
  credentials: true
}));
app.use(express.json());
app.use('/api', router);

// create http server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// socket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('send_message',async (data) => {
    /*
      data = {
        roomId,
        senderId,
        message,
        chatId
      }
    */
   console.log('Message received:', data.roomId, data.message, data.chatId);
     const chatMessage = new messageModel({
      chatId: data.chatId,
      sender: data.sender,   // ✅ FIXED
      content: data.message,
      timestamp: new Date()
    });

    const savedMessage = await chatMessage.save(); // ✅ WAIT

    await chatModel.findByIdAndUpdate(
      data.chatId,
      { $push: { messages: savedMessage._id } }
    );

      
    io.to(data.roomId).emit('receive_message', data);
    //io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
