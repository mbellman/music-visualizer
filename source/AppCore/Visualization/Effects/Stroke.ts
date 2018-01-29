import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect from 'AppCore/Visualization/Effects/Effect';
import { Implementation } from 'Base/Core';

export default class Stroke extends Effect {
  private _color: string;
  private _width: number;

  public constructor (color: string, width: number) {
    super();

    this._color = color;
    this._width = width;
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.STROKE_COLOR, this._color);
    canvas.set(DrawSetting.STROKE_WIDTH, this._width);
    canvas.stroke();
  }
}
