$(document).ready(function () {

  $.get('/user/register', function(res) {
    if (res.loggedIn) {
      alert('You already logged in');
      window.location.replace('/index.html');      
    }
  }, 'json');

  $('#register_btn').click(async function () {
    $.post('/user/register', {username: $('#username_register').val(), password: $('#password_register').val()})
      .done(function(data) {
        if (data.result) {
          alert(data.message);
          window.location.replace('login.html');
        } else {
          $('#error').html(data.message);
          $('#username_register').empty();
          $('#password_register').empty();
        }
      })
      .fail(function(data) {
        console.log(data.result);
        $('#error').html(data.message);
      });


  });
});


// try {
//   var userDetails = new FormData;
//   data.append()
//   var response = await fetch('user/register', {
//     method: 'post',
//     body: { username: $('#username_register').val(), password: $('#password_register').val() }
//   });
//   var data = await response.json();
//   if (data.result) {
//     alert(data.message);
//     window.location.replace('login.html');
//   } else {
//     $('#error').html(data.message);
//     $('#username_register').empty();
//     $('#password_register').empty();
//   }

// } catch(err) {
//   $('#error').html(data.message);
// }