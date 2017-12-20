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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const save = {
  mute: false,
  bestScore: 0,
  lastScore: 0,
};

const storage = window.localStorage;
const prefix = 'FatFlappy';

// Load the save
(function() {
  // check each key seperately for undefined in case of previous storage
  for (const key in save) {
    const loadedVal = storage.getItem(prefix + key);

    if (loadedVal !== null) {
      save[key] = JSON.parse(loadedVal);
    }
  }
})();

// Save function
function saveToStore(key) {
  const valToSave = save[key];

  storage.setItem(prefix + key, JSON.stringify(valToSave));
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

/* harmony default export */ __webpack_exports__["a"] = (api);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = ({
  current: () => state,
  newId: () => globalId++,
  reset: reset
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__save__ = __webpack_require__(0);


let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
audioJump.volume = 0.6;
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

function play(audio) {
  return () => {
    if (!__WEBPACK_IMPORTED_MODULE_0__save__["a" /* default */].mute) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  };
}

/* harmony default export */ __webpack_exports__["a"] = ({
  playCoin: play(audioCoin),
  playCrash: play(audioCrash),
  playJump: play(audioJump),
  playPowerup: play(audioPowerup),
  playWarning: play(audioWarning)
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__audio__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__save__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mainloop_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mainloop_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_mainloop_js__);









function lose() {
  __WEBPACK_IMPORTED_MODULE_3__save__["a" /* default */].lastScore = __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].current().bird.mass - 1;
  __WEBPACK_IMPORTED_MODULE_3__save__["a" /* default */].bestScore = Math.max(__WEBPACK_IMPORTED_MODULE_3__save__["a" /* default */].bestScore, __WEBPACK_IMPORTED_MODULE_3__save__["a" /* default */].lastScore);
  __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].reset();
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  let state = __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].current();

  if (!state.paused) {
    // update position
    state.bird.x += state.bird.vx * delta;
    state.bird.y += state.bird.vy * delta;
    state.bird.vy += state.gravity * state.bird.mass * delta;

    if (state.bird.y < 0 || state.bird.y > 1) {
      __WEBPACK_IMPORTED_MODULE_2__audio__["a" /* default */].playCrash();
      lose();
    }

    let pickups = state.pickups;

    // collisions
    for (let pickup in pickups) {
      let xDiff = pickups[pickup].x - state.bird.x;
      let yDiff = pickups[pickup].y - state.bird.y;
      let distanceToBird = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      if (distanceToBird < state.bird.radius + pickups[pickup].radius) {
        __WEBPACK_IMPORTED_MODULE_2__audio__["a" /* default */].playCoin();
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
          id: __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].newId(),
          radius: 0.05,
          x: state.lastGen,
          y: 0.5,
        });
      }

      if (rand < 0.2) {
        pickups.push({
          id: __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].newId(),
          radius: 0.05,
          x: state.lastGen,
          y: 0.2,
        });
      }
    }

    // other logic
    __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].current().bird.flapCooldown -= delta;
  }
}

