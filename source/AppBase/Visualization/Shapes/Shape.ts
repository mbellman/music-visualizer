import Canvas from 'Graphics/Canvas';
import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import { IColor } from 'Graphics/Types';

export default abstract class Shape {
  protected offsetX: number = 0;
  protected offsetY: number = 0;
  protected x: number = 0;
  protected y: number = 0;
  private _preEffects: Effect[] = [];
  private _postEffects: Effect[] = [];
  private _startTime: number = Date.now();

  public constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public get pixelX (): number {
    return Math.round(this.x + this.offsetX);
  }

  public get pixelY (): number {
    return Math.round(this.y + this.offsetY);
  }

  public add (effect: Effect): this {
    if (effect.type === EffectType.PRE) {
      this._preEffects.push(effect);
    } else {
      this._postEffects.push(effect);
    }

    return this;
  }

  public abstract draw (canvas: Canvas): void;
  public abstract isOffscreen (): boolean;

  public move (x: number = 0, y: number = 0): void {
    this.offsetX += x;
    this.offsetY += y;
  }

  public update (canvas: Canvas, dt: number, tempo: number): void {
    for (const effect of this._preEffects) {
      effect.update(canvas, this, dt, tempo);
    }

    this.draw(canvas);

    for (const effect of this._postEffects) {
      effect.update(canvas, this, dt, tempo);
    }
  }
}
