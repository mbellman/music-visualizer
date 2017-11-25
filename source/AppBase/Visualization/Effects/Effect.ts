import Canvas from 'Graphics/Canvas';
import Visualizer from 'AppBase/Visualizer';
import { IColor } from 'AppBase/Visualization/Types';

export default abstract class Effect {
  protected color: string;
  private _isExpired: boolean = false;
  private _startTime: number = Date.now();

  public constructor (color: IColor, ...args: any[]) {
    const { R, G, B } = color;

    this.color = `rgb(${R}, ${G}, ${B})`;
    this._startTime = Date.now();
  }

  public get age (): number {
    return Date.now() - this._startTime;
  }

  public get isExpired (): boolean {
    return this._isExpired;
  }

  protected expire (): void {
    this._isExpired = true;
  }

  public abstract draw (canvas: Canvas): void;
  public abstract update (dt: number, tempo: number): void;
}
