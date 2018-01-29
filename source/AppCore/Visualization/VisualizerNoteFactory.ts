import Effect from '@core/Visualization/Effects/Effect';
import EffectFactory from '@core/Visualization/EffectFactory';
import Note from '@core/MIDI/Note';
import Scroll from '@core/Visualization/Effects/Scroll';
import Shape from '@core/Visualization/Shapes/Shape';
import ShapeFactory from '@core/Visualization/ShapeFactory';
import VisualizerNote from '@core/Visualization/VisualizerNote';
import { ICustomizer } from '@core/Visualization/Types';

export default class VisualizerNoteFactory {
  private _shapeFactory: ShapeFactory;
  private _effectFactory: EffectFactory;

  public constructor (customizer: ICustomizer) {
    this._shapeFactory = new ShapeFactory(customizer);
    this._effectFactory = new EffectFactory(customizer);
  }

  public getVisualizerNote (channelIndex: number, note: Note): VisualizerNote {
    const shape: Shape = this._shapeFactory.getShape(channelIndex, note);
    const effects: Effect[] = this._effectFactory.getEffects(channelIndex);

    for (const effect of effects) {
      shape.pipe(effect);
    }

    shape.pipe(new Scroll());

    return new VisualizerNote([ shape ]);
  }
}
