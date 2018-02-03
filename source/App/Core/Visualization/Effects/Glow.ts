import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { EffectTypes } from '@core/Visualization/Types';
import { Implementation, Override } from '@base';
import { IPoolable } from '@core/Pool';

export default class Glow extends Effect implements IPoolable<Glow> {
  public type: EffectTypes = EffectTypes.GLOW;
  private _blur: number;
  private _color: string;
  private _fadeInTime: number = 0;
  private _fadeOutTime: number = 0;

  @Implementation
  public construct (color: string, blur: number = 5): this {
    this._color = color;
    this._blur = blur;

    return this;
  }

  @Override
  public destruct (): void {
    super.destruct();

    this._blur = null;
    this._color = null;
    this._fadeInTime = 0;
    this._fadeOutTime = 0;
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
  public draw (canvas: Canvas): void {
    const blurAmount: number = this._getBlurAmount();

    canvas.set(DrawSetting.GLOW_COLOR, this._color);
    canvas.set(DrawSetting.GLOW_BLUR, blurAmount);
  }

  @Override
  public tick (dt: number): void {
    if (this.activeAge < this._fadeInTime + this._fadeOutTime) {
      // Glow cannot be prerendered yet, as it is still fading in or out
      this.flagShapeForRefreshing();
    } else if (!this.isPrerendered) {
      // Glow will remain constant from here on out, so it's safe to prerender
      this.flagShapeForPrerendering();
    }
  }

  private _getBlurAmount (): number {
    const shouldUseDefault: boolean = (this.activeAge > this._fadeInTime) && this._fadeOutTime === 0;
    const hasFadedOut: boolean = !shouldUseDefault && this.activeAge > (this._fadeInTime + this._fadeOutTime);

    if (shouldUseDefault) {
      return this._blur;
    } else if (hasFadedOut) {
      return 0;
    } else {
      return this._blur * this._getBlurMultiplier();
    }
  }

  private _getBlurMultiplier (): number {
    const elapsedFadeOutTime: number = this.activeAge - this._fadeInTime;

    return this._isFadingIn() ? (this.activeAge / this._fadeInTime) : 1 - (elapsedFadeOutTime / this._fadeOutTime);
  }

  private _isFadingIn (): boolean {
    return this.activeAge < this._fadeInTime;
  }
}
