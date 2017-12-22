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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class UIElement {

  constructor(anchor, offsetX, offsetY) {
    if (this.constructor instanceof UIElement) {
      throw 'UIElement is abstract';
    }

    this.anchor = anchor;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    return this;
  }

  enable() {
    this.enabled = true;
    return this;
  }

  handleEvent() {
    return false;
  }
}
/* unused harmony export UIElement */


class Anchor {

  constructor() {
    throw 'Anchor cannot be initialized';
  }

  static topleft() { return 'topleft'; }
  static topcenter() { return 'topcenter'; }
  static topright() { return 'topright'; }
  static centerleft() { return 'centerleft'; }
  static center() { return 'center'; }
  static centerright() { return 'centerright'; }
  static bottomleft() { return 'bottomleft'; }
  static bottomcenter() { return 'bottomcenter'; }
  static bottomright() { return 'bottomright'; }

  static x(anchor, w) {
    if (anchor.endsWith('left')) {
      return 0;
    } else if (anchor.endsWith('right')) {
      return w;
    } else if (anchor.endsWith('center')) {
      return w/2;
    } else {
      throw 'Invalid anchor';
    }
  }

  static y(anchor, h) {
    if (anchor.startsWith('top')) {
      return 0;
    } else if (anchor.startsWith('bottom')) {
      return h;
    } else if (anchor.startsWith('center')) {
      return h/2;
    } else {
      throw 'Invalid anchor';
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Anchor;


class Label extends UIElement {

  constructor(anchor, textAlign, offsetX, offsetY) {
    super(anchor, offsetX, offsetY);

    this.textAlign = textAlign;
    this.text = '';
    this.textFill = 'white';
    this.strikethrough = false;
  }

  setText(txt) {
    this.text = txt;
    return this;
  }

  setTextStyle(fill, font) {
    this.textFill = fill;
    this.font = font;
    return this;
  }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Label;


class Button extends Label {

  constructor(width, height, anchor, offsetX, offsetY) {
    super(anchor, 'center', offsetX, offsetY);

    this.width = width;
    this.height = height;

    this.fill = 'white';
    this.border = 'white';
    this.borderWidth = 0;

    this.clickListeners = [];
  }

  setButtonStyle(fill, border, borderWidth) {
    this.fill = fill;
    this.border = border;
    this.borderWidth = borderWidth;
    return this;
  }

  path(width, height) {
    const path = new Path2D();

    let x = Anchor.x(this.anchor, width) + this.offsetX;
    if (this.anchor.endsWith('right')) {
      x -= this.width;
    } else if (this.anchor.endsWith('center')) {
      x -= this.width / 2;
    }

    let y = Anchor.y(this.anchor, height) + this.offsetY;
    if (this.anchor.startsWith('bottom')) {
      y -= this.height;
    } else if (this.anchor.startsWith('center')) {
      y -= this.height / 2;
    }

    path.rect(x, y, this.width, this.height);

    return path;
  }

  textOffsetX() {
    let x = this.offsetX;

    if (this.anchor.endsWith('right')) {
      x -= this.width / 2;
    } else if (this.anchor.endsWith('left')) {
      x += this.width / 2;
    }

    return x;
  }

  textOffsetY() {
    let y = this.offsetY;

    if (this.anchor.startsWith('bottom')) {
      y -= this.height / 2;
    } else if (this.anchor.startsWith('top')) {
      y += this.height / 2;
    }

    return y;
  }

  addClickListener(listener) {
    this.clickListeners.push(listener);
    return this;
  }

  handleEvent(event, context) {
    if (event instanceof MouseEvent && event.target instanceof HTMLCanvasElement) {
      const canvas = event.target;
      const path = this.path(canvas.width, canvas.height);
      if (context.isPointInPath(path, event.x, event.y)) {
        if (event.type === 'click') {
          for (const listener of this.clickListeners) {
            listener(event);
          }
        }

        return true;
      }
    }

    return false;
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Button;


class UI {

  constructor() {
    this.elements = [];
    this.listeners = {};
  }

  addElement(el) {
    if (el instanceof UIElement) {
      this.elements.push(el);
    } else {
      throw 'Attempt to add non ui element to ui';
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);

    return this;
  }

  eventHappened(event, context) {
    let eventHandled = false;
    for (const el of this.elements) {
      if (el.handleEvent(event, context)) {
        eventHandled = true;
        break;
      }
    }

    if (!eventHandled && this.listeners.hasOwnProperty(event.type)) {
      for (const listener of this.listeners[event.type]) {
        if (listener(event)) {
          eventHandled = true;
          break;
        }
      }
    }
  }

  addCanvasEvents(canvas) {
    const context = canvas.getContext('2d');

    canvas.addEventListener('click', (event) => {
      if (event.target === canvas) {
        this.eventHappened(event, context);
      }
    });

    canvas.addEventListener('mousedown', (event) => {
      if (event.target === canvas) {
        this.eventHappened(event, context);
      }
    });

    window.addEventListener('keydown', (event) => {
      this.eventHappened(event, context);
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = UI;



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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui__ = __webpack_require__(0);


class UiLabelRenderer {
  constructor() {}

  getStrikePath(ctx, label, textWidth) {
    const path = new Path2D();

    const Y = __WEBPACK_IMPORTED_MODULE_0__ui__["a" /* Anchor */].y(label.anchor, ctx.height) + label.offsetY;
    let startX = __WEBPACK_IMPORTED_MODULE_0__ui__["a" /* Anchor */].x(label.anchor, ctx.width) + label.offsetX;
    let endX = startX + textWidth;

    switch (label.textAlign) {
    case 'center':
      startX = startX - (textWidth / 2);
      endX = startX + textWidth;
      break;
    case 'right':
      endX = startX - textWidth;
      break;
    }

    path.moveTo(startX, Y);
    path.lineTo(endX, Y);

    return path;
  }

  setTextStyle(ctx, label) {
    ctx.ctx.fillStyle = label.textFill;
    ctx.ctx.font = label.font;
    ctx.ctx.textAlign = label.textAlign;
    ctx.ctx.textBaseline = 'middle';
  }

  draw(ctx, label) {
    ctx.ctx.save();

    this.setTextStyle(ctx, label);
    ctx.ctx.fillText(label.text, __WEBPACK_IMPORTED_MODULE_0__ui__["a" /* Anchor */].x(label.anchor, ctx.width) + label.offsetX, __WEBPACK_IMPORTED_MODULE_0__ui__["a" /* Anchor */].y(label.anchor, ctx.height) + label.offsetY);

    if (label.strikethrough) {
      const textWidth = ctx.ctx.measureText(label.text).width;
      const strikePath = this.getStrikePath(ctx, label, textWidth);
      ctx.ctx.strokeStyle = label.textFill;
      ctx.ctx.lineWidth = 2;
      ctx.ctx.stroke(strikePath);
    }

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UiLabelRenderer;



/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__audio__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__save__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_mainloop_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_mainloop_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_mainloop_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ui__ = __webpack_require__(0);









const ui = new __WEBPACK_IMPORTED_MODULE_5__ui__["d" /* UI */]()
  .addEventListener('mousedown', (event) => {
    if (event.button === 0 && !event.repeat) {
      jump();
    }
  })
  .addEventListener('keydown', (event) => {
    if (event.which === 32 && !event.repeat) {
      jump();
    }
  });

const muteButton = new __WEBPACK_IMPORTED_MODULE_5__ui__["b" /* Button */](80, 28, __WEBPACK_IMPORTED_MODULE_5__ui__["a" /* Anchor */].topright(), -20, 20)
  .setText('Mute')
  .setTextStyle('brown', '16px \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif')
  .setButtonStyle('beige', 'burlywood', 3)
  .addClickListener(() => {
    __WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].mute = !__WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].mute;
  });

const instructionLabel = new __WEBPACK_IMPORTED_MODULE_5__ui__["c" /* Label */](__WEBPACK_IMPORTED_MODULE_5__ui__["a" /* Anchor */].topcenter(), 'center', 0, 30)
  .setText('Press space to flap')
  .setTextStyle('white', '3em \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif');

ui.addElement(muteButton);
ui.addElement(instructionLabel);

function lose() {
  __WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].lastScore = __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().bird.mass - 1;
  __WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].bestScore = Math.max(__WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].bestScore, __WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].lastScore);
  __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].reset();
}

function jump() {
  if (__WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().bird.flapCooldown <= 0) {
    __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().paused = false;
    __WEBPACK_IMPORTED_MODULE_1__audio__["a" /* default */].playJump();
    __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().bird.vy = -0.0006;
    __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().bird.flapCooldown = 10;
  }
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  let state = __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current();

  instructionLabel.enabled = state.paused;
  muteButton.strikethrough = __WEBPACK_IMPORTED_MODULE_2__save__["a" /* default */].mute;

  if (!state.paused) {
    // update position
    state.bird.x += state.bird.vx * delta;
    state.bird.y += state.bird.vy * delta;
    state.bird.vy += state.gravity * state.bird.mass * delta;

    if (state.bird.y < 0 || state.bird.y > 1) {
      __WEBPACK_IMPORTED_MODULE_1__audio__["a" /* default */].playCrash();
      lose();
    }

    let pickups = state.pickups;

    // collisions
    for (let pickup in pickups) {
      let xDiff = pickups[pickup].x - state.bird.x;
      let yDiff = pickups[pickup].y - state.bird.y;
      let distanceToBird = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      if (distanceToBird < state.bird.radius + pickups[pickup].radius) {
        __WEBPACK_IMPORTED_MODULE_1__audio__["a" /* default */].playCoin();
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
          id: __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].newId(),
          radius: 0.05,
          x: state.lastGen,
          y: 0.5,
        });
      }

      if (rand < 0.2) {
        pickups.push({
          id: __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].newId(),
          radius: 0.05,
          x: state.lastGen,
          y: 0.2,
        });
      }
    }

    // other logic
    __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().bird.flapCooldown -= delta;
  }
}

function end(fps, panic) {
  __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].current().fps = fps;
  if (panic) {
    var discardedTime = Math.round(__WEBPACK_IMPORTED_MODULE_4_mainloop_js__["resetFrameDelta"]());
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
  const renderer = new __WEBPACK_IMPORTED_MODULE_0__renderer__["a" /* Renderer */](ctx, ui);
  ui.addCanvasEvents(canvas);

  __WEBPACK_IMPORTED_MODULE_3__state__["a" /* default */].reset();
  __WEBPACK_IMPORTED_MODULE_4_mainloop_js__["setUpdate"](update).setDraw(renderer.draw.bind(renderer)).setEnd(end).start();
});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderers_entity__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__renderers_background__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__renderers_ui__ = __webpack_require__(8);





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

  constructor(ctx, ui) {
    this.ctx = ctx;
    this.backgroundRenderer = new __WEBPACK_IMPORTED_MODULE_2__renderers_background__["a" /* BackgroundRenderer */]();
    this.entityRenderer = new __WEBPACK_IMPORTED_MODULE_0__renderers_entity__["a" /* EntityRenderer */]();
    this.uiRenderer = new __WEBPACK_IMPORTED_MODULE_3__renderers_ui__["a" /* UiRenderer */](ui);

    this.birdImage = new Image();
    this.birdImage.src = './assets/bird.png';
    this.cookieImage = new Image();
    this.cookieImage.src = './assets/cookie.png';
  }

  draw(interpolation) {
    const state = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* default */].current();
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

    this.uiRenderer.draw(renderingContext);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ }),
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_button__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_label__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui__ = __webpack_require__(0);




