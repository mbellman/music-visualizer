import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { Implementation } from '@base';

export default class Fill extends Effect {
  private _color: string;

  public constructor (color: string) {
    super();

    this._color = color;
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.FILL_COLOR, this._color);
    canvas.fill();
  }
}
