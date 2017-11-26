import Canvas from 'Graphics/Canvas';
import Effect, { EffectType } from 'AppBase/Visualization/Effects/Effect';
import Shape from 'AppBase/Visualization/Shapes/Shape';
import { Implementation } from 'Base/Decorators';

export default class Scroll extends Effect {
  public readonly type: EffectType = EffectType.PRE;

  @Implementation
  public update (canvas: Canvas, shape: Shape, dt: number, tempo: number): void {
    shape.move(-dt * tempo / 2);
  }
}
