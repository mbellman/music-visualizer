import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { EffectTypes } from '@core/Visualization/Types';
import { Implementation, Override } from '@base';
import { IPoolable } from '@core/Pool';

export default class Stroke extends Effect implements IPoolable<Stroke> {
  public readonly type: EffectTypes = EffectTypes.STROKE;
  private _color: string;
  private _width: number;

  @Implementation
  public construct (color: string, width: number): this {
    this._color = color;
    this._width = width;

    return this;
  }

  @Override
  public destruct (): void {
    super.destruct();

    this._color = null;
    this._width = null;
  }

  @Implementation
  public update (canvas: Canvas): void {
    canvas.set(DrawSetting.STROKE_COLOR, this._color);
    canvas.set(DrawSetting.STROKE_WIDTH, this._width);
    canvas.stroke();
  }
}
