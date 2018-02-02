import Canvas from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import { Implementation } from '@base';
import { IPoolable } from '@core/Pool';

export default class VisualizerNote implements IPoolable<VisualizerNote> {
  private _shape: Shape;

  public get shape (): Shape {
    return this._shape;
  }

  @Implementation
  public construct (shape: Shape): this {
    this._shape = shape;

    return this;
  }

  @Implementation
  public destruct (): void {
    this._shape = null;
  }

  public isOffscreen (): boolean {
    return this._shape.isOffscreen();
  }

  public update (canvas: Canvas, dt: number, tempo: number): void {
    canvas.save();

    this._shape.move(-dt * tempo);
    this._shape.update(canvas, dt, tempo);

    canvas.restore();
  }
}
