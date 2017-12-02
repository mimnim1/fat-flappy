let State = require('./state');

// DOM elements
let windowElement;
let instructions;
let fpsCounter;
let distance;
let player;

let windowRect = { width: 1, height: 1 };

function onResize() {
  windowRect = windowElement.getBoundingClientRect();
}

function draw(interpolationPercentage) {
  if (!State.current().paused) {
    instructions.setAttribute('style', 'display: none;');
  } else {
    instructions.setAttribute('style', '');
  }

  fpsCounter.textContent = Math.round(State.current().fps) + ' FPS';
  distance.textContent = State.current().distance;

  player.setAttribute('style', 'top: ' + Math.round(State.current().bird.y * windowRect.height) + 'px; left: 40px;' +
    'transform: rotate(' + Math.max(-90, Math.min(90, Math.round(State.current().bird.vy * 90000))) + 'deg);');
}

function registerEvents(spaceCallback) {
  window.addEventListener('DOMContentLoaded', () => {
    // assign all dom elements to variables
    windowElement = document.querySelector('.window');
    instructions = document.querySelector('.instructions');
    fpsCounter = document.querySelector('.fpscounter');
    distance = document.querySelector('.distance');
    player = document.querySelector('.player');
    
    window.addEventListener('keydown', (event) => {
      if (event.which === 32) {
        spaceCallback();
      }
    });
    
    // resize on load
    onResize();
    window.addEventListener('resize', onResize);
  });
}

module.exports = {
  registerEvents: registerEvents,
  draw: draw
}
