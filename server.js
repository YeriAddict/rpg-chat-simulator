// Creating dependencies
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// Initializing app
const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use("/", express.static(__dirname + "/"));
app.use("/", express.static(__dirname + "/client"));

server.listen(3000, function(){
  console.log('Server is listening on *:3000');
});

// Creating socket io event 
io.on('connection', function(socket){
  console.log('User is with us');
  
  socket.on('disconnect', function(){
    console.log('User left us');
  });

  socket.on('chat-message', (message) => {
    io.emit('chat-message', message);
  });
});