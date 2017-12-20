import Save from '../save';

export class MuteButtonRenderer {

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
    if (Save.mute) {
      this.setBoxStyle(ctx);
      const strokePath = this.getStrikePath(ctx, screenMargin, textWidth);
      ctx.ctx.stroke(strokePath);
    }

    ctx.ctx.restore();
  }
}
