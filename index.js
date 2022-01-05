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
const MOVEMENT_SPEED = 1;
const FACING_DOWN = 0;
const FACING_LEFT = 1;
const FACING_RIGHT = 2;
const FACING_UP = 3;
let currentDirection = 0;
let positionX = 0;
let positionY = 0;
let keyPresses = {};

// Storing key presses 
window.addEventListener('keydown', keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}
window.addEventListener('keyup', keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

// Function allowing to draw the characters with the only changing values 
function drawCharacter(img, sx, sy, dx, dy) {
  context.drawImage(img_map, 0, 0, 800, 600);
  context.drawImage(img, sx, sy, S_WIDTH, S_HEIGHT, dx, dy, D_WIDTH, D_HEIGHT);
}

// Function allowing to move the characters
function moveCharacter(deltaX, deltaY, direction) {
  if (positionX + deltaX > 0 && positionX + D_WIDTH + deltaX < canvas.width) {
    positionX += deltaX;
  }
  if (positionY + deltaY > 0 && positionY + D_HEIGHT + deltaY < canvas.height) {
    positionY += deltaY;
  }
  currentDirection = direction;
}

// Function allowing loops
function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (keyPresses.z) {
    moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
  } else if (keyPresses.s) {
    moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
  }
  
  if (keyPresses.q) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
  } else if (keyPresses.d) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
  }

  drawCharacter(img_boy, 0, STATE * currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

// Loading
window.onload = function() {
  gameLoop();
}