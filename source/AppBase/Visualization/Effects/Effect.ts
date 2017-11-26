import Canvas from 'Graphics/Canvas';
import Shape from 'AppBase/Visualization/Shapes/Shape';

export enum EffectType {
  PRE,
  POST
}

export default abstract class Effect {
  public abstract readonly type: EffectType;
  private _delay: number = 0;
  private _startTime: number = Date.now();

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public delay (delay: number): this {
    this._delay = delay;

    return this;
  }

  public abstract update (canvas: Canvas, shape: Shape, dt: number, tempo: number): void;
}
