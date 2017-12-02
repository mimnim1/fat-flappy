let state;
let globalId = 0;

function reset() {
  state = {
    paused: true,
    fps: 0,
    speed: 0.2 / 1000,
    distance: 0,
    bird: {
      radius: 0.05,
      x: 0.1,
      y: 0.5,
      vy: 0,
      flapCooldown: 0
    },
    pickups: [
      {
        id: globalId++,
        radius: 0.05,
        x: 0.5,
        y: 0.5,
      }
    ]
  }
}

module.exports = {
  current: () => state,
  reset: reset
}