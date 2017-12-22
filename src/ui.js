export class UIElement {

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

export class Anchor {

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

export class Label extends UIElement {

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

export class Button extends Label {

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

export class UI {

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
