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
}

export class UI {

  constructor() {
    this.elements = [];
  }

  addElement(el) {
    if (el instanceof UIElement) {
      this.elements.push(el);
    } else {
      throw 'Attempt to add non ui element to ui';
    }
  }
}
