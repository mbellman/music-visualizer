import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect from 'AppBase/Visualization/Effects/Effect';
import { Implementation } from 'Base/Decorators';
import { IColor } from 'AppBase/Visualization/Types';

export default class Glow extends Effect {
  private _blur: number;

  public constructor (color: IColor, blur: number = 5) {
    super(color);

    this._blur = blur;
  }

  @Implementation
  public draw (canvas: Canvas): void {
    canvas.set(DrawSetting.GLOW_COLOR, this.color);
    canvas.set(DrawSetting.GLOW_BLUR, this._blur);
  }

  @Implementation
  public update (): void {}
}
