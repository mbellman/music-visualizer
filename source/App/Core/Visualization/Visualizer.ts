import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import ChannelEventQueue, { IQueuedChannelEvent } from '@core/Visualization/ChannelEventQueue';
import CustomizerManager from '@core/Visualization/CustomizerManager';
import Prerenderer from '@core/Visualization/Prerenderer';
import Sequence from '@core/MIDI/Sequence';
import Shape from '@core/Visualization/Shapes/Shape';
import ShapeFactory from '@core/Visualization/ShapeFactory';
import { Bind } from '@base';
import { EffectTypes, ICustomizer } from '@core/Visualization/Types';
import { setTimeout } from 'core-js/library/web/timers';
import { MidiEventType, MetaEventType, INoteEvent, ITempoEvent } from '@core/MIDI/Types';

export default class Visualizer {
  public static readonly EFFECT_TYPES: EffectTypes[] = [
    EffectTypes.GLOW,
    EffectTypes.FILL,
    EffectTypes.STROKE
  ];

  /**
   * The delay in milliseconds before every render/frame download
   * cycle when {{_shouldDownloadFrames}} is set to true.
   */
  public static readonly FRAME_DOWNLOAD_DELAY: number = 150;

  public static readonly PER_FRAME_DESPAWN_MAXIMUM: number = 20;
  public static readonly TICK_CONSTANT: number = (1000 / 60) / 1000;
  private _canvas: Canvas;
  private _channelEventQueue: ChannelEventQueue;
  private _currentBeat: number = 0;
  private _currentTempo: number;
  private _customizerManager: CustomizerManager;
  private _frame: number = 0;
  private _imageDataLink: HTMLAnchorElement = document.createElement('a');
  private _isRunning: boolean = false;
  private _lastTick: number;
  private _prerenderer: Prerenderer = new Prerenderer();
  private _refreshingCanvas: Canvas = new Canvas();
  private _scrollX: number = 0;
  private _sequence: Sequence;
  private _shapeFactory: ShapeFactory;
  private _shapes: Shape[] = [];

  /**
   * Determines whether the Visualizer should render and save frames
   * to disk every {{FRAME_DOWNLOAD_DELAY}} milliseconds. If false,
   * the Visualizer runs in real time and only renders the scene,
   * without triggering frame downloads.
   */
  private _shouldDownloadFrames: boolean = false;

  public constructor (element: HTMLCanvasElement) {
    this._canvas = new Canvas(element);
  }

  public get height (): number {
    return this._canvas.height;
  }

  public get isRunning (): boolean {
    return this._isRunning;
  }

  public get width (): number {
    return this._canvas.width;
  }

  public getBeatsPerSecond (): number {
    return this.getTempo() / 60;
  }

  public getPixelsPerBeat (): number {
    return this.getPixelsPerSecond() / this.getBeatsPerSecond();
  }

  public getPixelsPerSecond (): number {
    const { scrollSpeed } = this._customizerManager.getCustomizerSettings();

    return Visualizer.TICK_CONSTANT * 60 * this.getTempo() * (scrollSpeed / 100);
  }

  public getTempo (): number {
    const { tempoFactor } = this._customizerManager.getCustomizerSettings();

    return this._currentTempo * (tempoFactor / 100);
  }

  public pause (): void {
    this._isRunning = false;
  }

  public restart (): void {
    this.stop();

    this._channelEventQueue = new ChannelEventQueue(this._sequence);

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

  public startDownloadingFrames (): void {
    this._shouldDownloadFrames = true;
  }

  public stop (): void {
    for (const shape of this._shapes) {
      this._shapeFactory.return(shape);
    }

    this._canvas.clear();
    this._refreshingCanvas.clear();
    this._prerenderer.clear();

    this._currentBeat = 0;
    this._frame = 0;
    this._isRunning = false;
    this._channelEventQueue = null;
    this._scrollX = 0;
    this._shapes.length = 0;
  }

  public visualize (sequence: Sequence, customizer: ICustomizer): void {
    this._customizerManager = new CustomizerManager(customizer);
    this._channelEventQueue = new ChannelEventQueue(sequence);
    this._sequence = sequence;
    this._shapeFactory = new ShapeFactory(this, this._customizerManager);

    this.run();
  }

  private _compositeScene (): void {
    const { backgroundColor } = this._customizerManager.getCustomizerSettings();
    const { width, height } = this._canvas;

    this._canvas
      .set(DrawSetting.FILL_COLOR, '#' + backgroundColor)
      .rectangle(0, 0, width, height)
      .fill();

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

  private _downloadFrame (): void {
    const imageData: string = this._canvas.element.toDataURL();
    const filename: string = 'frame_' + `${this._frame}`.padStart(5, '0');

    this._imageDataLink.href = imageData;
    this._imageDataLink.download = filename;

    this._imageDataLink.click();
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

  private _takeNextChannelEvents (): void {
    let queuedChannelEvent: IQueuedChannelEvent;

    while (queuedChannelEvent = this._channelEventQueue.takeNextUpTo(this._currentBeat)) {
      const { channelEvent, channelIndex } = queuedChannelEvent;

      switch (channelEvent.type) {
        case MidiEventType.NOTE_ON:
          const shape: Shape = this._shapeFactory.request(channelIndex, channelEvent as INoteEvent);

          if (shape) {
            this._shapes.push(shape);
          }
          break;
        case MetaEventType.TEMPO:
          const { tempo } = channelEvent as ITempoEvent;

          this._currentTempo = tempo;
          break;
      }
    }
  }

  @Bind
  private _tick (): void {
    if (!this._isRunning) {
      return;
    }

    const time: number = Date.now();
    const dt: number = this._shouldDownloadFrames ? Visualizer.TICK_CONSTANT : (time - this._lastTick) / 1000;

    this._frame++;
    this._lastTick = time;

    if (this._currentTempo) {
      // The first channel tempo event object has been read
      // and set on {{_currentTempo}}, so we can safely start
      // advancing the beat + scroll position
      this._currentBeat += this.getBeatsPerSecond() * dt;

      this._updateScroll(dt);
    }

    this._updateShapes(dt);
    this._compositeScene();
    this._takeNextChannelEvents();
    this._despawnPrerenderedShapes();

    if (this._shouldDownloadFrames) {
      this._downloadFrame();

      setTimeout(this._tick, Visualizer.FRAME_DOWNLOAD_DELAY);
    } else {
      requestAnimationFrame(this._tick);
    }
  }

  private _updateScroll (dt: number): void {
    this._scrollX += dt * this.getTempo() * this._getScrollSpeedFactor();

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
