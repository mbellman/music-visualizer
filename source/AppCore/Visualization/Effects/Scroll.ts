import Canvas from 'Graphics/Canvas';
import Effect from '@core/Visualization/Effects/Effect';
import { Implementation } from '@base';

export default class Scroll extends Effect {
  @Implementation
  public update (canvas: Canvas, dt: number, tempo: number): void {
    this.shape.move(-dt * tempo);
  }
}
