import Canvas from 'Graphics/Canvas';
import Effect from 'AppBase/Visualization/Effects/Effect';
import { Implementation } from 'Base/Decorators';
import { IColor } from 'AppBase/Visualization/Types';

export default abstract class ScrollingEffect extends Effect {
  protected deltaX: number = 0;
  protected pX: number;
  protected pY: number;
  protected y: number;

  @Implementation
  public draw (canvas: Canvas): void {
    this.pX = Math.round(canvas.width - this.deltaX);
    this.pY = Math.round(this.y / 100 * canvas.height);
  }

  @Implementation
  public update (dt: number, tempo: number): void {
    this.deltaX += dt * tempo / 2;
  }
}
