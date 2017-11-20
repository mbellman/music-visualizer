import Visualizer from 'AppBase/Visualizer';

export default abstract class Effect {
  private _startTime: number = Date.now();

  public constructor () {
    this._startTime = Date.now();
  }

  public get age (): number {
    return Date.now() - this._startTime;
  }

  protected abstract onUpdate (visualizer: Visualizer): void;
}
