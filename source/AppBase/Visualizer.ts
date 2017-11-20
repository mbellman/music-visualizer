import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Bar from 'AppBase/Visualization/Effects/Bar';
import Effect from 'AppBase/Visualization/Effects/Effect';
import { Utils } from 'Base/Core';

interface IConfiguration {
  framerate?: 30 | 60;
  tempo?: number;
}

export default class Visualizer {
  private _canvas: Canvas;
  private _effects: Effect[] = [];

  private _configuration: IConfiguration = {
    framerate: 60,
    tempo: 100
  };

  public constructor (element: HTMLCanvasElement) {
    Utils.bindAll(this, '_render');

    this._canvas = new Canvas(element);
  }

  public get tempo (): number {
    return this._configuration.tempo;
  }

  public configure (configuration: IConfiguration): void {
    Object.keys(configuration).forEach((key: keyof IConfiguration) => {
      this._configuration[key] = configuration[key];
    });
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width, height);
  }

  public addBar (y: number): void {
    const topPixel: number = Math.round(this._canvas.height * (y / 100));

    this._effects.push(new Bar());
  }

  private _render (): void {

  }
}
