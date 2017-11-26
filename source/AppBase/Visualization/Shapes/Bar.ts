import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Shape from 'AppBase/Visualization/Shapes/Shape';
import { Implementation } from 'Base/Decorators';

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
