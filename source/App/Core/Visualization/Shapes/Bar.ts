import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import { Implementation } from '@base';

export default class Bar extends Shape {
  private _height: number;
  private _width: number;

  public constructor (x: number, y: number, width: number, height: number) {
    super(x, y);

    this._width = width;
    this._height = height;
  }

  @Implementation
  public draw (canvas: Canvas): void {
    canvas.rectangle(this.pixelX, this.pixelY - (this._height / 2), this._width, this._height);
  }

  @Implementation
  public isOffscreen (): boolean {
    return this.pixelX + this._width < 0;
  }
}
