import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';

export default class VisualizerNote {
  private _shapes: Shape[] = [];

  public constructor (shapes: Shape[]) {
    this._shapes = shapes;
  }

  public isOffscreen (): boolean {
    for (const shape of this._shapes) {
      if (!shape.isOffscreen()) {
        return false;
      }
    }

    return true;
  }

  public update (canvas: Canvas, dt: number, tempo: number): void {
    for (const shape of this._shapes) {
      canvas.save();
      shape.update(canvas, dt, tempo);
      canvas.restore();
    }
  }
}
