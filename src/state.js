let state;
let globalId = 0;

function reset() {
  state = {
    paused: true,
    fps: 0,
    gravity: 0.0008 / 1000,
    bird: {
      mass: 1,
      radius: 0.05,
      x: 0,
      y: 0.5,
      vx: 0.7 / 1000,
      vy: 0,
      flapCooldown: 0
    },
    lastGen: 0.5,
    pickups: [
      {
        id: globalId++,
        radius: 0.05,
        x: 0.5,
        y: 0.5,
      },
      {
        id: globalId++,
        radius: 0.05,
        x: 0.5,
        y: 0.2,
      }
    ]
  };
}

export default {
  current: () => state,
  newId: () => globalId++,
  reset: reset
};
