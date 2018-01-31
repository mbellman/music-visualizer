import Shape from '@core/Visualization/Shapes/Shape';
import { Implementation } from '@base';

export default abstract class LongShape extends Shape {
  protected height: number;
  protected width: number;

  public constructor (x: number, y: number, width: number, height: number) {
    super(x, y);

    this.width = width;
    this.height = height;
  }

  @Implementation
  public isOffscreen (): boolean {
    return this.pixelX + this.width < 0;
  }
}
