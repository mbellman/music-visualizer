import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Bar from 'AppBase/Visualization/Effects/Bar';
import Effect from 'AppBase/Visualization/Effects/Effect';
import EffectSpawn from 'AppBase/Visualization/EffectSpawn';
import { IColor } from 'AppBase/Visualization/Types';
import { IHashMap } from 'Base/Types';
import { Utils } from 'Base/Core';
import { setTimeout } from 'core-js/library/web/timers';

type EffectFactory<T extends Effect = Effect> = (...args: any[]) => T;

interface IEffectPreset {
  effects: EffectFactory[];
  primary?: number;
}

interface IVisualizerConfiguration {
  framerate?: 30 | 60;
  tempo?: number;
}

export default class Visualizer {
  private _canvas: Canvas;
  private _effectPresets: IHashMap<IEffectPreset> = {};
  private _effectSpawns: EffectSpawn[] = [];
  private _isRunning: boolean = false;
  private _lastTick: number;

  private _configuration: IVisualizerConfiguration = {
    framerate: 60,
    tempo: 100
  };

  public constructor (element: HTMLCanvasElement) {
    Utils.bindAll(this, '_tick');

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

  public define (presetName: string, preset: IEffectPreset): void {
    this._effectPresets[presetName] = preset;
  }

  public run (): void {
    this._isRunning = true;
    this._lastTick = Date.now();

    this._tick();
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width, height);
  }

  public spawn (name: string, ...args: any[]): void {
    const { effects: effectFactories, primary } = this._effectPresets[name];
    const effects: Effect[] = [];

    for (const effectFactory of effectFactories) {
      const effect: Effect = effectFactory.apply(null, args);

      effects.push(effect);
    }

    this._effectSpawns.push(new EffectSpawn(effects, primary));
  }

  public stop (): void {
    this._isRunning = false;
  }

  private _tick (): void {
    if (!this._isRunning) {
      return;
    }

    const dt: number = (Date.now() - this._lastTick) / 1000;
    let i: number = 0;

    this._canvas.clear();

    while (i < this._effectSpawns.length) {
      const effectSpawn: EffectSpawn = this._effectSpawns[i];

      effectSpawn.update(dt, this.tempo);

      if (effectSpawn.isExpired) {
        this._effectSpawns.splice(i, 1);

        continue;
      }

      effectSpawn.draw(this._canvas);
      i++;
    }

    this._lastTick = Date.now();

    requestAnimationFrame(this._tick);
  }
}
