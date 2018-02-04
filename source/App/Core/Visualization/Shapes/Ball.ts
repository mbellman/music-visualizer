import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import { Implementation, Override } from '@base';
import { IPoolable } from '@core/Pool';
import { ShapeTypes } from '@core/Visualization/Types';

export default class Ball extends Shape implements IPoolable<Ball> {
  public type: ShapeTypes = ShapeTypes.BALL;
  private _radius: number;

  @Implementation
  public get size (): number {
    return 2 * this._radius;
  }

  @Override
  public construct (x: number, y: number, radius: number): this {
    super.construct(x, y);

    this._radius = radius;

    return this;
  }

  @Override
  public destruct (): void {
    super.destruct();

    this._radius = null;
  }

  @Implementation
  protected draw (canvas: Canvas): void {
    // We render the Ball {{_radius}} pixels to the right
    // to ensure its left edge aligns with {{pixelX}}.
    canvas.circle(this.pixelX + this._radius, this.pixelY, this._radius);
  }
}
