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
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.leave()

    // io.emit -> io.to('the room').emit
    // socket.broadcast.emit -> socket.broadcast.to('the room').emit
    // socket.emit

    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app')
    );

    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined.`)
      );
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect', () => {
   let user = users.removeUser(socket.id);

   if (user) {
     io.to(user.room).emit('updateUserList', users.getUserList(user.room));
     io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
   }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
