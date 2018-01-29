import Canvas from 'Graphics/Canvas';
import Shape from 'AppCore/Visualization/Shapes/Shape';

export default abstract class Effect {
  protected shape: Shape;
  private _delay: number = 0;
  private _startTime: number = Date.now();

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public get delayedAge (): number {
    return Math.max(this.age - this._delay, 0);
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
