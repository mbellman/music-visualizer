import Canvas from '@core/Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';

export default abstract class Shape {
  protected offsetX: number = 0;
  protected offsetY: number = 0;
  protected x: number = 0;
  protected y: number = 0;
  private _effects: Effect[] = [];
  private _startTime: number = Date.now();

  public constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public get pixelX (): number {
    return this.x + this.offsetX;
  }

  public get pixelY (): number {
    return this.y + this.offsetY;
  }

  public pipe (effect: Effect): this {
    effect.track(this);
    this._effects.push(effect);

    return this;
  }

  public abstract draw (canvas: Canvas): void;
  public abstract isOffscreen (): boolean;

  public move (x: number = 0, y: number = 0): void {
    this.offsetX += x;
    this.offsetY += y;
  }

  public update (canvas: Canvas, dt: number, tempo: number): void {
    this.draw(canvas);

    for (const effect of this._effects) {
      if (!effect.isDelaying()) {
        effect.update(canvas, dt, tempo);
      }
    }
  }
}
