import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Note from '@core/MIDI/Note';
import NoteQueue, { IQueuedNote } from '@core/Visualization/NoteQueue';
import Sequence from '@core/MIDI/Sequence';
import Shape from '@core/Visualization/Shapes/Shape';
import ShapeFactory from '@core/Visualization/ShapeFactory';
import { Bind } from '@base';
import { EffectTypes, ICustomizer } from '@core/Visualization/Types';

interface IVisualizerConfiguration {
  scrollSpeed?: number;
  tempo?: number;
}

export default class Visualizer {
  public static readonly DESPAWN_CHECK_LIMIT: number = 20;

  public static readonly EFFECT_TYPES: EffectTypes[] = [
    EffectTypes.GLOW,
    EffectTypes.FILL,
    EffectTypes.STROKE
  ];

  public static readonly NOTE_SPREAD_FACTOR: number = 1.3;
  public static readonly TICK_CONSTANT: number = 0.01667;

  private _configuration: IVisualizerConfiguration = {
    scrollSpeed: 100,
    tempo: 100
  };

  private _currentBeat: number = 0;
  private _customizer: ICustomizer;
  private _frame: number = 0;
  private _isRunning: boolean = false;
  private _lastTick: number;
  private _noteQueue: NoteQueue;
  private _prerenderingCanvas: Canvas = new Canvas();
  private _refreshingCanvas: Canvas;
  private _sequence: Sequence;
  private _shapeFactory: ShapeFactory;
  private _shapes: Shape[] = [];

  public constructor (element: HTMLCanvasElement) {
    this._refreshingCanvas = new Canvas(element);
  }

  public get height (): number {
    return this._refreshingCanvas.height;
  }

  public get isRunning (): boolean {
    return this._isRunning;
  }

  public get tempo (): number {
    return this._configuration.tempo;
  }

  public get width (): number {
    return this._refreshingCanvas.width;
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
    for (const shape of this._shapes) {
      this._shapeFactory.return(shape);
    }

    this.stop();
    this.visualize(this._sequence, this._customizer);
  }

  public run (): void {
    this._isRunning = true;
    this._lastTick = Date.now();

    this._tick();
  }

  public setSize (width: number, height: number): void {
    this._refreshingCanvas.setSize(width, height);
    this._prerenderingCanvas.setSize(3 * width, height);
  }

  public stop (): void {
    this._refreshingCanvas.clear();
    this._prerenderingCanvas.clear();

    this._currentBeat = 0;
    this._isRunning = false;
    this._shapes.length = 0;
  }

  public visualize (sequence: Sequence, customizer: ICustomizer): void {
    const { tempo } = customizer.settings;

    this._customizer = customizer;
    this._noteQueue = new NoteQueue(sequence);
    this._sequence = sequence;
    this._shapeFactory = new ShapeFactory(customizer);

    this.configure({ tempo });
    this.run();
  }

  private _despawnPrerenderedShapes (): void {
    let i: number = 0;

    while (i < Math.min(this._shapes.length, Visualizer.DESPAWN_CHECK_LIMIT)) {
      const shape: Shape = this._shapes[i];

      if (shape.isPrerendered()) {
        const removedShape: Shape = this._shapes.splice(i, 1)[0];

        console.log('Removing!');

        this._shapeFactory.return(removedShape);

        continue;
      }

      i++;
    }
  }

  private _renderShapeWith (shape: Shape, canvas: Canvas): void {
    canvas.save();
    shape.render(canvas);
    canvas.restore();
  }

  private _runShapeSpawnCheck (): void {
    let queuedNote: IQueuedNote;

    while (queuedNote = this._noteQueue.takeNextBefore(this._currentBeat)) {
      const { channelIndex, note } = queuedNote;
      const shape: Shape = this._shapeFactory.request(channelIndex, note);

      if (shape) {
        this._shapes.push(shape);
      }
    }
  }

  @Bind
  private _tick (): void {
    if (!this._isRunning) {
      return;
    }

    const time: number = Date.now();
    const dt: number = (time - this._lastTick) / 1000;

    this._lastTick = time;

    this._updateShapes(dt);
    this._updateCurrentBeat(dt);
    this._runShapeSpawnCheck();
    this._despawnPrerenderedShapes();

    requestAnimationFrame(this._tick);
  }

  private _updateCurrentBeat (dt: number): void {
    const { tempo } = this._configuration;
    const beatsPerSecond: number = tempo / 60;

    this._currentBeat += beatsPerSecond * dt;
  }

  private _updateShapes (dt: number): void {
    this._refreshingCanvas.clear();

    this._refreshingCanvas.image(this._prerenderingCanvas.element, 0, 0);

    for (const shape of this._shapes) {
      shape.tick(dt);

      const { shouldPrerender, shouldRefresh } = shape;

      if (shouldPrerender) {
        this._renderShapeWith(shape, this._prerenderingCanvas);
      } else if (shouldRefresh) {
        this._renderShapeWith(shape, this._refreshingCanvas);
      }
    }
  }
}
