var src;

// Loading socket variable
var socket = io();

// Handling login input value
$('#login form').submit(function (e) {
  e.preventDefault();

  var user = {
    username : $('#login input').val().trim(),
    gender: document.querySelectorAll('input[type="radio"]:checked').length>0? document.querySelectorAll('input[type="radio"]:checked')[0].value: null,
    x: 382,
    y: 280,
    direction: 0
  };

  if (user.username.length > 0 && user.username.length < 30) { 
    socket.emit('user-login', user, function (success) {
      if (success) {
        $('#login').remove(); // Loading
      }
      else {
        alert("This name is already taken");
      }
    });
  }
  else {
    alert("Enter a name between 0 and 30 characters");
  }
});

// Handling chat input value
$('#chat-form').submit(function (e) {
  e.preventDefault();

  var message = {
    text : $('#chat-input').val()
  };

$('#chat-input').val('');
  if (message.text.trim().length !== 0) { 
    socket.emit('chat-message', message);
  }
});

// Adding messages to the chatbox
socket.on('chat-message', function (message) {
  var date = new Date().toLocaleString();
  $('#chat-messages').append($('<li>').html('<span class="date">' + "[" + date + "] " + '</span>' + '<span class="username">' + message.username + " : " + '</span>' + message.text));
  $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight)
});

// Adding broadcast messages to the chatbox
socket.on('service-message', function (message) {
  $('#chat-messages').append($('<li class="' + message.type + '">').html('<span class="broadcast">[MINICHAT]</span> ' + message.text));
  $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight)
});

// Handling user connection (for the users list)
socket.on('user-login', function (user) {
  $('#users').append($('<li class="' + user.username + ' new">').html(user.username));
  setTimeout(function () {
    $('#users li.new').removeClass('new');
  }, 1000);
});

// Handling user disconnection (for the users list)
socket.on('user-logout', function (user) {
  var selector = '#users li.' + user.username;
  $(selector).remove();
});

