import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import { EffectTypes } from '@core/Visualization/Types';
import { Implementation } from '@base';
import { IPoolable } from '@core/Pool';

export default abstract class Effect implements IPoolable<Effect> {
  public abstract type: EffectTypes;
  /**
   * Determines whether the Effect has been permanently prerendered by the
   * Visualizer, and requires no further updates or redraws. This flag is
   * set to true once the Effect flags its parent Shape for prerendering.
   *
   * If a Shape's Effects have all been prerendered, the Shape is ready
   * for deallocation.
   */
  public isPrerendered: boolean = false;
  private _delay: number = 0;
  private _parentShape: Shape;

  public get activeAge (): number {
    return Math.max(this._parentShape.age - this._delay, 0);
  }

  public abstract construct (...args: any[]): this;

  public delay (delay: number): this {
    this._delay = delay;

    return this;
  }

  @Implementation
  public destruct (): void {
    this.isPrerendered = false;
    this._parentShape = null;
    this._delay = 0;
  }

  public abstract draw (canvas: Canvas): void;

  public isActive (): boolean {
    return this.activeAge > 0;
  }

  /**
   * This tick function assumes that the Effect, once activated after its
   * delay, is ready to flag is parent Shape for prerendering. Subclasses
   * can override this method and use custom logic to determine whether a
   * Shape should be prerendered or refreshed.
   */
  public tick (dt: number): void {
    if (this.isActive() && !this.isPrerendered) {
      this.flagShapeForPrerendering();
    }
  }

  public track (shape: Shape): void {
    this._parentShape = shape;
  }

  protected flagShapeForPrerendering (): void {
    this._parentShape.shouldPrerender = true;
    this.isPrerendered = true;
  }

  protected flagShapeForRefreshing (): void {
    this._parentShape.shouldRefresh = true;
  }
}
