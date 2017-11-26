import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import { IColor } from 'Graphics/Types';
import { Implementation } from 'Base/Decorators';

export default class Glow extends Effect {
  private _blur: number;
  private _color: string;
  private _fadeInTime: number = -1;
  private _fadeOutTime: number = -1;

  public constructor (color: IColor, blur: number = 5) {
    super();

    this._color = Canvas.colorToString(color);
    this._blur = blur;
  }

  public fadeIn (time: number): this {
    this._fadeInTime = time;

    return this;
  }

  public fadeOut (time: number): this {
    this._fadeOutTime = time;

    return this;
  }

  @Implementation
  public update (canvas: Canvas): void {
    const blur: number = this._getBlurAmount();

    if (blur > 0) {
      canvas.set(DrawSetting.GLOW_COLOR, this._color);
      canvas.set(DrawSetting.GLOW_BLUR, blur);
    }
  }

  private _getBlurAmount (): number {
    if (this._fadeInTime === -1 && this._fadeOutTime === -1) {
      return this._blur;
    }

    if (this.delayedAge > this._fadeInTime + this._fadeOutTime) {
      return 0;
    }

    const isFadingIn: boolean = this.delayedAge < this._fadeInTime;
    const fadeOutAge: number = this.delayedAge - this._fadeInTime;
    const blurMultiplier: number = isFadingIn ? this.delayedAge / this._fadeInTime : 1 - fadeOutAge / this._fadeOutTime;

    return this._blur * blurMultiplier;
  }
}
