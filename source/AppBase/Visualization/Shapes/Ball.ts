import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Shape from 'AppBase/Visualization/Shapes/Shape';
import { Implementation } from 'Base/Decorators';

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
