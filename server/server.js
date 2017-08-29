const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('message', generateMessage(message.from, message.text));
    callback('This is from the server.');
  });

  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});


server.listen(port, () => {
  console.log(`Chat app running on port ${port}`);
});
