// Loading socket variable
var socket = io();

// Loading chat container content
let form = document.getElementById("chat-form");
let messages = document.getElementById("chat-messages");
let input = document.getElementById("chat-input");
let button = document.getElementById("chat-button");

// Handling chat input value
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat-message', input.value);
    input.value = '';
  }
});

// Handling chat messages
socket.on('chat-message', function(message) {
  var item = document.createElement('li');
  item.textContent = message;
  messages.appendChild(item);
});