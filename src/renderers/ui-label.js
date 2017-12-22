import { Anchor } from '../ui';

export class UiLabelRenderer {
  constructor() {}

  getStrikePath(ctx, label, textWidth) {
    const path = new Path2D();

    const Y = Anchor.y(label.anchor, ctx.height) + label.offsetY;
    let startX = Anchor.x(label.anchor, ctx.width) + label.offsetX;
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
    ctx.ctx.fillText(label.text, Anchor.x(label.anchor, ctx.width) + label.offsetX, Anchor.y(label.anchor, ctx.height) + label.offsetY);

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
