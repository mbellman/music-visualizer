import Ball from '@core/Visualization/Shapes/Ball';
import Bar from '@core/Visualization/Shapes/Bar';
import CustomizerManager from '@core/Visualization/CustomizerManager';
import Diamond from '@core/Visualization/Shapes/Diamond';
import Effect from '@core/Visualization/Effects/Effect';
import EffectFactory from '@core/Visualization/EffectFactory';
import Ellipse from '@core/Visualization/Shapes/Ellipse';
import Glow from '@core/Visualization/Effects/Glow';
import Pool, { IPoolableFactory } from '@core/Pool';
import Shape from '@core/Visualization/Shapes/Shape';
import Visualizer from '@core/Visualization/Visualizer';
import { EffectTypes, ICustomizer, IEffectTemplate, ShapeTypes } from '@core/Visualization/Types';
import { Extension, IHashMap, Implementation } from '@base';
import { INoteEvent } from '@core/MIDI/Types';

export default class ShapeFactory implements IPoolableFactory<Shape> {
  public static readonly MAX_NOTE_PITCH: number = 127;

  /**
   * An additional X offset buffer to apply to all Shapes on construction,
   * ensuring that Notes with 0 delay aren't rendered and potentially
   * clipped on the left edge of the Prerenderer Canvas.
   */
  public static readonly SHAPE_X_BUFFER: number = 10;

  private _customizerManager: CustomizerManager;
  private _effectFactory: EffectFactory = new EffectFactory();

  /**
   * Maps channel indexes to arrays of selected effect templates for
   * each particular channel. The cache is built at the beginning
   * of visualizer playback, avoiding any unnecessary overhead when
   * new Shapes are generated and only *selected* effect templates
   * for a channel need to be looped through to create new Effect
   * instances.
   */
  private _selectedTemplateCache: IHashMap<IEffectTemplate[]> = {};

  private _shapePools: IHashMap<Pool<Shape>> = {
    [ShapeTypes.BALL]: new Pool(Ball, 250),
    [ShapeTypes.BAR]: new Pool(Bar, 250),
    [ShapeTypes.DIAMOND]: new Pool(Diamond, 250),
    [ShapeTypes.ELLIPSE]: new Pool(Ellipse, 250)
  };

  private _visualizer: Visualizer;

  public constructor (visualizer: Visualizer, customizerManager: CustomizerManager) {
    this._visualizer = visualizer;
    this._customizerManager = customizerManager;

    this._buildSelectedTemplateCache();
  }

  @Implementation
  public request (channelIndex: number, noteEvent: INoteEvent): Shape {
    const selectedEffectTemplates: IEffectTemplate[] = this._selectedTemplateCache[channelIndex];

    if (noteEvent.duration === 0 || selectedEffectTemplates.length === 0) {
      return null;
    }

    const shape: Shape = this._getShape(channelIndex, noteEvent);

    this._pipeEffectsIntoShape(shape, selectedEffectTemplates, noteEvent);

    return shape;
  }

  @Implementation
  public return (shape: Shape): void {
    const { effects, type } = shape;

    for (const effect of effects) {
      this._effectFactory.return(effect);
    }

    this._shapePools[type].return(shape);
  }

  private _buildSelectedTemplateCache (): void {
    const totalChannels: number = this._customizerManager.getTotalChannels();

    for (let channelIndex = 0; channelIndex < totalChannels; channelIndex++) {
      this._selectedTemplateCache[channelIndex] = Visualizer.EFFECT_TYPES
        .map((effectType: EffectTypes) => this._customizerManager.getEffectTemplate(effectType, channelIndex))
        .filter(({ isSelected }: IEffectTemplate) => isSelected);
    }
  }

  private _getShape (channelIndex: number, noteEvent: INoteEvent): Shape {
    const { shapeType, size } = this._customizerManager.getShapeTemplate(channelIndex);
    const { delay, duration } = noteEvent;
    const pixelsPerBeat: number = this._visualizer.getPixelsPerBeat();
    const x: number = delay * pixelsPerBeat + ShapeFactory.SHAPE_X_BUFFER;
    const y: number = this._getShapeY(noteEvent);
    const length: number = duration * pixelsPerBeat;
    const shape: Shape = this._shapePools[shapeType].request() as Shape;

    switch (shapeType) {
      case ShapeTypes.BALL:
        return (shape as Ball).construct(x, y, size);
      case ShapeTypes.BAR:
        return (shape as Bar).construct(x, y, length, size);
      case ShapeTypes.DIAMOND:
        return (shape as Diamond).construct(x, y, length, size);
      case ShapeTypes.ELLIPSE:
        return (shape as Ellipse).construct(x, y, length, size);
    }
  }

  private _getShapeY (noteEvent: INoteEvent): number {
    const { pitch } = noteEvent;
    const { height, noteSpread } = this._customizerManager.getCustomizerSettings();
    const heightRatio: number = height / ShapeFactory.MAX_NOTE_PITCH;

    return (
      /**
       * {{height}} represents the bottom edge of the rendering area (since our
       * coordinate system sets the top edge at y = 0), {{pitch}} represents a note
       * pitch within the range [0, MAX_NOTE_PITCH], and {{heightRatio}} is a scaling
       * factor to scale the aforementioned range to [0, height]. By subtracting the
       * scaled pitch value from the bottom edge, higher notes will appear closer to
       * the top of the rendering area. {{noteSpread}} scales the vertical note spread.
       */
      (height - (pitch * heightRatio)) * noteSpread
      /**
       * Having used {{noteSpread}} to adjust our vertical note spread, we still need to
       * shift the notes partially back into view so they still "center" on the vertical
       * midpoint of the rendering area. {{noteSpread - 1}} gives us the percentage by
       * which the vertical rendering area has increased (e.g. [1.5 - 1] -> 0.5), and we
       * divide this by 2 to shift back only to the halfway point. By multiplying the
       * result by {{height}} we determine the exact pixel amount to shift back, and
       * subtract it from the first expression.
       */
      - ((noteSpread - 1) / 2) * height
    );
  }

  private _pipeEffectsIntoShape (shape: Shape, effectTemplates: IEffectTemplate[], noteEvent: INoteEvent): void {
    for (const effectTemplate of effectTemplates) {
      const effect: Effect = this._effectFactory.request(effectTemplate);
      const { effectType, isDelayed } = effectTemplate;

      if (effectType === EffectTypes.GLOW) {
        // The Glow effect uniquely depends on the duration of
        // the provided note event to determine its fade-out time
        const notePlayTime: number = noteEvent.duration / this._visualizer.getBeatsPerSecond();

        (effect as Glow)
          .fadeIn(30)
          .fadeOut(1000 * notePlayTime);
      }

      if (isDelayed) {
        const { focusDelay } = this._customizerManager.getCustomizerSettings();

        effect.delay(focusDelay);
      }

      shape.pipe(effect);
    }
  }
}
