// Loading socket variable
var socket = io();

// Loading login container content 
let login_form = document.getElementById("login-form");
let login_input = document.getElementById("login-input");

// Loading chat container content
let chat_form = document.getElementById("chat-form");
let chat_messages = document.getElementById("chat-messages");
let chat_input = document.getElementById("chat-input");

// Handling login input value
login_form.addEventListener('submit', function(e) {
  e.preventDefault();

  var user = {
    username: login_input.value
  }

  if (user.username && user.username.length < 30) {
      socket.emit('login-user', user);
      document.getElementById("login-overlay").remove();
  }
    else {
      alert("Enter a name between 0 and 30 characters");
  }
});

// Handling chat input value
chat_form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (chat_input.value) {
    socket.emit('chat-message', chat_input.value);
    chat_input.value = '';
  }
});

// Recieving chat messages
socket.on('chat-message', function(message) {
  var item = document.createElement('li');
  item.textContent = message;
  chat_messages.appendChild(item);
});