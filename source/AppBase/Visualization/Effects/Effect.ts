import Canvas from 'Graphics/Canvas';
import Visualizer from 'AppBase/Visualizer';
import { IColor } from 'AppBase/Visualization/Types';

export default abstract class Effect {
  protected color: IColor;
  private _startTime: number = Date.now();

  public constructor (color: IColor, ...args: any[]) {
    this.color = color;
    this._startTime = Date.now();
  }

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public abstract draw (canvas: Canvas): void;
  public abstract update (dt: number, tempo: number): void;
}
