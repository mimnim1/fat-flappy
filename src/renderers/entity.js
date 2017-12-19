export class EntityRenderer {

  constructor() {}

  draw(ctx, image, x, y, radius, rotation = undefined) {
    ctx.ctx.save();

    ctx.ctx.translate(x * ctx.scale, y * ctx.scale);
    
    if (rotation !== undefined) {
      ctx.ctx.rotate(rotation * Math.PI / 180);
    }

    ctx.ctx.drawImage(image, -image.width / 2, -image.height / 2, ctx.scale * radius * 2, ctx.scale * radius * 2);

    ctx.ctx.restore();
  }
}
