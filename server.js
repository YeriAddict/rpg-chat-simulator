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
io.on('connection', function(socket){
  
  var loggedUser;

  // Handling user connection
  socket.on('login-user', function (loggedUser) {
    console.log(loggedUser.username + " is with us");
    user = loggedUser;
  });
  
  socket.on('disconnect', function(){
    console.log('User left us');
  });

  // Handling 'chat message' event 
  socket.on('chat-message', function (message) {
    message.username = user.username;
    io.emit('chat-message', message);
    console.log('Message de : ' + user.username);
  });
});