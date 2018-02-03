import Canvas from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { Implementation } from '@base';
import { IPoolable } from '@core/Pool';
import { ShapeTypes } from '@core/Visualization/Types';

export default abstract class Shape implements IPoolable<Shape> {
  public abstract type: ShapeTypes;
  /**
   * Both {{shouldPrerender}} and {{shouldRefresh}} are flags which determine
   * where a Shape is to be drawn during the next render pass. The Visualizer
   * class uses a 'prerendering' Canvas for Shapes with active Effects which
   * render statically (such as a plain Fill or Stroke), and a 'refreshing'
   * Canvas for Shapes with active Effects which render dynamically (such as
   * Glow). The prerendering Canvas accumulates Shapes as they are rendered
   * to it, and is never cleared. Conversely, the refreshing Canvas is cleared
   * on every frame. Effects are responsible for deciding when their parent
   * Shape needs to be prerendered or refreshed, and a refresh will always
   * take priority over a prerender (to avoid competition between Effects).
   * Both flags are reset to false at the beginning of each tick(), and if
   * neither is set to true during the tick() cycle, the Shape will not be
   * manually redrawn.
   */
  public shouldPrerender: boolean = false;
  public shouldRefresh: boolean = false;
  protected offsetX: number = 0;
  protected offsetY: number = 0;
  protected x: number = 0;
  protected y: number = 0;
  private _age: number = 0;
  private _effects: Effect[] = [];

  public get age (): number {
    return this._age;
  }

  public get effects (): Effect[] {
    return this._effects;
  }

  protected get pixelX (): number {
    return this.x + this.offsetX;
  }

  protected get pixelY (): number {
    return this.y + this.offsetY;
  }

  @Implementation
  public construct (x: number, y: number, ...args: any[]): this {
    this.x = x;
    this.y = y;

    return this;
  }

  @Implementation
  public destruct (): void {
    this.shouldPrerender = false;
    this.shouldRefresh = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.x = 0;
    this.y = 0;
    this._age = 0;
    this._effects.length = 0;
  }

  public isPrerendered (): boolean {
    for (let i = 0; i < this._effects.length; i++) {
      if (!this._effects[i].isPrerendered) {
        return false;
      }
    }

    return true;
  }

  public pipe (effect: Effect): this {
    effect.track(this);

    this._effects.push(effect);

    return this;
  }

  /**
   * The render cycle occurs after the tick cycle, if and only if the Shape
   * has been flagged for either prerendering or refreshing by one of its
   * piped Effects.
   */
  public render (canvas: Canvas): void {
    this.draw(canvas);

    for (let i = 0; i < this._effects.length; i++) {
      const effect: Effect = this._effects[i];

      if (effect.isActive()) {
        effect.draw(canvas);
      }
    }
  }

  /**
   * The tick cycle, which is called on every frame and occurs prior to
   * the render cycle, relies on piped Effects to decide whether the
   * Visualizer should prerender or refresh the Shape.
   */
  public tick (dt: number): void {
    this._age += dt * 1000;
    this.shouldPrerender = false;
    this.shouldRefresh = false;

    for (let i = 0; i < this._effects.length; i++) {
      this._effects[i].tick(dt);
    }
  }

  protected abstract draw (canvas: Canvas): void;
}
