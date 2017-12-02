(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * mainloop.js 1.0.3-20170529
 *
 * @author Isaac Sukin (http://www.isaacsukin.com/)
 * @license MIT
 */

!function(a){function b(a){if(x=q(b),!(a<e+l)){for(d+=a-e,e=a,t(a,d),a>i+h&&(f=g*j*1e3/(a-i)+(1-g)*f,i=a,j=0),j++,k=0;d>=c;)if(u(c),d-=c,++k>=240){o=!0;break}v(d/c),w(f,o),o=!1}}var c=1e3/60,d=0,e=0,f=60,g=.9,h=1e3,i=0,j=0,k=0,l=0,m=!1,n=!1,o=!1,p="object"==typeof window?window:a,q=p.requestAnimationFrame||function(){var a=Date.now(),b,d;return function(e){return b=Date.now(),d=Math.max(0,c-(b-a)),a=b+d,setTimeout(function(){e(b+d)},d)}}(),r=p.cancelAnimationFrame||clearTimeout,s=function(){},t=s,u=s,v=s,w=s,x;a.MainLoop={getSimulationTimestep:function(){return c},setSimulationTimestep:function(a){return c=a,this},getFPS:function(){return f},getMaxAllowedFPS:function(){return 1e3/l},setMaxAllowedFPS:function(a){return"undefined"==typeof a&&(a=1/0),0===a?this.stop():l=1e3/a,this},resetFrameDelta:function(){var a=d;return d=0,a},setBegin:function(a){return t=a||t,this},setUpdate:function(a){return u=a||u,this},setDraw:function(a){return v=a||v,this},setEnd:function(a){return w=a||w,this},start:function(){return n||(n=!0,x=q(function(a){v(1),m=!0,e=a,i=a,j=0,x=q(b)})),this},stop:function(){return m=!1,n=!1,r(x),this},isRunning:function(){return m}},"function"==typeof define&&define.amd?define(a.MainLoop):"object"==typeof module&&null!==module&&"object"==typeof module.exports&&(module.exports=a.MainLoop)}(this);

},{}],2:[function(require,module,exports){
let Settings = require('./settings')();

let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

function play(audio) {
  return () => {
    if (!Settings.mute) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  }
}

module.exports = {
  playCoin: play(audioCoin),
  playCrash: play(audioCrash),
  playJump: play(audioJump),
  playPowerup: play(audioPowerup),
  playWarning: play(audioWarning)
}

},{"./settings":5}],3:[function(require,module,exports){
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
  draw: draw,
  reset: reset
}

},{"./settings":5,"./state":6}],4:[function(require,module,exports){
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
    State.current().bird.flapCooldown = 400;
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

},{"./audio":2,"./domhelper":3,"./state":6,"mainloop.js":1}],5:[function(require,module,exports){
let settings = {
    mute: false
}

module.exports = () => settings;

},{}],6:[function(require,module,exports){
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
},{}]},{},[4]);
