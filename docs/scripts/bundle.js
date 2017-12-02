(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * mainloop.js 1.0.3-20170529
 *
 * @author Isaac Sukin (http://www.isaacsukin.com/)
 * @license MIT
 */

!function(a){function b(a){if(x=q(b),!(a<e+l)){for(d+=a-e,e=a,t(a,d),a>i+h&&(f=g*j*1e3/(a-i)+(1-g)*f,i=a,j=0),j++,k=0;d>=c;)if(u(c),d-=c,++k>=240){o=!0;break}v(d/c),w(f,o),o=!1}}var c=1e3/60,d=0,e=0,f=60,g=.9,h=1e3,i=0,j=0,k=0,l=0,m=!1,n=!1,o=!1,p="object"==typeof window?window:a,q=p.requestAnimationFrame||function(){var a=Date.now(),b,d;return function(e){return b=Date.now(),d=Math.max(0,c-(b-a)),a=b+d,setTimeout(function(){e(b+d)},d)}}(),r=p.cancelAnimationFrame||clearTimeout,s=function(){},t=s,u=s,v=s,w=s,x;a.MainLoop={getSimulationTimestep:function(){return c},setSimulationTimestep:function(a){return c=a,this},getFPS:function(){return f},getMaxAllowedFPS:function(){return 1e3/l},setMaxAllowedFPS:function(a){return"undefined"==typeof a&&(a=1/0),0===a?this.stop():l=1e3/a,this},resetFrameDelta:function(){var a=d;return d=0,a},setBegin:function(a){return t=a||t,this},setUpdate:function(a){return u=a||u,this},setDraw:function(a){return v=a||v,this},setEnd:function(a){return w=a||w,this},start:function(){return n||(n=!0,x=q(function(a){v(1),m=!0,e=a,i=a,j=0,x=q(b)})),this},stop:function(){return m=!1,n=!1,r(x),this},isRunning:function(){return m}},"function"==typeof define&&define.amd?define(a.MainLoop):"object"==typeof module&&null!==module&&"object"==typeof module.exports&&(module.exports=a.MainLoop)}(this);

},{}],2:[function(require,module,exports){
let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

function play(audio) {
  return () => {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}

module.exports = {
  playCoin: play(audioCoin),
  playCrash: play(audioCrash),
  playJump: play(audioJump),
  playPowerup: play(audioPowerup),
  playWarning: play(audioWarning)
}

},{}],3:[function(require,module,exports){
let State = require('./state');

// DOM elements
let windowElement;
let fpsCounter;
let distance;
let player;

let windowRect = { width: 1, height: 1 };

function onResize() {
  windowRect = windowElement.getBoundingClientRect();
}

function draw(interpolationPercentage) {
  fpsCounter.textContent = Math.round(State.current().fps) + ' FPS';
  distance.textContent = State.current().distance;

  player.setAttribute('style', 'top: ' + Math.round(State.current().bird.y * windowRect.height) + 'px; left: 40px;' +
    'transform: rotate(' + Math.max(-90, Math.min(90, Math.round(State.current().bird.vy * 90000))) + 'deg);');
}

function registerEvents(spaceCallback) {
  window.addEventListener('DOMContentLoaded', () => {
    // assign all dom elements to variables
    windowElement = document.querySelector('.window');
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

},{"./state":5}],4:[function(require,module,exports){
let State = require('./state');
let MainLoop = require('mainloop.js');
let DOMHelper = require('./domhelper');
let Audio = require('./audio');

// speed in millis
let speed = 0.01 / 1000;
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
  if (!State.current().paused) {
    State.current().distance += speed * delta;
  
    State.current().bird.y += State.current().bird.vy * delta;
    State.current().bird.vy += gravity * delta;
  
    State.current().bird.flapCooldown -= delta;

    if (State.current().bird.y < 0 || State.current().bird.y > 1) {
      State.reset();
    }
  }
}

function end(fps, panic) {
  State.current().fps = fps;
  if (panic) {
      var discardedTime = Math.round(MainLoop.resetFrameDelta());
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
}

DOMHelper.registerEvents(spaceDown);
MainLoop.setUpdate(update).setDraw(DOMHelper.draw).setEnd(end).start();

},{"./audio":2,"./domhelper":3,"./state":5,"mainloop.js":1}],5:[function(require,module,exports){
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
},{}]},{},[4]);
