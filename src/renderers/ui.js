import { UiButtonRenderer } from './ui-button';
import { UiLabelRenderer } from './ui-label';
import { Button, Label } from '../ui';

export class UiRenderer {

  constructor(ui) {
    this.ui = ui;
    this.buttonRenderer = new UiButtonRenderer();
    this.labelRenderer = new UiLabelRenderer();
  }

  draw(ctx) {
    ctx.ctx.save();

    for (const el of this.ui.elements) {
      if (!el.enabled) continue;

      switch (el.constructor) {
      case Button:
        this.buttonRenderer.draw(ctx, el);
        break;
      case Label:
        this.labelRenderer.draw(ctx, el);
        break;
      default:
        throw 'No renderer defined for this ui element';
      }
    }

    ctx.ctx.restore();
  }
}
