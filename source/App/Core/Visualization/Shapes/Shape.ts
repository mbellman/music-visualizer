import Canvas from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { Implementation } from '@base';
import { IPoolable } from '@core/Pool';
import { ShapeTypes } from '@core/Visualization/Types';

export default abstract class Shape implements IPoolable<Shape> {
  public abstract readonly type: ShapeTypes;
  protected offsetX: number = 0;
  protected offsetY: number = 0;
  protected x: number = 0;
  protected y: number = 0;
  private _age: number = 0;
  private _effects: Effect[] = [];

  protected get pixelX (): number {
    return this.x + this.offsetX;
  }

  protected get pixelY (): number {
    return this.y + this.offsetY;
  }

  public get effects (): Effect[] {
    return this._effects;
  }

  @Implementation
  public construct (x: number, y: number, ...args: any[]): this {
    this.x = x;
    this.y = y;

    return this;
  }

  @Implementation
  public destruct (): void {
    this.offsetX = 0;
    this.offsetY = 0;
    this.x = 0;
    this.y = 0;
    this._age = 0;
    this._effects.length = 0;
  }

  public abstract draw (canvas: Canvas): void;
  public abstract isOffscreen (): boolean;

  public move (x: number = 0, y: number = 0): void {
    this.offsetX += x;
    this.offsetY += y;
  }

  public pipe (effect: Effect): this {
    this._effects.push(effect);

    return this;
  }

  public update (canvas: Canvas, dt: number): void {
    const ageIncrease: number = dt * 1000;
    this._age += ageIncrease;

    this.draw(canvas);

    for (let i = 0; i < this._effects.length; i++) {
      const effect = this._effects[i];

      effect.age(ageIncrease);

      if (!effect.isDelaying()) {
        effect.update(canvas, dt);
      }
    }
  }
}
