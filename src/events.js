import Audio from './audio';
import State from './state';

function jump() {
  if (State.current().bird.flapCooldown <= 0) {
    State.current().paused = false;
    Audio.playJump();
    State.current().bird.vy = -0.0006;
    State.current().bird.flapCooldown = 10;
  }
}

export class EventListener {

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

export class MouseListener extends EventListener {

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

export class Events {

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
