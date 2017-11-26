import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import { IColor } from 'Graphics/Types';
import { Implementation } from 'Base/Decorators';

export default class Glow extends Effect {
  public readonly type: EffectType = EffectType.PRE;
  private _color: string;
  private _blur: number;

  public constructor (color: IColor, blur: number = 5) {
    super();

    this._color = Canvas.colorToString(color);
    this._blur = blur;
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.GLOW_COLOR, this._color);
    canvas.set(DrawSetting.GLOW_BLUR, this._blur);
  }
}
