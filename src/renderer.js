import { EntityRenderer } from './renderers/entity';
import State from './state';
import { BackgroundRenderer } from './renderers/background';
import { UiRenderer } from './renderers/ui';

export class RenderingContext {

  constructor(ctx, interpolation, width, height) {
    this.ctx = ctx;
    this.interpolation = interpolation;
    this.width = width;
    this.height = height;
    this.scale = height;
    this.debug = true;
  }
}

export class Renderer {

  constructor(ctx, ui) {
    this.ctx = ctx;
    this.backgroundRenderer = new BackgroundRenderer();
    this.entityRenderer = new EntityRenderer();
    this.uiRenderer = new UiRenderer(ui);

    this.birdImage = new Image();
    this.birdImage.src = './assets/bird.png';
    this.cookieImage = new Image();
    this.cookieImage.src = './assets/cookie.png';
  }

  draw(interpolation) {
    const state = State.current();
    const renderingContext = new RenderingContext(this.ctx, interpolation, this.ctx.canvas.width, this.ctx.canvas.height);

    // Restore transforms
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.backgroundRenderer.draw(renderingContext);

    // ####
    // CAMERA TRANSLATE
    // ####
    this.ctx.save();
    this.ctx.translate(-(state.bird.x - 0.1) * renderingContext.scale, 0);
    
    this.entityRenderer.draw(renderingContext,
      this.birdImage,
      state.bird.x,
      state.bird.y,
      state.bird.radius,
      Math.max(-90, Math.min(90, Math.round(state.bird.vy * 90000))));
  
    // fpsCounter.textContent = Math.round(State.current().fps) + ' FPS';
    // distance.textContent = screenX();
  
    for (let pickup of state.pickups) {
      this.entityRenderer.draw(renderingContext,
        this.cookieImage,
        pickup.x,
        pickup.y,
        pickup.radius);
    }

    this.ctx.restore();
    // ####
    // END CAMERA TRANSLATE
    // ####

    this.uiRenderer.draw(renderingContext);
  }
}
