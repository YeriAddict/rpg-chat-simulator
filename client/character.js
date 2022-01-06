// Loading socket variable
var socket = io();

// Loading Canvas and images
let canvas = document.getElementById("canvas-map");
let context = canvas.getContext("2d");
let img_map = document.getElementById("map");
let img_boy = document.getElementById("boy");
let img_girl = document.getElementById("girl");

// Variables handling sprite sheets (which never change)
const S_WIDTH = 31;
const S_HEIGHT = 32;
const D_WIDTH = 32;
const D_HEIGHT = 36;
const STATE = 32; // Describes in which direction the character is looking

// Variables handling movements and positions
let currentDirection = 0;
let positionX = 382;
let positionY = 280;
let keyPresses = {};

let movement = {
  up: false,
  down: false,
  left: false,
  right: false,
};

// Function allowing to draw the characters with the only changing values
function drawCharacter(img, sx, sy, dx, dy, color) {
  context.font = "16px Arial sans-serif";
  context.fillStyle = color;
  context.textAlign = "center";
  context.drawImage(img, sx, sy, S_WIDTH, S_HEIGHT, dx, dy, D_WIDTH, D_HEIGHT);
}

// Handling keyboard buttons
document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 90: // Z
      movement.up = true;
      break;
    case 81: // Q
      movement.left = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 90: // Z
      movement.up = false;
      break;
    case 81: // Q
      movement.left = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

// Prevents user from typing while moving and vice versa
window.addEventListener(
  "keydown",
  function (e) {
    if ([68, 81, 83, 90].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);

$(function () {
  $("textarea, input").keydown(function (e) {
    e.stopPropagation();
  });
});

socket.emit("new player");
setInterval(function () {
  socket.emit("movement", movement);
}, 1000 / 60);

// Drawing characters for each user
socket.on("state", function (users) {
  context.drawImage(img_map, 0, 0, 800, 600);
  for (var id in users) {
    var player = users[id];
    if (player.gender == "Boy") {
      drawCharacter(
        img_boy,
        0,
        STATE * player.direction,
        player.x,
        player.y,
        player.color
      );
      context.fillText(player.username, player.x + 14, player.y);
    } else {
      drawCharacter(
        img_girl,
        0,
        STATE * player.direction,
        player.x,
        player.y,
        player.color
      );
      context.fillText(player.username, player.x + 14, player.y);
    }
  }
});

// Storing key presses
window.addEventListener("keydown", keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}
window.addEventListener("keyup", keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

// Loading map canva
window.onload = function () {
  context.drawImage(img_map, 0, 0, 800, 600);
};
