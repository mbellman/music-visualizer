import Canvas from 'Graphics/Canvas';
import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import Shape from 'AppBase/Visualization/Shapes/Shape';
import { Implementation } from 'Base/Decorators';

export default class Scroll extends Effect {
  @Implementation
  public update (canvas: Canvas, shape: Shape, dt: number, tempo: number): void {
    shape.move(-dt * tempo / 2);
  }
}
