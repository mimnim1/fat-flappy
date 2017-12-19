import Save from '../save';

export class MuteButtonRenderer {

  constructor() {}

  draw(ctx) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = 'white';
    ctx.ctx.font = '16px \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif';
    ctx.ctx.textAlign = 'right';

    ctx.ctx.fillText('Mute', ctx.width - ctx.width * 0.05, ctx.height * 0.05);
    if (Save.mute) {
      // TODO strikethrough
      ctx.ctx.fillRect();
    }

    ctx.ctx.restore();
  }
}
