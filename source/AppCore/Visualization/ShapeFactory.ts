import Ball from '@core/Visualization/Shapes/Ball';
import Bar from '@core/Visualization/Shapes/Bar';
import CustomizerManager from '@core/Visualization/CustomizerManager';
import Note from '@core/MIDI/Note';
import Shape from '@core/Visualization/Shapes/Shape';
import Visualizer from '@core/Visualization/Visualizer';
import { ShapeTypes } from '@core/Visualization/Types';

export default class ShapeFactory extends CustomizerManager {
  private get _beatsPerSecond (): number {
    return this._tempo / 60;
  }

  private get _pixelsPerSecond (): number {
    const { framerate, scrollSpeed } = this.getCustomizerSettings();

    return framerate * (60 / framerate) * Visualizer.TICK_CONSTANT * this._tempo * (scrollSpeed / 100);
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

    return height - (pitch * heightRatio);
  }
}
