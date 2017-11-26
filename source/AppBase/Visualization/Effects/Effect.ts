import Canvas from 'Graphics/Canvas';
import Shape from 'AppBase/Visualization/Shapes/Shape';

export enum EffectType {
  PRE,
  POST
}

export default abstract class Effect {
  private _delay: number = 0;
  private _startTime: number = Date.now();

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public get delayedAge (): number {
    return Math.max(this.age - this._delay, 0);
  }

  public delay (delay: number): this {
    this._delay = delay;

    return this;
  }

  public isDelaying (): boolean {
    return this.delayedAge === 0;
  }

  public abstract update (canvas: Canvas, shape: Shape, dt: number, tempo: number): void;
}
