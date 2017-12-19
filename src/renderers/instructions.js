export class InstructionsRenderer {
  constructor() {}

  draw(ctx) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = 'white';
    ctx.ctx.font = '3em \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif';
    ctx.ctx.textAlign = 'center';

    ctx.ctx.fillText('Press space to flap', ctx.width / 2, ctx.height * 0.1);

    ctx.ctx.restore();
  }
}
