import Canvas from 'Graphics/Canvas';
import Effect from 'AppCore/Visualization/Effects/Effect';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import { Implementation } from 'Base/Core';

export default class Scroll extends Effect {
  @Implementation
  public update (canvas: Canvas, dt: number, tempo: number): void {
    this.shape.move(-dt * tempo);
  }
}
