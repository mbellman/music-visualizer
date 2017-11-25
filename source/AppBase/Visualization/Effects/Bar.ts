import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect from 'AppBase/Visualization/Effects/Effect';
import Visualizer from 'AppBase/Visualizer';
import { IColor } from 'AppBase/Visualization/Types';
import { Implementation } from 'Base/Decorators';

export default class Bar extends Effect {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  public constructor (color: IColor, top: number, width: number, height: number) {
    super(color);

    this._x = 100;
    this._y = top;
    this._width = width;
    this._height = height;
  }

  @Implementation
  public draw (canvas: Canvas): void {
    const pX: number = Math.round(this._x / 100 * canvas.width);
    const pY: number = Math.round(this._y / 100 * canvas.height);

    if (pX + this._width < 0) {
      this.expire();

      return;
    }

    canvas.set(DrawSetting.FILL_COLOR, this.color);
    canvas.rectangle(pX, pY, this._width, this._height);
    canvas.fill();
  }

  @Implementation
  public update (dt: number, tempo: number): void {
    this._x -= dt * Math.round(tempo / 20);
  }
}
