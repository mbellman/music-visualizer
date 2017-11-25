import Canvas from 'Graphics/Canvas';
import Effect from 'AppBase/Visualization/Effects/Effect';

export default class EffectSpawn {
  private _effects: Effect[] = [];
  private _isExpired: boolean = false;
  private _primaryEffectIndex: number;

  public constructor (effects: Effect[], primaryEffectIndex: number = 1) {
    this._effects = effects;
    this._primaryEffectIndex = primaryEffectIndex;
  }

  public get isExpired (): boolean {
    return this._isExpired;
  }

  public draw (canvas: Canvas): void {
    canvas.save();

    for (const effect of this._effects) {
      effect.draw(canvas);
    }

    canvas.restore();
  }

  public update (dt: number, tempo: number): void {
    for (let i = 0; i < this._effects.length; i++) {
      const effect: Effect = this._effects[i];

      effect.update(dt, tempo);

      if (i === (this._primaryEffectIndex - 1) && effect.isExpired) {
        this._isExpired = true;

        break;
      }
    }
  }
}
