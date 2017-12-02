let state = {
  paused: true,
  fps: 0,
  distance: 0,
  bird: {
    y: 0.5,
    vy: 0,
    flapCooldown: 0
  }
}

function reset() {
  state = {
    paused: true,
    fps: 0,
    distance: 0,
    bird: {
      y: 0.5,
      vy: 0,
      flapCooldown: 0
    }
  }
}

module.exports = {
  current: () => state,
  reset: reset
}