class UiRenderer {

  constructor(ui) {
    this.ui = ui;
    this.buttonRenderer = new __WEBPACK_IMPORTED_MODULE_0__ui_button__["a" /* UiButtonRenderer */]();
    this.labelRenderer = new __WEBPACK_IMPORTED_MODULE_1__ui_label__["a" /* UiLabelRenderer */]();
  }

  draw(ctx) {
    ctx.ctx.save();

    for (const el of this.ui.elements) {
      if (!el.enabled) continue;

      switch (el.constructor) {
      case __WEBPACK_IMPORTED_MODULE_2__ui__["b" /* Button */]:
        this.buttonRenderer.draw(ctx, el);
        break;
      case __WEBPACK_IMPORTED_MODULE_2__ui__["c" /* Label */]:
        this.labelRenderer.draw(ctx, el);
        break;
      default:
        throw 'No renderer defined for this ui element';
      }
    }

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UiRenderer;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_label__ = __webpack_require__(2);


class UiButtonRenderer extends __WEBPACK_IMPORTED_MODULE_0__ui_label__["a" /* UiLabelRenderer */] {

  constructor() {
    super();
  }

  draw(ctx, button) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = button.fill;
    ctx.ctx.strokeStyle = button.border;
    ctx.ctx.lineWidth = button.borderWidth;
    const path = button.path(ctx.width, ctx.height);

    ctx.ctx.fill(path);
    ctx.ctx.stroke(path);

    // draw label centered
    const oldOffsetX = button.offsetX;
    const oldOffsetY = button.offsetY;

    button.offsetX = button.textOffsetX();
    button.offsetY = button.textOffsetY();
    super.draw(ctx, button);

    button.offsetX = oldOffsetX;
    button.offsetY = oldOffsetY;

    ctx.ctx.restore();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UiButtonRenderer;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__save__ = __webpack_require__(3);


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
/* 11 */
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