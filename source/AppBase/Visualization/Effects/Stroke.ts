import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import { Implementation } from 'Base/Decorators';
import { IColor } from 'Graphics/Types';
import Canvas, { DrawSetting } from 'Graphics/Canvas';

export default class Stroke extends Effect {
  private _color: string;
  private _width: number;

  public constructor (color: IColor, width: number) {
    super();

    this._color = Canvas.colorToString(color);
    this._width = width;
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.STROKE_COLOR, this._color);
    canvas.set(DrawSetting.STROKE_WIDTH, this._width);
    canvas.stroke();
  }
}
