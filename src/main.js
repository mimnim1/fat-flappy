let State = require('./state');
let MainLoop = require('mainloop.js');
let DOMHelper = require('./domhelper');
let Audio = require('./audio');

// speed in millis
let gravity = 0.0008 / 1000;

function spaceDown() {
  if (State.current().bird.flapCooldown <= 0) {
    State.current().paused = false;
    Audio.playJump();
    State.current().bird.vy = -0.0006;
    State.current().bird.flapCooldown = 200;
  }
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  let state = State.current();

  if (!state.paused) {
    // update position
    state.bird.vx = state.speed;

    state.distance += state.speed * delta;

    state.bird.x += state.bird.vx * delta;
    state.bird.y += state.bird.vy * delta;
    state.bird.vy += gravity * delta;

    if (state.bird.y < 0 || state.bird.y > 1) {
      Audio.playCrash();
      State.reset();
      DOMHelper.reset();
    }

    let pickups = state.pickups;

    // collisions
    for (let pickup in pickups) {
      let xDiff = pickups[pickup].x - state.bird.x;
      let yDiff = pickups[pickup].y - state.bird.y;
      let distanceToBird = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      if (distanceToBird < state.bird.radius + pickups[pickup].radius) {
        Audio.playCoin();
        pickups.splice(pickup);
        DOMHelper.reset();
      }
    }

    // other logic
    State.current().bird.flapCooldown -= delta;
  }
}

function end(fps, panic) {
  State.current().fps = fps;
  if (panic) {
      var discardedTime = Math.round(MainLoop.resetFrameDelta());
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
}

State.reset();
DOMHelper.registerEvents(spaceDown);
MainLoop.setUpdate(update).setDraw(DOMHelper.draw).setEnd(end).start();
