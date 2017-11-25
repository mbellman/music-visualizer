import Canvas, { DrawSetting } from 'Graphics/Canvas';
import ScrollingEffect from 'AppBase/Visualization/Effects/ScrollingEffect';
import Visualizer from 'AppBase/Visualization/Visualizer';
import { IColor } from 'AppBase/Visualization/Types';
import { Override } from 'Base/Decorators';

export default class Bar extends ScrollingEffect {
  private _height: number;
  private _width: number;

  public constructor (color: IColor, top: number, width: number, height: number) {
    super(color);

    this.y = top;
    this._width = width;
    this._height = height;
  }

  @Override
  public draw (canvas: Canvas): void {
    super.draw(canvas);

    if (this.pX + this._width < 0) {
      this.expire();

      return;
    }

    canvas.set(DrawSetting.FILL_COLOR, this.color);
    canvas.rectangle(this.pX, this.pY - Math.round(this._height / 2), this._width, this._height);
    canvas.fill();
  }
}
