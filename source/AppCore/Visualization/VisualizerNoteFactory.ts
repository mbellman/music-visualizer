import CustomizerManager from '@core/Visualization/CustomizerManager';
import Effect from '@core/Visualization/Effects/Effect';
import EffectFactory from '@core/Visualization/EffectFactory';
import Note from '@core/MIDI/Note';
import Scroll from '@core/Visualization/Effects/Scroll';
import Shape from '@core/Visualization/Shapes/Shape';
import ShapeFactory from '@core/Visualization/ShapeFactory';
import VisualizerNote from '@core/Visualization/VisualizerNote';
import { ICustomizer } from '@core/Visualization/Types';

export default class VisualizerNoteFactory {
  private _customizerManager: CustomizerManager;
  private _effectFactory: EffectFactory;
  private _shapeFactory: ShapeFactory;

  public constructor (customizer: ICustomizer) {
    this._customizerManager = new CustomizerManager(customizer);
    this._effectFactory = new EffectFactory(this._customizerManager);
    this._shapeFactory = new ShapeFactory(this._customizerManager);
  }

  public getVisualizerNote (channelIndex: number, note: Note): VisualizerNote {
    const shape: Shape = this._shapeFactory.getShape(channelIndex, note);
    const effects: Effect[] = this._effectFactory.getEffects(channelIndex, note);

    for (const effect of effects) {
      shape.pipe(effect);
    }

    shape.pipe(new Scroll());

    return new VisualizerNote([ shape ]);
  }
}
