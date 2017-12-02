let State = require('./state');
let Settings = require('./settings')();

// DOM elements
let windowElement;
let mute;
let instructions;
let fpsCounter;
let distance;
let player;

let windowRect = { width: 1, height: 1 };

function onResize() {
  windowRect = windowElement.getBoundingClientRect();
}

function positionStyle(radius, x, y, dist) {
  // calculate both x and y with windowRect.height to maintain aspect ratio
  return 'width: ' + Math.round(radius * 2 * windowRect.height) + 'px;' +
    'height: ' + Math.round(radius * 2 * windowRect.height) + 'px;' +
    'top: ' + Math.round(y * windowRect.height) + 'px;' + 
    'left: ' + Math.round((x - dist) * windowRect.height) + 'px;';
}

function rotationStyle(vy) {
  return 'transform: rotate(' + Math.max(-90, Math.min(90, Math.round(vy * 90000))) + 'deg);';
}

function playerStyle(player, dist) {
  return positionStyle(player.radius, player.x, player.y, dist) + rotationStyle(player.vy);
}

function pickupStyle(pickup, dist) {
  return positionStyle(pickup.radius, pickup.x, pickup.y, dist);
}

function draw(interpolationPercentage) {
  if (Settings.mute) {
    mute.setAttribute('style', 'text-decoration: line-through;');
  } else {
    mute.setAttribute('style', '');
  }

  if (!State.current().paused) {
    instructions.setAttribute('style', 'display: none;');
  } else {
    instructions.setAttribute('style', '');
  }

  fpsCounter.textContent = Math.round(State.current().fps) + ' FPS';
  distance.textContent = State.current().distance;

  player.setAttribute('style', playerStyle(State.current().bird, State.current().distance));

  for (let pickup of State.current().pickups) {
    let element = document.querySelector('#pickup' + pickup.id);
    let isNew = !element;

    if (isNew) {
      element = document.createElement('div');
      element.setAttribute('id', 'pickup' + pickup.id);
      element.setAttribute('class', 'pickup');
    }

    element.setAttribute('style', pickupStyle(pickup, State.current().distance));

    if (isNew) {
      windowElement.appendChild(element);
    }
  }
}

function reset() {
  let pickups = document.querySelectorAll('.pickup');
  for (let pickup of pickups) {
    pickup.remove();
  }
}

function registerEvents(spaceCallback) {
  window.addEventListener('DOMContentLoaded', () => {
    // assign all dom elements to variables
    windowElement = document.querySelector('.window');
    mute = document.querySelector('.mute');
    instructions = document.querySelector('.instructions');
    fpsCounter = document.querySelector('.fpscounter');
    distance = document.querySelector('.distance');
    player = document.querySelector('.player');

    mute.addEventListener('click', (event) => {
      Settings.mute = !Settings.mute;
    });
    
    window.addEventListener('keydown', (event) => {
      if (event.which === 32 && !event.repeat) {
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
  draw: draw,
  reset: reset
}
