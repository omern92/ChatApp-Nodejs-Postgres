var express    = require('express');
var router     = express.Router();
var app        = require('./app');
var io         = app.get('io');
var mapper     = require('./database/userFunctions');
var userMapper = require('./database/staticFunctions');


io.on('connection', (socket) => {
  if (!socket.request.session || !socket.request.session.username) {
    socket.emit('not logged in');
    return Error('Not Connected');
  }
  
  var username   = socket.request.session.username;
  var roomID     = socket.request.session.room;
  socket.join(roomID);

  socket.emit('welcome', { name: username, room: roomID });
  showUsers(roomID);
  showMessages(roomID);
  showRooms();

  socket.on('addMessage', async (message, fn) => {
    try {
      const roomID = socket.request.session.room;
      let response = await mapper.addMessage(username, message, roomID);
      if (response === true) {
        io.in(roomID).emit('newMessage', { time: new Date().toLocaleTimeString(), user: username, mess: message });
        fn({ success: true });
      }

    } catch(e) {
      fn({ success: false, message: 'Connection error.' });
    }
  });

  socket.on('addRoom', async (roomName, fn) => {
    try {
      let response = await mapper.roomExists(roomName);
      if (response === false) {
        let result = await mapper.addRoom(roomName);
        if (result.success) {
            fn({ success: true, room_id: result.id });
        } 
      } 
      else  fn({ success: false, message: 'Room already exists.' });

    } catch(e) {
            fn({ success: false, message: 'Connection error.' });
    }

  });


  socket.on('changeRoom', async (roomID, fn) => {
    try {
      let response = await mapper.changeRoom(roomID, username);
      if (response === true) {
        socket.request.session.room = roomID;
        
        socket.join(roomID);
        showUsers(roomID);
        showMessages(roomID);
        showRooms();
        fn(true);
      } 

    } catch(e) {
        fn(false);
    }
  });

  socket.on('disconnect', async () => {
    try {
      console.log('disconnect invoked');
      userMapper.userDisconnected(username);
    } catch(err) {
      socket.emit('error', err);
    }
  });

  console.log('User has connected by socket successfully');
});

async function showMessages(roomID) {
  try {
    let response = await mapper.getMessages(roomID);
    io.emit('getMessages', response);  

  } catch(e) {
    socket.emit('error', e);
  }
}

async function showRooms() {
  try {
    let response = await mapper.getRooms();
    io.emit('getRooms', response);

  } catch(e) {
    socket.emit('error', e);
  }
}

async function showUsers(roomID) {
  try {
    let response = await mapper.getUsers(roomID);
    io.emit('getUsers', response);

  } catch(e) {
    socket.emit('error', e);
  }
}




module.exports = router;