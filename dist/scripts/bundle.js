(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * mainloop.js 1.0.3-20170529
 *
 * @author Isaac Sukin (http://www.isaacsukin.com/)
 * @license MIT
 */

!function(a){function b(a){if(x=q(b),!(a<e+l)){for(d+=a-e,e=a,t(a,d),a>i+h&&(f=g*j*1e3/(a-i)+(1-g)*f,i=a,j=0),j++,k=0;d>=c;)if(u(c),d-=c,++k>=240){o=!0;break}v(d/c),w(f,o),o=!1}}var c=1e3/60,d=0,e=0,f=60,g=.9,h=1e3,i=0,j=0,k=0,l=0,m=!1,n=!1,o=!1,p="object"==typeof window?window:a,q=p.requestAnimationFrame||function(){var a=Date.now(),b,d;return function(e){return b=Date.now(),d=Math.max(0,c-(b-a)),a=b+d,setTimeout(function(){e(b+d)},d)}}(),r=p.cancelAnimationFrame||clearTimeout,s=function(){},t=s,u=s,v=s,w=s,x;a.MainLoop={getSimulationTimestep:function(){return c},setSimulationTimestep:function(a){return c=a,this},getFPS:function(){return f},getMaxAllowedFPS:function(){return 1e3/l},setMaxAllowedFPS:function(a){return"undefined"==typeof a&&(a=1/0),0===a?this.stop():l=1e3/a,this},resetFrameDelta:function(){var a=d;return d=0,a},setBegin:function(a){return t=a||t,this},setUpdate:function(a){return u=a||u,this},setDraw:function(a){return v=a||v,this},setEnd:function(a){return w=a||w,this},start:function(){return n||(n=!0,x=q(function(a){v(1),m=!0,e=a,i=a,j=0,x=q(b)})),this},stop:function(){return m=!1,n=!1,r(x),this},isRunning:function(){return m}},"function"==typeof define&&define.amd?define(a.MainLoop):"object"==typeof module&&null!==module&&"object"==typeof module.exports&&(module.exports=a.MainLoop)}(this);

},{}],2:[function(require,module,exports){
let MainLoop = require('mainloop.js')
// audio
let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

// DOM elements
let fpsCounter;
let distanceElement;
let playerElement;

// variables
let currentFps = 0.0;

let distance = 0.0;
// speed in millis
let speed = 1 / 1000;
let gravity = 0.8 / 1000;

let playerY = 0.0;
let playerVY = 0.0;
let flapCooldown = 0.0;

function spaceDown() {
  if (flapCooldown <= 0) {
    // replay the audio
    audioJump.pause();
    audioJump.currentTime = 0;
    audioJump.play();

    // update speed
    playerVY = -0.6;

    // set cooldown in millis
    flapCooldown = 400;
  }
}

/**
 * @param {Number} delta
 *   The amount of time since the last update, in milliseconds.
 */
function update(delta) {
  distance += speed * delta;

  playerY += playerVY * delta;
  playerVY += gravity * delta;

  flapCooldown -= delta;
}

/**
* @param {Number} interpolationPercentage
*   How much to interpolate between frames.
*/
function draw(interpolationPercentage) {
  fpsCounter.textContent = Math.round(currentFps) + ' FPS';
  distanceElement.textContent = distance;

  playerElement.setAttribute('style', 'top: ' + Math.round(playerY) + 'px; left: 40px;');
}

/**
* @param {Number} fps
*   The smoothed frames per second.
* @param {Boolean} panic
*   Whether the main loop panicked because the simulation fell too far behind
*   real time.
*/
function end(fps, panic) {
  currentFps = fps;
  if (panic) {
      // This pattern introduces non-deterministic behavior, but in this case
      // it's better than the alternative (the application would look like it
      // was running very quickly until the simulation caught up to real
      // time). See the documentation for `MainLoop.setEnd()` for additional
      // explanation.
      var discardedTime = Math.round(MainLoop.resetFrameDelta());
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fpsCounter = document.querySelector('.fpscounter');
  distanceElement = document.querySelector('.distance');
  playerElement = document.querySelector('.player');

  window.addEventListener('keydown', (event) => {
    switch (event.which) {
      case 32:
        spaceDown();
        break;
    }
  });

  MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
});

},{"mainloop.js":1}]},{},[2]);