function end(fps, panic) {
  __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].current().fps = fps;
  if (panic) {
    var discardedTime = Math.round(__WEBPACK_IMPORTED_MODULE_5_mainloop_js__["resetFrameDelta"]());
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
  const renderer = new __WEBPACK_IMPORTED_MODULE_0__renderer__["a" /* Renderer */](ctx);
  const events = new __WEBPACK_IMPORTED_MODULE_1__events__["a" /* Events */](canvas);
  __WEBPACK_IMPORTED_MODULE_4__state__["a" /* default */].reset();
  __WEBPACK_IMPORTED_MODULE_5_mainloop_js__["setUpdate"](update).setDraw(renderer.draw.bind(renderer)).setEnd(end).start();
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderers_instructions__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__renderers_mute_button__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__renderers_entity__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__renderers_background__ = __webpack_require__(8);






class RenderingContext {

  constructor(ctx, interpolation, width, height) {
    this.ctx = ctx;
    this.interpolation = interpolation;
    this.width = width;
    this.height = height;
    this.scale = height;
    this.debug = true;
  }
}
/* unused harmony export RenderingContext */


class Renderer {

  constructor(ctx) {
    this.ctx = ctx;
    this.backgroundRenderer = new __WEBPACK_IMPORTED_MODULE_4__renderers_background__["a" /* BackgroundRenderer */]();
    this.instructionsRenderer = new __WEBPACK_IMPORTED_MODULE_0__renderers_instructions__["a" /* InstructionsRenderer */]();
    this.muteButtonRenderer = new __WEBPACK_IMPORTED_MODULE_1__renderers_mute_button__["a" /* MuteButtonRenderer */]();
    this.entityRenderer = new __WEBPACK_IMPORTED_MODULE_2__renderers_entity__["a" /* EntityRenderer */]();

    this.birdImage = new Image();
    this.birdImage.src = './assets/bird.png';
    this.cookieImage = new Image();
    this.cookieImage.src = './assets/cookie.png';
  }

  draw(interpolation) {
    const state = __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current();
    const renderingContext = new RenderingContext(this.ctx, interpolation, this.ctx.canvas.width, this.ctx.canvas.height);

    // Restore transforms
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.backgroundRenderer.draw(renderingContext);

    // ####
    // CAMERA TRANSLATE
    // ####
    this.ctx.save();
    this.ctx.translate(-(state.bird.x - 0.1) * renderingContext.scale, 0);
    
    this.entityRenderer.draw(renderingContext,
      this.birdImage,
      state.bird.x,
      state.bird.y,
      state.bird.radius,
      Math.max(-90, Math.min(90, Math.round(state.bird.vy * 90000))));
  
    // fpsCounter.textContent = Math.round(State.current().fps) + ' FPS';
    // distance.textContent = screenX();
  
    for (let pickup of state.pickups) {
      this.entityRenderer.draw(renderingContext,
        this.cookieImage,
        pickup.x,
        pickup.y,
        pickup.radius);
    }

    this.ctx.restore();
    // ####
    // END CAMERA TRANSLATE
    // ####

    this.muteButtonRenderer.draw(renderingContext);

    if (state.paused) {
      this.instructionsRenderer.draw(renderingContext);
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class InstructionsRenderer {
  constructor() {}

  draw(ctx) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = 'white';
    ctx.ctx.font = '3em \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif';
    ctx.ctx.textAlign = 'center';

    ctx.ctx.fillText('Press space to flap', ctx.width / 2, ctx.height * 0.1);

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = InstructionsRenderer;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__save__ = __webpack_require__(0);


class MuteButtonRenderer {

  constructor() {
    this.text = 'Mute';
  }

  getBoxPath(ctx, screenMargin, boxPadding, textWidth) {
    const path = new Path2D();
    const boxHeight = 16;

    path.rect(ctx.width - screenMargin + boxPadding, screenMargin - boxPadding, -textWidth - boxPadding * 2, boxHeight + boxPadding * 2);

    return path;
  }

  getStrikePath(ctx, screenMargin, textWidth) {
    const path = new Path2D();

    path.moveTo(ctx.width - screenMargin, screenMargin + 12);
    path.lineTo(ctx.width - screenMargin - textWidth, screenMargin + 12);

    return path;
  }

  setTextStyle(ctx) {
    ctx.ctx.fillStyle = 'brown';
    ctx.ctx.font = '16px \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif';
    ctx.ctx.textAlign = 'right';
    ctx.ctx.textBaseline = 'top';
  }

  setBoxStyle(ctx) {
    ctx.ctx.fillStyle = 'beige';
    ctx.ctx.strokeStyle = 'burlywood';
    ctx.ctx.lineWidth = 3;
  }

  draw(ctx) {
    ctx.ctx.save();
    
    const screenMargin = ctx.scale * 0.05;
    const boxPadding = ctx.scale * 0.01;

    this.setTextStyle(ctx);
    const textWidth = ctx.ctx.measureText(this.text).width;

    const path = this.getBoxPath(ctx, screenMargin, boxPadding, textWidth);

    this.setBoxStyle(ctx);
    ctx.ctx.fill(path);
    ctx.ctx.stroke(path);

    this.setTextStyle(ctx);
    ctx.ctx.fillText(this.text, ctx.width - screenMargin, screenMargin);

    // Strikethrough text if muted
    if (__WEBPACK_IMPORTED_MODULE_0__save__["a" /* default */].mute) {
      this.setBoxStyle(ctx);
      const strokePath = this.getStrikePath(ctx, screenMargin, textWidth);
      ctx.ctx.stroke(strokePath);
    }

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MuteButtonRenderer;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EntityRenderer {

  constructor() {}

  draw(ctx, image, x, y, radius, rotation = undefined) {
    ctx.ctx.save();

    ctx.ctx.translate(x * ctx.scale, y * ctx.scale);
    
    if (rotation !== undefined) {
      ctx.ctx.rotate(rotation * Math.PI / 180);
    }

    ctx.ctx.drawImage(image, -ctx.scale * radius, -ctx.scale * radius, ctx.scale * radius * 2, ctx.scale * radius * 2);

    if (ctx.debug) {
      ctx.ctx.strokeStyle = 'black';
      ctx.ctx.beginPath();
      ctx.ctx.arc(0, 0, ctx.scale * radius, 0, 2 * Math.PI);
      ctx.ctx.stroke();
    }

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EntityRenderer;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class BackgroundRenderer {
  constructor() {}
  
  draw(ctx) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = 'skyblue';
    ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BackgroundRenderer;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__audio__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(1);



function jump() {
  if (__WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */].current().bird.flapCooldown <= 0) {
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */].current().paused = false;
    __WEBPACK_IMPORTED_MODULE_0__audio__["a" /* default */].playJump();
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */].current().bird.vy = -0.0006;
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */].current().bird.flapCooldown = 10;
  }
}

class EventListener {

  constructor(parent, event) {
    this.parent = parent;
    this.event = event;

    this.callbacks = [];
  }

  trigger(event, ...args) {
    for (const callback of this.callbacks) {
      callback.apply(callback, args);
    }
  }

  then(callback) {
    this.callbacks.push(callback);
    return this;
  }

  unregister() {
    parent.unregister();
  }
}
/* unused harmony export EventListener */


class MouseListener extends EventListener {

  constructor(parent, event, path) {
    super(parent, event);
    this.path = path;
  }

  trigger(event, ...args) {
    switch (event) {
    case 'click':
      break;
    default:
      return;
    }

    super.trigger(event, ...args);
  }
}
/* unused harmony export MouseListener */


class Events {

  constructor(canvas) {
    this.listeners = [];
    this.canvas = canvas;

    canvas.addEventListener('click', (event) => {
      this.mouseHappened(event);
    });

    // mute.addEventListener('click', (event) => {
    //   Settings.mute = !Settings.mute;
    // });
    
    window.addEventListener('keydown', (event) => {
      if (event.which === 32 && !event.repeat) {
        jump();
      }
    });
  
    window.addEventListener('mousedown', (event) => {
      if (event.button === 0 && !event.repeat) {
        jump();
      }
    });
  }

  addListener(path) {
    const clickRegion = new MouseListener(this, event, path);
    this.listeners.push(clickRegion);
    return clickRegion;
  }

  mouseHappened(event) {
    this.listeners.forEach(listener => {
      // TODO give mouse position to listener
      listener.trigger('mouse', event.x);
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Events;



/***/ }),
/* 10 */
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

/***/ })
/******/ ]);