import { Renderer } from './renderer';
import { Events } from './events';

import Audio from './audio';
import Save from './save';
import State from './state';

import * as MainLoop from 'mainloop.js';
import { UI, Button, Label, Anchor } from './ui';

const ui = new UI();
const muteButton = new Button(80, 28, Anchor.topright(), -20, 20)
  .setText('Mute')
  .setTextStyle('brown', '16px \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif')
  .setButtonStyle('beige', 'burlywood', 3);
const instructionLabel = new Label(Anchor.topcenter(), 'center', 0, 30)
  .setText('Press space to flap')
  .setTextStyle('white', '3em \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif');
ui.addElement(muteButton);
ui.addElement(instructionLabel);

function lose() {
  Save.lastScore = State.current().bird.mass - 1;
  Save.bestScore = Math.max(Save.bestScore, Save.lastScore);
  State.reset();
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  let state = State.current();

  instructionLabel.enabled = state.paused;
  muteButton.strikethrough = Save.mute;

  if (!state.paused) {
    // update position
    state.bird.x += state.bird.vx * delta;
    state.bird.y += state.bird.vy * delta;
    state.bird.vy += state.gravity * state.bird.mass * delta;

    if (state.bird.y < 0 || state.bird.y > 1) {
      Audio.playCrash();
      lose();
    }

    let pickups = state.pickups;

    // collisions
    for (let pickup in pickups) {
      let xDiff = pickups[pickup].x - state.bird.x;
      let yDiff = pickups[pickup].y - state.bird.y;
      let distanceToBird = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      if (distanceToBird < state.bird.radius + pickups[pickup].radius) {
        Audio.playCoin();
        state.bird.mass += 1;
        pickups.splice(pickup, 1);
      }
    }

    // generate pickups
    if (state.lastGen < state.bird.x + 1) {
      state.lastGen += 1;

      let rand = Math.random();

      console.log('Generate ' + rand);

      if (rand < 0.4) {
        pickups.push({
          id: State.newId(),
          radius: 0.05,
          x: state.lastGen,
          y: 0.5,
        });
      }

      if (rand < 0.2) {
        pickups.push({
          id: State.newId(),
          radius: 0.05,
          x: state.lastGen,
          y: 0.2,
        });
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

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.setAttribute('width', rect.width);
    canvas.setAttribute('height', rect.height);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const ctx = canvas.getContext('2d');
  const renderer = new Renderer(ctx, ui);
  const events = new Events(canvas);
  State.reset();
  MainLoop.setUpdate(update).setDraw(renderer.draw.bind(renderer)).setEnd(end).start();
});
