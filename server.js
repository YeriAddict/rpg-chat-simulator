// Creating dependencies
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// Initializing app
const app = express()
const server = http.Server(app)
const io = socketIO(server)

// Handling HTTP requests
app.use("/", express.static(__dirname + "/"));
app.use("/", express.static(__dirname + "/client"));

// Launching server on port 3000
server.listen(3000, function(){
  console.log('Server is listening on *:3000');
});

// Creating socket io event 
io.on('connection', function (socket) {

  var loggedUser;

  // Handling connection event and broadcast message
  socket.on('user-login', function (user) {
    loggedUser = user;
    if (loggedUser !== undefined) {
      var serviceMessage = {
        text: loggedUser.username + " is with us",
        type: 'login'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

// Handling disconnection event and broadcast message
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: loggedUser.username + " left us",
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  // Sending message to all users
  socket.on('chat-message', function (message) {
    message.username = loggedUser.username;
    io.emit('chat-message', message);
  });
});