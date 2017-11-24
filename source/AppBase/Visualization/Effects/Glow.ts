import Canvas from 'Graphics/Canvas';
import Effect from 'AppBase/Visualization/Effects/Effect';
import { Implementation } from 'Base/Decorators';

export default class Glow extends Effect {
  @Implementation
  public draw (canvas: Canvas): void {

  }

  @Implementation
  public update (): void {}
}
