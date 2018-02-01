import Ball from '@core/Visualization/Shapes/Ball';
import Bar from '@core/Visualization/Shapes/Bar';
import CustomizerManager from '@core/Visualization/CustomizerManager';
import Diamond from '@core/Visualization/Shapes/Diamond';
import Ellipse from '@core/Visualization/Shapes/Ellipse';
import Note from '@core/MIDI/Note';
import Shape from '@core/Visualization/Shapes/Shape';
import Visualizer from '@core/Visualization/Visualizer';
import { ShapeTypes } from '@core/Visualization/Types';

export default class ShapeFactory {
  private _customizerManager: CustomizerManager;

  public constructor (customizerManager: CustomizerManager) {
    this._customizerManager = customizerManager;
  }

  public getShape (channelIndex: number, note: Note): Shape {
    const { width } = this._customizerManager.getCustomizerSettings();
    const { shapeType, size } = this._customizerManager.getShapeTemplate(channelIndex);
    const x: number = width;
    const y: number = this._getShapeY(note);
    const length: number = this._getShapeLength(note);

    switch (shapeType) {
      case ShapeTypes.BAR:
        return new Bar(x, y, length, size);
      case ShapeTypes.BALL:
        return new Ball(x, y, size);
      case ShapeTypes.DIAMOND:
        return new Diamond(x, y, length, size);
      case ShapeTypes.ELLIPSE:
        return new Ellipse(x, y, length, size);
    }
  }

  private _getShapeLength (note: Note): number {
    const { duration } = note;
    const pixelsPerBeat: number = this._customizerManager.getPixelsPerSecond() / this._customizerManager.getBeatsPerSecond();

    return duration * pixelsPerBeat;
  }

  private _getShapeY (note: Note): number {
    const { pitch } = note;
    const { height } = this._customizerManager.getCustomizerSettings();
    const heightRatio: number = height / Note.MAX_PITCH;

    return (
      /**
       * {{height}} represents the bottom edge of the rendering area (since our
       * coordinate system sets the top edge at y = 0), {{pitch}} represents a note
       * pitch within the range [0, MAX_PITCH], and {{heightRatio}} is a scaling factor
       * to scale the aforementioned range to [0, height]. By subtracting the scaled
       * pitch value from the bottom edge, higher notes will appear closer to the top
       * of the rendering area. {{NOTE_SPREAD_FACTOR}} scales the vertical note spread.
       */
      (height - (pitch * heightRatio)) * Visualizer.NOTE_SPREAD_FACTOR
      /**
       * Having used {{NOTE_SPREAD_FACTOR}} to adjust our vertical note spread, we need to
       * shift the notes partially back into view so they still "center" on the vertical
       * midpoint of the rendering area. {{NOTE_SPREAD_FACTOR - 1}} gives us the percentage
       * by which the vertical rendering area has increased (e.g. [1.5 - 1] -> 0.5), and
       * we divide this by 2 to shift back only to the halfway point. By multiplying the
       * result by {{height}} we determine the exact pixel amount to shift back, and
       * subtract it from the first expression.
       */
      - ((Visualizer.NOTE_SPREAD_FACTOR - 1) / 2) * height
    );
  }
}
