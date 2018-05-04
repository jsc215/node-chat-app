const socket = io();


const scrollToBottom = () => {
  // Selectors
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child')
  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if ( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
   messages.scrollTop(scrollHeight)
  }

}

socket.on('connect', () => {
  let params = $.deparam(window.location.search);

  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  })
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
});

socket.on('updateUserList', (users) => {
  let ol = $('<ol></ol>');

  users.forEach(user => {
    ol.append($('<li></li>').text(user));
  })
  $('#users').html(ol)
})

socket.on('newMessage', message => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a')
  let template = $('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })
  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();
  let messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, () => {
    messageTextbox.val('');
  });
});

let locationButton = $('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  })
})