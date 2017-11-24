import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Bar from 'AppBase/Visualization/Effects/Bar';
import Effect from 'AppBase/Visualization/Effects/Effect';
import { Utils } from 'Base/Core';
import { IColor } from 'AppBase/Visualization/Types';
import { IHashMap } from 'Base/Types';

interface IVisualizerConfiguration {
  framerate?: 30 | 60;
  tempo?: number;
}

type EffectFactory<T extends Effect = Effect> = (...args: any[]) => T;
type EffectGroup = Effect[];

export default class Visualizer {
  private _canvas: Canvas;
  private _effectPresets: IHashMap<EffectFactory[]> = {};
  private _effectGroups: EffectGroup[] = [];
  private _isRunning: boolean = false;
  private _lastTick: number;

  private _configuration: IVisualizerConfiguration = {
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

  public configure (configuration: IVisualizerConfiguration): void {
    Object.keys(configuration).forEach((key: keyof IVisualizerConfiguration) => {
      this._configuration[key] = configuration[key];
    });
  }

  public createEffect (name: string, effectFactories: EffectFactory[]): void {
    this._effectPresets[name] = effectFactories;
  }

  public run (): void {
    this._isRunning = true;
    this._lastTick = Date.now();

    this._render();
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width, height);
  }

  public spawnEffect (name: string, ...args: any[]): void {
    const effectFactories: EffectFactory[] = this._effectPresets[name];
    const effectGroup: EffectGroup = [];

    for (const effectFactory of effectFactories) {
      const effect: Effect = effectFactory.apply(null, args);

      effectGroup.push(effect);
    }

    this._effectGroups.push(effectGroup);
  }

  public stop (): void {
    this._isRunning = false;
  }

  private _render (): void {
    if (!this._isRunning) {
      return;
    }

    this._canvas.clear();

    const dt: number = (Date.now() - this._lastTick) / 1000;
    this._lastTick = Date.now();

    for (const effectGroup of this._effectGroups) {
      this._canvas.save();

      for (const effect of effectGroup) {
        effect.update(dt, this.tempo);
        effect.draw(this._canvas);
      }

      this._canvas.restore();
    }

    requestAnimationFrame(this._render);
  }
}
