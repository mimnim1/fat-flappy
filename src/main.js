let MainLoop = require('mainloop.js')
// audio
let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

// DOM elements
let fpsCounter;
let distanceElement;
let playerElement;

// variables
let currentFps = 0.0;

let distance = 0.0;
// speed in millis
let speed = 1 / 1000;
let gravity = 0.8 / 1000;

let playerY = 0.0;
let playerVY = 0.0;
let flapCooldown = 0.0;

function spaceDown() {
  if (flapCooldown <= 0) {
    // replay the audio
    audioJump.pause();
    audioJump.currentTime = 0;
    audioJump.play();

    // update speed
    playerVY = -0.6;

    // set cooldown in millis
    flapCooldown = 400;
  }
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  distance += speed * delta;

  playerY += playerVY * delta;
  playerVY += gravity * delta;

  flapCooldown -= delta;
}

/**
* @param {Number} interpolationPercentage
*   How much to interpolate between frames.
*/
function draw(interpolationPercentage) {
  fpsCounter.textContent = Math.round(currentFps) + ' FPS';
  distanceElement.textContent = distance;

  playerElement.setAttribute('style', 'top: ' + Math.round(playerY) + 'px; left: 40px;');
}

/**
* @param {Number} fps
*   The smoothed frames per second.
* @param {Boolean} panic
*   Whether the main loop panicked because the simulation fell too far behind
*   real time.
*/
function end(fps, panic) {
  currentFps = fps;
  if (panic) {
      // This pattern introduces non-deterministic behavior, but in this case
      // it's better than the alternative (the application would look like it
      // was running very quickly until the simulation caught up to real
      // time). See the documentation for `MainLoop.setEnd()` for additional
      // explanation.
      var discardedTime = Math.round(MainLoop.resetFrameDelta());
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fpsCounter = document.querySelector('.fpscounter');
  distanceElement = document.querySelector('.distance');
  playerElement = document.querySelector('.player');

  window.addEventListener('keydown', (event) => {
    switch (event.which) {
      case 32:
        spaceDown();
        break;
    }
  });

  MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
});
