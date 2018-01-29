import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect from 'AppCore/Visualization/Effects/Effect';
import { IColor } from 'Graphics/Types';
import { Implementation } from 'Base/Core';

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
