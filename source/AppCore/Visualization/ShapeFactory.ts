import Ball from '@core/Visualization/Shapes/Ball';
import Bar from '@core/Visualization/Shapes/Bar';
import CustomizerManager from '@core/Visualization/CustomizerManager';
import Note from '@core/MIDI/Note';
import Shape from '@core/Visualization/Shapes/Shape';
import Visualizer from '@core/Visualization/Visualizer';
import { ShapeTypes } from '@core/Visualization/Types';

export default class ShapeFactory extends CustomizerManager {
  public static readonly SPREAD_FACTOR: number = 1.5;

  private get _beatsPerSecond (): number {
    return this._tempo / 60;
  }

  private get _pixelsPerSecond (): number {
    const { framerate, scrollSpeed } = this.getCustomizerSettings();

    return Visualizer.TICK_CONSTANT * 60 * this._tempo * (scrollSpeed / 100);
  }

  private get _tempo (): number {
    const { tempo } = this.getCustomizerSettings();

    return tempo;
  }

  public getShape (channelIndex: number, note: Note): Shape {
    const { width } = this.getCustomizerSettings();
    const { shapeType, size } = this.getShapeTemplate(channelIndex);
    const x: number = width;
    const y: number = this._getShapeY(note);
    const length: number = this._getShapeLength(note);

    switch (shapeType) {
      case ShapeTypes.BAR:
        return new Bar(x, y, length, size);
      case ShapeTypes.BALL:
        return new Ball(x, y, size);
    }
  }

  private _getShapeLength (note: Note): number {
    const { duration } = note;
    const pixelsPerBeat: number = this._pixelsPerSecond / this._beatsPerSecond;

    return duration * pixelsPerBeat;
  }

  private _getShapeY (note: Note): number {
    const { pitch } = note;
    const { height } = this.getCustomizerSettings();
    const heightRatio: number = height / Note.MAX_PITCH;

    return (
      /**
       * {{height}} represents the bottom edge of the rendering area (since our
       * coordinate system sets the top edge at y = 0), {{pitch}} represents a note
       * pitch within the range [0, MAX_PITCH], and {{heightRatio}} is a scaling factor
       * to scale the aforementioned range to [0, height]. By subtracting the scaled
       * pitch value from the bottom edge, higher notes will appear closer to the top
       * of the rendering area. {{SPREAD_FACTOR}} scales the vertical note spread.
       */
      (height - (pitch * heightRatio)) * ShapeFactory.SPREAD_FACTOR
      /**
       * Having used {{SPREAD_FACTOR}} to adjust our vertical note spread, we need to
       * shift the notes partially back into view so they still "center" on the vertical
       * midpoint of the rendering area. {{SPREADFACTOR - 1}} gives us the percentage
       * by which the vertical rendering area has increased (e.g. [1.5 - 1] -> 0.5),
       * and we divide this by 2 to shift back only to a halfway point. By multiplying
       * the result by {{height}} we determine the exact pixel amount to shift back,
       * and subtract it from the first expression.
       */
      - ((ShapeFactory.SPREAD_FACTOR - 1) / 2) * height
    );
  }
}
