import { UiLabelRenderer } from './ui-label';

export class UiButtonRenderer extends UiLabelRenderer {

  constructor() {
    super();
  }

  draw(ctx, button) {
    ctx.ctx.save();

    ctx.ctx.fillStyle = button.fill;
    ctx.ctx.strokeStyle = button.border;
    ctx.ctx.lineWidth = button.borderWidth;
    const path = button.path(ctx.width, ctx.height);

    ctx.ctx.fill(path);
    ctx.ctx.stroke(path);

    // draw label centered
    const oldOffsetX = button.offsetX;
    const oldOffsetY = button.offsetY;

    button.offsetX = button.textOffsetX();
    button.offsetY = button.textOffsetY();
    super.draw(ctx, button);

    button.offsetX = oldOffsetX;
    button.offsetY = oldOffsetY;

    ctx.ctx.restore();
  }
}
