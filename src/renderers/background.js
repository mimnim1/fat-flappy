export class BackgroundRenderer {
  constructor() {}
  
  draw(ctx) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = 'skyblue';
    ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);

    ctx.ctx.restore();
  }
}
