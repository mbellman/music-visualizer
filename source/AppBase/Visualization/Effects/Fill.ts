import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import { IColor } from 'Graphics/Types';
import { Implementation } from 'Base/Decorators';

export default class Fill extends Effect {
  public readonly type: EffectType = EffectType.POST;
  private _color: string;

  public constructor (color: IColor) {
    super();

    this._color = Canvas.colorToString(color);
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.FILL_COLOR, this._color);
    canvas.fill();
  }
}
