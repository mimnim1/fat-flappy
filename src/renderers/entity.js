export class EntityRenderer {

  constructor() {}

  draw(ctx, image, x, y, radius, rotation = undefined) {
    ctx.ctx.save();

    ctx.ctx.translate(x * ctx.scale, y * ctx.scale);
    
    if (rotation !== undefined) {
      ctx.ctx.rotate(rotation * Math.PI / 180);
    }

    ctx.ctx.drawImage(image, -ctx.scale * radius, -ctx.scale * radius, ctx.scale * radius * 2, ctx.scale * radius * 2);

    if (ctx.debug) {
      ctx.ctx.strokeStyle = 'black';
      ctx.ctx.beginPath();
      ctx.ctx.arc(0, 0, ctx.scale * radius, 0, 2 * Math.PI);
      ctx.ctx.stroke();
    }

    ctx.ctx.restore();
  }
}
