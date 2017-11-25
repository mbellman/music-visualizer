import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Ease from 'AppBase/Ease';
import ScrollingEffect from 'AppBase/Visualization/Effects/ScrollingEffect';
import { IColor } from 'AppBase/Visualization/Types';
import { Override } from 'Base/Decorators';
import { Utils } from 'Base/Utils';

export default class OscillatingBall extends ScrollingEffect {
  private _drift: number;
  private _driftRatio: number = 0;
  private _oscillation: number = 0;
  private _radius: number;

  public constructor (color: IColor, top: number, radius: number, drift: number) {
    super(color);

    this.y = top;
    this._radius = radius;
    this._drift = drift;
  }

  @Override
  public draw (canvas: Canvas): void {
    super.draw(canvas);

    const pX: number = this.pX + Ease.inOutQuad(this._driftRatio) * this._drift;
    const pY: number = this.pY + this._oscillation;

    canvas.set(DrawSetting.FILL_COLOR, this.color);
    canvas.circle(pX, pY, this._radius);
    canvas.fill();
  }

  @Override
  public update (dt: number, tempo: number): void {
    super.update(dt, tempo);

    this._driftRatio = Math.min(this.age / this._getDriftTime(dt, tempo), 1);
    this._oscillation = Math.sin(20 * this._driftRatio * Math.PI) * 20 * Math.sin(this._driftRatio * Math.PI);
  }

  private _getDriftTime (dt: number, tempo: number): number {
    const totalDriftFrames: number = this._drift / (dt * Math.round(tempo / 2));

    return 1000 * dt * totalDriftFrames;
  }
}
