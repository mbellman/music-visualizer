import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import CustomizerManager from '@core/Visualization/CustomizerManager';
import Note from '@core/MIDI/Note';
import NoteQueue, { IQueuedNote } from '@core/Visualization/NoteQueue';
import Prerenderer from '@core/Visualization/Prerenderer';
import Sequence from '@core/MIDI/Sequence';
import Shape from '@core/Visualization/Shapes/Shape';
import ShapeFactory from '@core/Visualization/ShapeFactory';
import { Bind } from '@base';
import { EffectTypes, ICustomizer } from '@core/Visualization/Types';

export default class Visualizer {
  public static readonly EFFECT_TYPES: EffectTypes[] = [
    EffectTypes.GLOW,
    EffectTypes.FILL,
    EffectTypes.STROKE
  ];

  public static readonly NOTE_SPREAD_FACTOR: number = 1.3;
  public static readonly PER_FRAME_DESPAWN_MAXIMUM: number = 20;
  public static readonly TICK_CONSTANT: number = 0.01667;
  private _canvas: Canvas;
  private _currentBeat: number = 0;
  private _customizerManager: CustomizerManager;
  private _isRunning: boolean = false;
  private _lastTick: number;
  private _noteQueue: NoteQueue;
  private _prerenderer: Prerenderer = new Prerenderer();
  private _refreshingCanvas: Canvas = new Canvas();
  private _scrollX: number = 0;
  private _sequence: Sequence;
  private _shapeFactory: ShapeFactory;
  private _shapes: Shape[] = [];

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
    const { tempo } = this._customizerManager.getCustomizerSettings();

    return tempo;
  }

  public get width (): number {
    return this._canvas.width;
  }

  public pause (): void {
    this._isRunning = false;
  }

  public restart (): void {
    this.stop();

    this._noteQueue = new NoteQueue(this._sequence);

    this.run();
  }

  public run (): void {
    this._isRunning = true;
    this._lastTick = Date.now();

    this._tick();
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width, height);
    this._refreshingCanvas.setSize(width, height);
    this._prerenderer.setSize(width, height);
  }

  public stop (): void {
    for (const shape of this._shapes) {
      this._shapeFactory.return(shape);
    }

    this._canvas.clear();
    this._refreshingCanvas.clear();
    this._prerenderer.clear();

    this._currentBeat = 0;
    this._isRunning = false;
    this._noteQueue = null;
    this._scrollX = 0;
    this._shapes.length = 0;
  }

  public visualize (sequence: Sequence, customizer: ICustomizer): void {
    const { tempo } = customizer.settings;

    this._customizerManager = new CustomizerManager(customizer);
    this._noteQueue = new NoteQueue(sequence);
    this._sequence = sequence;
    this._shapeFactory = new ShapeFactory(this._customizerManager);

    this.run();
  }

  private _compositeScene (): void {
    this._canvas.clear();

    this._prerenderer.superimpose(this._canvas);
    this._canvas.image(this._refreshingCanvas.element, 0, 0);
  }

  private _despawnPrerenderedShapes (): void {
    let i: number = 0;

    while (i < Math.min(this._shapes.length, Visualizer.PER_FRAME_DESPAWN_MAXIMUM)) {
      const shape: Shape = this._shapes[i];

      if (shape.isPrerendered()) {
        const removedShape: Shape = this._shapes.splice(i, 1)[0];

        this._shapeFactory.return(removedShape);

        continue;
      }

      i++;
    }
  }

  private _getScrollSpeedFactor (): number {
    const { scrollSpeed } = this._customizerManager.getCustomizerSettings();

    return scrollSpeed / 100;
  }

  /**
   * Draws a Shape to the refreshing Canvas, rather than
   * prerendering it. When the current scroll X is beyond
   * the width of the Visualizer, we need to offset the
   * Shape back into view; otherwise we just need to offset
   * it from the right edge in proportion to the current
   * scroll offset. In both cases the goal is to keep it
   * aligned with what exists on the Prendererer Canvas.
   */
  private _refreshShape (shape: Shape): void {
    if (this._scrollX > this.width) {
      shape.offsetX = -1 * (this._scrollX - this.width);
    } else {
      shape.offsetX = this.width - this._scrollX;
    }

    shape.render(this._refreshingCanvas);
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

    this._currentBeat += this._customizerManager.getBeatsPerSecond() * dt;
    this._lastTick = time;

    this._updateScroll(dt);
    this._updateShapes(dt);
    this._compositeScene();
    this._runShapeSpawnCheck();
    this._despawnPrerenderedShapes();

    requestAnimationFrame(this._tick);
  }

  private _updateScroll (dt: number): void {
    this._scrollX += dt * this.tempo * this._getScrollSpeedFactor();

    this._prerenderer.scrollTo(this._scrollX);
  }

  private _updateShapes (dt: number): void {
    this._refreshingCanvas.clear();

    for (const shape of this._shapes) {
      shape.tick(dt);

      if (shape.shouldRefresh) {
        this._refreshShape(shape);
      } else if (shape.shouldPrerender) {
        this._prerenderer.prerender(shape);
      }
    }
  }
}
