let State = require('./state');
let MainLoop = require('mainloop.js');
let DOMHelper = require('./domhelper');
let Audio = require('./audio');

// speed in millis
let speed = 0.01 / 1000;
let gravity = 0.0008 / 1000;

function spaceDown() {
  if (State.current().bird.flapCooldown <= 0) {
    State.current().paused = false;
    Audio.playJump();
    State.current().bird.vy = -0.0006;
    State.current().bird.flapCooldown = 400;
  }
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  if (!State.current().paused) {
    State.current().distance += speed * delta;
  
    State.current().bird.y += State.current().bird.vy * delta;
    State.current().bird.vy += gravity * delta;
  
    State.current().bird.flapCooldown -= delta;

    if (State.current().bird.y < 0 || State.current().bird.y > 1) {
      State.reset();
    }
  }
}

function end(fps, panic) {
  State.current().fps = fps;
  if (panic) {
      var discardedTime = Math.round(MainLoop.resetFrameDelta());
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
}

DOMHelper.registerEvents(spaceDown);
MainLoop.setUpdate(update).setDraw(DOMHelper.draw).setEnd(end).start();
