$(document).ready(function () {

  $.get('/user/login', function(res) {
    if (res.loggedIn) {
      alert('You already logged in');
      window.location.replace('/index.html');      
    }
  }, 'json');

  $('#login_btn').click(function() {
    username = $('#username_login').val();
    password = $('#password_login').val();
    if (validateUsername(username) && validatePass(password)) {
      $.post('/user/login', { username: username, password: password })
      .done(function(data) {
        if (data.result) {
          alert(data.message);
          window.location.replace('/index.html');
        } else {
          $('#error').html(data.message);
        }
      })
      .fail(function() {
        $('#error').html('An Error occured while processing your request. Please try again.');
      });
    }
    else if (!validateUsername(username)) {
      $('#error').html('Username can include only a-z, A-Z and numbers. Min of 3 characters.');
    }
    else {
      $('#error').html('Invalid password. Min length is 3.');
    }
  });

});



function validateUsername (username) {
  if (username.length < 3 || !username.toString().match(/^[a-zA-Z0-9]+$/)) {
    return false;
  } 
  else return true;
}

function validatePass (password) {
  if (password.length < 3) return false;
  else return true;
}