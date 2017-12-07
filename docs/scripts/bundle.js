/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

module.exports = {
  current: () => state,
  newId: () => globalId++,
  reset: reset
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

let settings = {
  mute: false
};

module.exports = () => settings;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

let State = __webpack_require__(0);
let Save = __webpack_require__(3);
let MainLoop = __webpack_require__(4);
let DOMHelper = __webpack_require__(5);
let Audio = __webpack_require__(6);

function spaceDown() {
  if (State.current().bird.flapCooldown <= 0) {
    State.current().paused = false;
    Audio.playJump();
    State.current().bird.vy = -0.0006;
    State.current().bird.flapCooldown = 10;
  }
}

function lose() {
  Save.lastScore = State.current().bird.mass - 1;
  Save.bestScore = Math.max(Save.bestScore, Save.lastScore);
  State.reset();
  DOMHelper.reset();
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  let state = State.current();

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
        DOMHelper.reset();
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

State.reset();
DOMHelper.registerEvents(spaceDown);
MainLoop.setUpdate(update).setDraw(DOMHelper.draw).setEnd(end).start();


/***/ }),
/* 3 */
/***/ (function(module, exports) {

const save = {
  bestScore: 0,
  lastScore: 0,
};

const storage = window.localStorage;

// Load the save
(function() {
  // check each key seperately for undefined in case of previous storage
  for (const key in save) {
    const loadedVal = storage.getItem(key);

    if (!loadedVal === null) {
      save[key] = JSON.parse(loadedVal);
    }
  }
})();

// Save function
function saveToStore(key) {
  const valToSave = save[key];

  storage.setItem(key, JSON.stringify(valToSave));
}

// Define the exports
const api = {};

for (const key in save) {
  Object.defineProperty(api, key, {
    get: () => save[key],
    set: (value) => {
      save[key] = value;
      saveToStore(key);
    }
  });
}

module.exports = api;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * mainloop.js 1.0.3-20170529
 *
 * @author Isaac Sukin (http://www.isaacsukin.com/)
 * @license MIT
 */

!function(a){function b(a){if(x=q(b),!(a<e+l)){for(d+=a-e,e=a,t(a,d),a>i+h&&(f=g*j*1e3/(a-i)+(1-g)*f,i=a,j=0),j++,k=0;d>=c;)if(u(c),d-=c,++k>=240){o=!0;break}v(d/c),w(f,o),o=!1}}var c=1e3/60,d=0,e=0,f=60,g=.9,h=1e3,i=0,j=0,k=0,l=0,m=!1,n=!1,o=!1,p="object"==typeof window?window:a,q=p.requestAnimationFrame||function(){var a=Date.now(),b,d;return function(e){return b=Date.now(),d=Math.max(0,c-(b-a)),a=b+d,setTimeout(function(){e(b+d)},d)}}(),r=p.cancelAnimationFrame||clearTimeout,s=function(){},t=s,u=s,v=s,w=s,x;a.MainLoop={getSimulationTimestep:function(){return c},setSimulationTimestep:function(a){return c=a,this},getFPS:function(){return f},getMaxAllowedFPS:function(){return 1e3/l},setMaxAllowedFPS:function(a){return"undefined"==typeof a&&(a=1/0),0===a?this.stop():l=1e3/a,this},resetFrameDelta:function(){var a=d;return d=0,a},setBegin:function(a){return t=a||t,this},setUpdate:function(a){return u=a||u,this},setDraw:function(a){return v=a||v,this},setEnd:function(a){return w=a||w,this},start:function(){return n||(n=!0,x=q(function(a){v(1),m=!0,e=a,i=a,j=0,x=q(b)})),this},stop:function(){return m=!1,n=!1,r(x),this},isRunning:function(){return m}}, true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (a.MainLoop),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof module&&null!==module&&"object"==typeof module.exports&&(module.exports=a.MainLoop)}(this);
//# sourceMappingURL=mainloop.min.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

let State = __webpack_require__(0);
let Settings = __webpack_require__(1)();

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

function screenX() {
  return State.current().bird.x - 0.1;
}

function positionStyle(radius, x, y) {
  // calculate both x and y with windowRect.height to maintain aspect ratio
  return 'width: ' + Math.round(radius * 2 * windowRect.height) + 'px;' +
    'height: ' + Math.round(radius * 2 * windowRect.height) + 'px;' +
    'top: ' + Math.round(y * windowRect.height) + 'px;' + 
    'left: ' + Math.round((x - screenX()) * windowRect.height) + 'px;';
}

function rotationStyle(vy) {
  return 'transform: rotate(' + Math.max(-90, Math.min(90, Math.round(vy * 90000))) + 'deg);';
}

function playerStyle(player) {
  return positionStyle(player.radius, player.x, player.y) + rotationStyle(player.vy);
}

function pickupStyle(pickup) {
  return positionStyle(pickup.radius, pickup.x, pickup.y);
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
  distance.textContent = screenX();

  player.setAttribute('style', playerStyle(State.current().bird));

  for (let pickup of State.current().pickups) {
    let element = document.querySelector('#pickup' + pickup.id);
    let isNew = !element;

    if (isNew) {
      element = document.createElement('div');
      element.setAttribute('id', 'pickup' + pickup.id);
      element.setAttribute('class', 'pickup');
    }

    element.setAttribute('style', pickupStyle(pickup));

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

    window.addEventListener('mousedown', (event) => {
      if (event.button === 0 && !event.repeat) {
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
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

let Settings = __webpack_require__(1)();

let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
audioJump.volume = 0.6;
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

function play(audio) {
  return () => {
    if (!Settings.mute) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  };
}

module.exports = {
  playCoin: play(audioCoin),
  playCrash: play(audioCrash),
  playJump: play(audioJump),
  playPowerup: play(audioPowerup),
  playWarning: play(audioWarning)
};


/***/ })
/******/ ]);