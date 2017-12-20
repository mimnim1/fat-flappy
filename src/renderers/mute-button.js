import Save from '../save';

export class MuteButtonRenderer {

  constructor() {
    this.text = 'Mute';
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
    this.setTextStyle(ctx);

    const screenPadding = ctx.scale * 0.05;
    const boxPadding = ctx.scale * 0.01;
    const boxWidth = ctx.ctx.measureText(this.text).width;
    const boxHeight = 16;

    this.setBoxStyle(ctx);
    ctx.ctx.fillRect(ctx.width - screenPadding + boxPadding, screenPadding - boxPadding, -boxWidth - boxPadding * 2, boxHeight + boxPadding * 2);
    ctx.ctx.strokeRect(ctx.width - screenPadding + boxPadding, screenPadding - boxPadding, -boxWidth - boxPadding * 2, boxHeight + boxPadding * 2);

    this.setTextStyle(ctx);
    ctx.ctx.fillText(this.text, ctx.width - screenPadding, screenPadding);

    // Strikethrough text if muted
    if (Save.mute) {
      ctx.ctx.fillRect();
    }

    ctx.ctx.restore();
  }
}
