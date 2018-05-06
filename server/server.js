const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('join', (params, callback) => {
    params.room = params.room.toLowerCase();

    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }
    if (users.getUserList(params.room).includes(params.name)) {
      return callback('That name is already taken. Try a different one.');
    }
    // the join method in socket.io
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app')
    );

    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage(
          'Admin',
          `${params.name} has joined the room: ${params.room}`
        )
      );
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io
        .to(user.room)
        .emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);
    if (user) {
      io
        .to(user.room)
        .emit(
          'newLocationMessage',
          generateLocationMessage(
            `${user.name}`,
            coords.latitude,
            coords.longitude
          )
        );
    }
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io
        .to(user.room)
        .emit(
          'newMessage',
          generateMessage(
            'Admin',
            `${user.name} has left the room: ${user.room}`
          )
        );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
