let socket = io();

socket.on('connect', () => {
  console.log('connected to server');

  socket.emit('createMessage', {
    from: 'Tom',
    text: 'I love that album Jeff'
  });
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
});

socket.on('newMessage', message => {
  console.log('New Message', message);
});
