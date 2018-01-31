import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { Implementation } from '@base';

export default class Glow extends Effect {
  private _blur: number;
  private _color: string;
  private _fadeInTime: number = 0;
  private _fadeOutTime: number = 0;

  public constructor (color: string, blur: number = 5) {
    super();

    this._color = color;
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
    const shouldUseDefault: boolean = this.delayedAge > this._fadeInTime && this._fadeOutTime === 0;
    const hasFadedOut: boolean = !shouldUseDefault && this.delayedAge > this._fadeInTime + this._fadeOutTime;

    if (shouldUseDefault) {
      return this._blur;
    } else if (hasFadedOut) {
      return 0;
    } else {
      const isFadingIn: boolean = this.delayedAge < this._fadeInTime;
      const elapsedFadeOutTime: number = this.delayedAge - this._fadeInTime;
      const blurMultiplier: number = isFadingIn ? this.delayedAge / this._fadeInTime : 1 - elapsedFadeOutTime / this._fadeOutTime;

      return this._blur * blurMultiplier;
    }
  }
}
