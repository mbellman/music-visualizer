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
  private _prerenderingCanvas: Canvas = new Canvas();
  private _refreshingCanvas: Canvas = new Canvas();
  private _scrollOffset: number = 0;
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
    this._prerenderingCanvas.setSize(3 * width, height);
  }

  public stop (): void {
    for (const shape of this._shapes) {
      this._shapeFactory.return(shape);
    }

    this._canvas.clear();
    this._refreshingCanvas.clear();
    this._prerenderingCanvas.clear();

    this._currentBeat = 0;
    this._isRunning = false;
    this._scrollOffset = 0;
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

    this._canvas.image(
      this._prerenderingCanvas.element, this._getPrerenderingCanvasClipX(), 0, this.width, this.height,
      this._getPrerenderingCanvasDestinationX(), 0, this.width, this.height
    );

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

  /**
   * Determines the X coordinate at which to start clipping the prerendering Canvas
   * for superimposition onto the main Canvas. Until the scroll offset exceeds the
   * Visualizer width, this value will remain at 0. From there it will increase in
   * proportion to the scroll offset.
   */
  private _getPrerenderingCanvasClipX (): number {
    return Math.max(0, this._scrollOffset - this.width);
  }

  /**
   * Determines the X coordinate at which to superimpose the prerendering Canvas
   * onto the main Canvas. This value starts starts out as the Visualizer width
   * value, decreases to 0 as the scroll offset increases, and stops at 0 once
   * the scroll offset exceeds the width.
   */
  private _getPrerenderingCanvasDestinationX (): number {
    return Math.max(0, this.width - this._scrollOffset);
  }

  private _getScrollSpeedFactor (): number {
    const { scrollSpeed } = this._customizerManager.getCustomizerSettings();

    return scrollSpeed / 100;
  }

  /**
   * Determines the X offset for a Shape rendered on the refreshing Canvas. The
   * offset value displaces the Shape from its initial X coordinate, and does not
   * represent its actual pixel coordinate value. While the scroll offset is less
   * than the Visualizer width, and while the prerendering Canvas is being scrolled
   * into view, we want this offset to equal the prerendering Canvas destination X
   * coordinate to ensure refreshed Shapes align with prerendered Shapes. Once the
   * scroll offset exceeds the Visualizer width, we need to offset any refreshing
   * Shapes backward in proportion to the prerendering Canvas clip X coordinate as
   * to maintain that alignment; otherwise, refreshed Shapes would render further
   * and further to the right until they disappeared from view.
   */
  private _getRefreshingShapeOffsetX (): number {
    if (this._scrollOffset < this.width) {
      return this._getPrerenderingCanvasDestinationX();
    } else {
      return -1 * this._getPrerenderingCanvasClipX();
    }
  }

  private _renderShapeWithCanvas (shape: Shape, canvas: Canvas): void {
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

    this._currentBeat += this._customizerManager.getBeatsPerSecond() * dt;
    this._lastTick = time;
    this._scrollOffset += dt * this.tempo * this._getScrollSpeedFactor();

    this._updateShapes(dt);
    this._compositeScene();
    this._runShapeSpawnCheck();
    this._despawnPrerenderedShapes();

    requestAnimationFrame(this._tick);
  }

  private _updateShapes (dt: number): void {
    this._refreshingCanvas.clear();

    for (const shape of this._shapes) {
      shape.tick(dt);

      if (shape.shouldRefresh) {
        shape.offsetX = this._getRefreshingShapeOffsetX();

        this._renderShapeWithCanvas(shape, this._refreshingCanvas);
      } else if (shape.shouldPrerender) {
        shape.offsetX = 0;

        this._renderShapeWithCanvas(shape, this._prerenderingCanvas);
      }
    }
  }
}
