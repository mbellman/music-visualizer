import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect from 'AppBase/Visualization/Effects/Effect';
import Shape from 'AppBase/Visualization/Shapes/Shape';
import VisualizerNote from 'AppBase/Visualization/VisualizerNote';
import { IHashMap } from 'Base/Types';
import { Utils } from 'Base/Core';

type ShapeFactory<T extends Shape = Shape> = (...args: any[]) => T | T[];

interface IVisualizerConfiguration {
  framerate?: 30 | 60;
  tempo?: number;
}

export default class Visualizer {
  private _canvas: Canvas;
  private _garbageCollectionCounter: number = 50;
  private _isRunning: boolean = false;
  private _lastTick: number;
  private _shapeFactories: IHashMap<ShapeFactory> = {};
  private _visualizerNotes: VisualizerNote[] = [];

  private _configuration: IVisualizerConfiguration = {
    framerate: 60,
    tempo: 100
  };

  public constructor (element: HTMLCanvasElement) {
    Utils.bindAll(this, '_tick');

    this._canvas = new Canvas(element);
  }

  public get height (): number {
    return this._canvas.height;
  }

  public get tempo (): number {
    return this._configuration.tempo;
  }

  public get width (): number {
    return this._canvas.width;
  }

  public configure (configuration: IVisualizerConfiguration): void {
    Object.keys(configuration).forEach((key: keyof IVisualizerConfiguration) => {
      this._configuration[key] = configuration[key];
    });
  }

  public define (name: string, shapeFactory: ShapeFactory): void {
    this._shapeFactories[name] = shapeFactory;
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
    const shapeFactory: ShapeFactory = this._shapeFactories[name];
    const shapes: Shape[] = shapeFactory.apply(null, args);
    const visualizerNote: VisualizerNote = new VisualizerNote(shapeFactory.apply(null, args));

    this._visualizerNotes.push(visualizerNote);
  }

  public stop (): void {
    this._isRunning = false;
  }

  private _tick (): void {
    if (!this._isRunning) {
      return;
    }

    const dt: number = (Date.now() - this._lastTick) / 1000;
    this._lastTick = Date.now();

    this._canvas.clear();

    for (const visualizerNote of this._visualizerNotes) {
      visualizerNote.update(this._canvas, dt, this.tempo);
    }

    if (--this._garbageCollectionCounter === 0) {
      this._garbageCollectVisualizerNotes();
    }

    requestAnimationFrame(this._tick);
  }

  private _garbageCollectVisualizerNotes (): void {
    let i: number = 0;

    while (i < this._visualizerNotes.length) {
      const visualizerNote: VisualizerNote = this._visualizerNotes[i];

      if (visualizerNote.isOffscreen()) {
        this._visualizerNotes.splice(i, 1);

        continue;
      }

      i++;
    }

    this._garbageCollectionCounter = 50;
  }
}
