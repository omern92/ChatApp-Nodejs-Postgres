$(document).ready(function () {

  $.get('/user/register', function(res) {
    if (res.loggedIn) {
      alert('You already logged in');
      window.location.replace('/index.html');      
    }
  }, 'json');

  $('#register_btn').click(function () {
      $.post('/user/register', {username: $('#username_register').val(), password: $('#password_register').val()})
        .done(function( data ) {
          if (data.result) {
            alert(data.message);
            window.location.replace('login.html');
          } else {
            alert(data.message);
            $('#username_register').empty();
            $('#password_register').empty();
          }
        })
        .fail(function() {
          alert('Error while processing your request. Please try again');
        });
  });

});
