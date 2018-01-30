import Canvas from 'Graphics/Canvas';
import Note from '@core/MIDI/Note';
import NoteQueue, { IQueuedNote } from '@core/Visualization/NoteQueue';
import Sequence from '@core/MIDI/Sequence';
import VisualizerNote from '@core/Visualization/VisualizerNote';
import VisualizerNoteFactory from '@core/Visualization/VisualizerNoteFactory';
import { Bind } from '@base';
import { ICustomizer } from '@core/Visualization/Types';

interface IVisualizerConfiguration {
  framerate?: 30 | 60;
  scrollSpeed?: number;
  tempo?: number;
}

export default class Visualizer {
  public static readonly GARBAGE_COLLECTION_DELAY: number = 50;
  public static readonly TICK_CONSTANT: number = 0.01667;
  private _bufferCanvas: Canvas = new Canvas();
  private _canvas: Canvas;

  private _configuration: IVisualizerConfiguration = {
    framerate: 60,
    scrollSpeed: 100,
    tempo: 100
  };

  private _currentBeat: number = 0;
  private _customizer: ICustomizer;
  private _frame: number = 0;
  private _isRunning: boolean = false;
  private _lastTick: number;
  private _noteQueue: NoteQueue;
  private _sequence: Sequence;
  private _visualizerNoteFactory: VisualizerNoteFactory;
  private _visualizerNotes: VisualizerNote[] = [];

  public constructor (element: HTMLCanvasElement) {
    this._canvas = new Canvas(element);
  }

  public get height (): number {
    return this._canvas.height;
  }

  public get isRunning (): boolean {
    return this._isRunning;
  }

  public get tempo (): number {
    return this._configuration.tempo;
  }

  public get width (): number {
    return this._canvas.width;
  }

  private get _scrollSpeedFactor (): number {
    return this._configuration.scrollSpeed / 100;
  }

  public configure (configuration: IVisualizerConfiguration): void {
    this._configuration = {
      ...this._configuration,
      ...configuration
    };
  }

  public pause (): void {
    this._isRunning = false;
  }

  public restart (): void {
    this.stop();
    this.visualize(this._sequence, this._customizer);
  }

  public run (): void {
    this._isRunning = true;
    this._lastTick = Date.now();

    this._tick();
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width, height);
    this._bufferCanvas.setSize(width, height);
  }

  public stop (): void {
    this._canvas.clear();

    this._currentBeat = 0;
    this._frame = 0;
    this._isRunning = false;
    this._visualizerNotes.length = 0;
  }

  public visualize (sequence: Sequence, customizer: ICustomizer): void {
    const { tempo } = sequence;

    this._customizer = customizer;
    this._noteQueue = new NoteQueue(sequence);
    this._sequence = sequence;
    this._visualizerNoteFactory = new VisualizerNoteFactory(customizer);

    this.configure({ tempo });
    this.run();
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
  }

  private _runNoteSpawnCheck (): void {
    const queuedNotes: IQueuedNote[] = this._noteQueue.take(this._currentBeat);

    if (queuedNotes.length > 0) {
      for (const queuedNote of queuedNotes) {
        const { channelIndex, note } = queuedNote;
        const visualizerNote: VisualizerNote = this._visualizerNoteFactory.getVisualizerNote(channelIndex, note);

        this._visualizerNotes.push(visualizerNote);
      }
    }
  }

  /**
   * Renders half of the current visualization to a buffer canvas
   * on each frame, rendering the full visualization to the main
   * canvas on every even frame.
   */
  private _render30fps (dt: number): void {
    const isFullRenderStep: boolean = this._frame % 2 === 0;
    const midpoint: number = Math.floor(this._visualizerNotes.length / 2);
    const startIndex: number = isFullRenderStep ? midpoint : 0;
    const endIndex: number = isFullRenderStep ? this._visualizerNotes.length : midpoint;

    for (let i = startIndex; i < endIndex; i++) {
      const visualizerNote: VisualizerNote = this._visualizerNotes[i];

      visualizerNote.update(this._bufferCanvas, 2 * Visualizer.TICK_CONSTANT, this.tempo * this._scrollSpeedFactor);
    }

    if (isFullRenderStep) {
      this._canvas.clear();
      this._canvas.image(this._bufferCanvas.element, 0, 0);
      this._bufferCanvas.clear();

      this._updateCurrentBeat(dt);
      this._runNoteSpawnCheck();
    }
  }

  private _render60fps (dt: number): void {
    this._canvas.clear();

    for (const visualizerNote of this._visualizerNotes) {
      visualizerNote.update(this._canvas, dt, this.tempo * this._scrollSpeedFactor);
    }

    this._updateCurrentBeat(dt);
    this._runNoteSpawnCheck();
  }

  @Bind
  private _tick (): void {
    if (!this._isRunning) {
      return;
    }

    const time: number = Date.now();
    const dt: number = (time - this._lastTick) / 1000;

    this._lastTick = time;

    if (this._configuration.framerate === 30) {
      this._render30fps(dt);
    } else {
      this._render60fps(dt);
    }

    if (this._frame++ % Visualizer.GARBAGE_COLLECTION_DELAY === 0) {
      this._garbageCollectVisualizerNotes();
    }

    requestAnimationFrame(this._tick);
  }

  private _updateCurrentBeat (dt: number): void {
    const { framerate, tempo } = this._configuration;
    const beatsPerSecond: number = tempo / 60;

    this._currentBeat += beatsPerSecond * (60 / framerate) * dt;
  }
}
