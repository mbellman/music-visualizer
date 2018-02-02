import CustomizerManager from '@core/Visualization/CustomizerManager';
import Effect from '@core/Visualization/Effects/Effect';
import EffectFactory from '@core/Visualization/EffectFactory';
import Glow from '@core/Visualization/Effects/Glow';
import Note from '@core/MIDI/Note';
import Pool, { IPoolableFactory } from '@core/Pool';
import Shape from '@core/Visualization/Shapes/Shape';
import ShapeFactory from '@core/Visualization/ShapeFactory';
import Visualizer from '@core/Visualization/Visualizer';
import VisualizerNote from '@core/Visualization/VisualizerNote';
import { Bind, IHashMap, Implementation } from '@base';
import { EffectTypes, ICustomizer, IEffectTemplate } from '@core/Visualization/Types';

export default class VisualizerNoteFactory implements IPoolableFactory<VisualizerNote> {
  private _customizerManager: CustomizerManager;
  private _effectFactory: EffectFactory;
  /**
   * Maps channel indexes to arrays of selected effect templates for
   * each particular channel. The cache is built at the beginning
   * of visualizer playback, avoiding any unnecessary overhead when
   * new notes are generated and only *selected* effect templates
   * need to be looped through to create new Effect instances.
   */
  private _selectedTemplateCache: IHashMap<IEffectTemplate[]> = {};
  private _shapeFactory: ShapeFactory;
  private _visualizerNotePool: Pool<VisualizerNote> = new Pool(VisualizerNote, 500);

  public constructor (customizer: ICustomizer) {
    this._customizerManager = new CustomizerManager(customizer);
    this._effectFactory = new EffectFactory();
    this._shapeFactory = new ShapeFactory(this._customizerManager);

    this._buildSelectedTemplateCache();
  }

  @Implementation
  public request (channelIndex: number, note: Note): VisualizerNote {
    const selectedEffectTemplates: IEffectTemplate[] = this._selectedTemplateCache[channelIndex];

    if (selectedEffectTemplates.length === 0) {
      return null;
    }

    const shape: Shape = this._shapeFactory.request(channelIndex, note);

    for (let i = 0; i < selectedEffectTemplates.length; i++) {
      const effectTemplate: IEffectTemplate = selectedEffectTemplates[i];
      const effect: Effect = this._effectFactory.request(effectTemplate);
      const { effectType, isDelayed } = effectTemplate;

      if (effectType === EffectTypes.GLOW) {
        // The Glow effect uniquely depends on the duration
        // of provided Note to determine its fade-out time.
        const notePlayTime: number = note.duration / this._customizerManager.getBeatsPerSecond();

        (effect as Glow)
          .fadeIn(50)
          .fadeOut(1000 * notePlayTime);
      }

      if (isDelayed) {
        const { focusDelay } = this._customizerManager.getCustomizerSettings();

        effect.delay(focusDelay);
      }

      shape.pipe(effect);
    }

    return (this._visualizerNotePool.request() as VisualizerNote).construct(shape);
  }

  @Implementation
  public return (visualizerNote: VisualizerNote): void {
    this._returnVisualizerNoteChildren(visualizerNote);

    this._visualizerNotePool.return(visualizerNote);
  }

  private _buildSelectedTemplateCache (): void {
    const totalChannels: number = this._customizerManager.getTotalChannels();

    for (let channelIndex = 0; channelIndex < totalChannels; channelIndex++) {
      this._selectedTemplateCache[channelIndex] = Visualizer.EFFECT_TYPES
        .map((effectType: EffectTypes) => this._customizerManager.getEffectTemplate(effectType, channelIndex))
        .filter(({ isSelected }: IEffectTemplate) => isSelected);
    }
  }

  /**
   * Extracts the Shape and Effect instances within a VisualizerNote
   * and returns them to their factories for object pool reinsertion.
   */
  private _returnVisualizerNoteChildren (visualizerNote: VisualizerNote): void {
    const shape: Shape = visualizerNote.shape;

    for (let j = 0; j < shape.effects.length; j++) {
      const effect: Effect = shape.effects[j];

      this._effectFactory.return(effect);
    }

    this._shapeFactory.return(shape);
  }
}
