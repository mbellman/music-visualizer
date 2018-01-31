import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';

export default abstract class Effect {
  protected shape: Shape;
  private _age: number = 0;
  private _delay: number = 0;

  public get delayedAge (): number {
    return Math.max(this._age - this._delay, 0);
  }

  public age (amount: number): void {
    this._age += amount;
  }

  public delay (delay: number): this {
    this._delay = delay;

    return this;
  }

  public isDelaying (): boolean {
    return this.delayedAge === 0;
  }

  /**
   * Allows an internal reference to the parent Shape instance to be
   * maintained after an Effect is piped into the Shape.
   */
  public track (shape: Shape): void {
    this.shape = shape;
  }

  public abstract update (canvas: Canvas, dt: number, tempo: number): void;
}
