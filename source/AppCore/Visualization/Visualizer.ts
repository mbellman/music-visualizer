import Canvas, { DrawSetting } from 'Graphics/Canvas';
import Effect from 'AppCore/Visualization/Effects/Effect';
import Sequence from 'AppCore/MIDI/Sequence';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import VisualizerNote from 'AppCore/Visualization/VisualizerNote';
import { Map, Utils } from 'Base/Core';

type ShapeFactory<T extends Shape = Shape> = (...args: any[]) => T | T[];

interface IVisualizerConfiguration {
  framerate?: 30 | 60;
  tempo?: number;
}

export default class Visualizer {
  public static readonly GARBAGE_COLLECTION_DELAY: number = 50;
  public static readonly FRAME_DELTA: number = 0.01667;
  private _bufferCanvas: Canvas = new Canvas();
  private _canvas: Canvas;
  private _frame: number = 0;
  private _garbageCollectionCounter: number = Visualizer.GARBAGE_COLLECTION_DELAY;
  private _isRunning: boolean = false;
  private _shapeFactories: Map<string, ShapeFactory> = new Map();
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
    this._shapeFactories.set(name, shapeFactory);
  }

  public run (): void {
    this._isRunning = true;

    this._tick();
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width, height);
    this._bufferCanvas.setSize(width, height);
  }

  public spawn (name: string, ...args: any[]): void {
    const shapeFactory: ShapeFactory = this._shapeFactories.get(name);
    const shapes: Shape[] = shapeFactory.apply(null, args);
    const visualizerNote: VisualizerNote = new VisualizerNote(shapes);

    this._visualizerNotes.push(visualizerNote);
  }

  public stop (): void {
    this._canvas.clear();

    this._isRunning = false;
  }

  public visualize (sequence: Sequence): void {
    const { tempo } = sequence;

    this.configure({ tempo });
    this.run();

    const { width, height } = this;
    const visualizerHeightRatio: number = height / 100;
    const heightToPitchRatio: number = 100 / 127;
    const spreadFactor: number = 1.5;
    const pixelsPerSecond: number = 60 * 0.01667 * tempo;
    const beatsPerSecond: number = tempo / 60;
    const pixelsPerBeat: number = pixelsPerSecond / beatsPerSecond;
    const defaultEffect: string = this._shapeFactories.keys()[0];

    for (const channel of sequence.channels()) {
      for (const note of channel.notes()) {
        window.setTimeout(() => {
          const noteX: number = width;
          const noteY: number = (127 - note.pitch) * heightToPitchRatio * visualizerHeightRatio * spreadFactor - height / 3;

          this.spawn(defaultEffect, noteX, noteY, note.duration * pixelsPerBeat, 12);
        }, 1000 * note.delay / beatsPerSecond);
      }
    }
  }

  private _tick (): void {
    if (!this._isRunning) {
      return;
    }

    if (this._configuration.framerate === 30) {
      this._render30fps();
    } else {
      this._render60fps();
    }

    if (this._frame % Visualizer.GARBAGE_COLLECTION_DELAY === 0) {
      this._garbageCollectVisualizerNotes();
    }

    this._frame++;

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

    this._garbageCollectionCounter = Visualizer.GARBAGE_COLLECTION_DELAY;
  }

  private _render30fps (): void {
    const isRenderingFrame: boolean = this._frame % 2 === 0;
    const halfwayIndex: number = Math.floor(this._visualizerNotes.length / 2);
    const startIndex: number = isRenderingFrame ? halfwayIndex : 0;
    const endIndex: number = isRenderingFrame ? this._visualizerNotes.length : halfwayIndex;

    for (let i = startIndex; i < endIndex; i++) {
      const visualizerNote: VisualizerNote = this._visualizerNotes[i];

      visualizerNote.update(this._bufferCanvas, 2 * Visualizer.FRAME_DELTA, this.tempo);
    }

    if (isRenderingFrame) {
      this._canvas.clear();
      this._canvas.image(this._bufferCanvas.element, 0, 0);
      this._bufferCanvas.clear();
    }
  }

  private _render60fps (): void {
    this._canvas.clear();

    for (const visualizerNote of this._visualizerNotes) {
      visualizerNote.update(this._canvas, Visualizer.FRAME_DELTA, this.tempo);
    }
  }
}
