var socket = io();


socket.on('welcome', (userDetails) => {
  $('#user_name').html(userDetails.name);
  $('#room_display').html(userDetails.room);
});

socket.on('not logged in', () => {
  alert('You must log in to use our chat');
  window.location.replace('/login.html');
});


socket.on('getMessages', (messages) => {
  $('#messages').empty();
  if (typeof messages === 'object') {

    Object.values(messages).forEach((message) => {
      let $tr = $(document.createElement('tr'));
      $('#messages').append($tr);

      Object.values(message).forEach((value, i) => {
          let $td = $( '<td/>', {
            id: 'td' + i,
            html: value
          });
          $tr.append($td);
      });
    });
    $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 1000);

  } else {
    $('#error').html(messages);
    $('#error').css('color', 'red');
  }
});


socket.on('getRooms', (rooms) => {
  if (typeof rooms === 'object') {
    $('#rooms_ul').empty();

    for (let room of Object.values(rooms)) {
      let roomID = room.id;
      let roomName = room.name;
      let $li = $(document.createElement('li'));
      let $link = $( '<a/>', {
                      href: '#',
                      'class': 'list-group-item list-group-item-action',
                      click: function(){ changeRoom(roomID, roomName) },
                      id: roomID,
                      html: roomName
                    });
      $('#rooms_ul').append($li);
      $li.append($link);
    };

  } else {
    $('#error').html('An error occured while updating rooms list.');
  }
});


socket.on('getUsers', (users) => {
  if (typeof users === 'object') {
    $('#users_ul').empty();

    users.forEach((user) => {
      Object.values(user).forEach((username) => {
        let $li = $( '<li/>', {
          href: '#',
          'class': 'list-group-item py-1',
          html: username
        });
        $('#users_ul').append($li);
      });
    });

  } else {
    $('#error').html('An error occured while updating users list.');
  }
});


socket.on('newMessage', (data) => {
  let $tr = $(document.createElement('tr'));
  $('#messages').append($tr);  

  Object.values(data).forEach((value, i) => {
    let $td = $( '<td/>', {
      id: 'td' + i,
      html: value
    });
    $tr.append($td);
  });    
  $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 1000);
});



socket.on('error', () => {
  $('#error').html('DB error occured.');
})


function changeRoom(roomID, roomName) {
  socket.emit('changeRoom', roomID, function(response) {
   if (response) {
     $('#error').html(`Welcome to room ${roomName}`);
     $('#room_display').html(roomName);
     
   } else {
    $('#error').html('An error occured while trying to connect to the room.');
   }
  });
}

function addMessage(message) {
  if (!message) {
    var message = $('#message').val();
  }
  socket.emit('addMessage', message, function (response) {
    if (response.success === false) {
      $('#error').html(response.message);
    }
  });
  $('#message').val('');
}

function addRoom() {
  const roomName = $('#create_room').val();
  socket.emit('addRoom', roomName, function (response) {
    if (response.success === true) {
      let roomID = response.room_id;
      changeRoom(roomID, roomName);

    } else {
      $('#error').html(response.message);
    }
  });
  $('#create_room').val('');
  $('#rooms_ul').animate({ scrollTop: $('#rooms_ul').prop('scrollHeight') }, 1000);
}

async function addFile() {

  var uploadedFile = $('#upload_file')[0].files[0];  
  var data = new FormData();
  data.append('uploadedFile', uploadedFile);
  try {
    var sendFiles = await fetch('/user/addFile', {
      method: 'post',
      body: data
    });

    var response = await sendFiles.json();
    if (response.isImage) {
      postImg = `<img src="data:${response.type};base64, ${response.image}" />`;
      addMessage(postImg);
    } else {
      const downloadLink = `http://localhost:3000/download/${response.generatedName}`;
      const message = `<a href=${downloadLink}>${response.filename}</a>`
      addMessage(message);
    }

  } catch(err) {
    $('#error').html(err);
  }  
}

$('#submit').click(function() { addMessage(); } );

$('#submit_file').click(function() {
  if ($('#upload_file')[0].files.length == 0) {
    alert('Please select a file');
  } else {
    addFile(); 
  }
});

$('#create_room_btn').click(function() { addRoom(); } );

$('.custom-file-input').on('change', function() { 
  let fileName = $(this).val().split('\\').pop(); 
  $(this).next('.custom-file-label').addClass("selected").html(fileName); 
});