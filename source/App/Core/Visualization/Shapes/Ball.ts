import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import { Implementation } from '@base';

export default class Ball extends Shape {
  private _radius: number;

  public constructor (x: number, y: number, radius: number) {
    super(x, y);

    this._radius = radius;
  }

  @Implementation
  public draw (canvas: Canvas): void {
    canvas.circle(this.pixelX, this.pixelY, this._radius);
  }

  @Implementation
  public isOffscreen (): boolean {
    return this.pixelX + this._radius < 0;
  }
}
