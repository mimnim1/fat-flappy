import Save from '../save';

export class MuteButtonRenderer {

  constructor() {}

  draw(ctx) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = 'white';
    ctx.ctx.font = '16px \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif';
    ctx.ctx.textAlign = 'right';

    ctx.ctx.fillText('Mute', ctx.width - ctx.scale * 0.05, ctx.scale * 0.05);
    if (Save.mute) {
      // TODO strikethrough
      ctx.ctx.fillRect();
    }

    ctx.ctx.restore();
  }
}
