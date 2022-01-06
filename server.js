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

// Creating list of connected users
var users = [];

// Creating socket io event 
io.on('connection', function (socket) {

  var loggedUser;

  // Handling connection event and broadcast message
  socket.on('user-login', function (user, callback) {
    // Checking if user exists
    var userIndex = -1;
    for (i = 0; i < users.length; i++) {
      if (users[i].username === user.username) {
        userIndex = i;
      }
    }
    
    // Adding user to the list
    if (user !== undefined && userIndex === -1) { 
      
      loggedUser = user;
      users.push(loggedUser);
      
      var userServiceMessage = {
        text: "You logged in as " + loggedUser.username,
        type: 'login'
      };
      var broadcastedServiceMessage = {
        text: loggedUser.username + " is with us",
        type: 'login'
      };
      socket.emit('service-message', userServiceMessage);
      socket.broadcast.emit('service-message', broadcastedServiceMessage);
      // Emission de 'user-login' et appel du callback
      io.emit('user-login', loggedUser);
      callback(true);
    } else {
      callback(false);
    }
  });

  // Handling disconnection event and broadcast message
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {

      // Announcement message
      var serviceMessage = {
        text: loggedUser.username + " left us",
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);

      // Deleting disconnected users
      var userIndex = users.indexOf(loggedUser);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
      }
      // Sending user-logout with disconnected user
      io.emit('user-logout', loggedUser);
    }
  });

  // Sending message to all users
  socket.on('chat-message', function (message) {
    message.username = loggedUser.username;
    io.emit('chat-message', message);
  });

  // Sending users list to everyone
  for (i = 0; i < users.length; i++) {
    socket.emit('user-login', users[i]);
  }
});