import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import { EffectTypes } from '@core/Visualization/Types';
import { Implementation } from '@base';
import { IPoolable } from '@core/Pool';

export default abstract class Effect implements IPoolable<Effect> {
  public abstract readonly type: EffectTypes;
  private _age: number = 0;
  private _delay: number = 0;

  public get delayedAge (): number {
    return Math.max(this._age - this._delay, 0);
  }

  public age (amount: number): void {
    this._age += amount;
  }

  public abstract construct (...args: any[]): this;

  public delay (delay: number): this {
    this._delay = delay;

    return this;
  }

  @Implementation
  public destruct (): void {
    this._age = 0;
    this._delay = 0;
  }

  public isDelaying (): boolean {
    return this.delayedAge === 0;
  }

  public abstract update (canvas: Canvas, dt: number): void;
}
