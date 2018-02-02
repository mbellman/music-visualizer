import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { EffectTypes } from '@core/Visualization/Types';
import { Implementation, Override } from '@base';
import { IPoolable } from '@core/Pool';

export default class Fill extends Effect implements IPoolable<Fill> {
  public readonly type: EffectTypes = EffectTypes.FILL;
  private _color: string;

  @Implementation
  public construct (color: string): this {
    this._color = color;

    return this;
  }

  @Override
  public destruct (): void {
    super.destruct();

    this._color = null;
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.FILL_COLOR, this._color);
    canvas.fill();
  }
}
