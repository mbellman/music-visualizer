import Canvas from '@core/Graphics/Canvas';
import LongShape from '@core/Visualization/Shapes/LongShape';
import { Implementation } from '@base';

export default class Bar extends LongShape {
  @Implementation
  public draw (canvas: Canvas): void {
    canvas.rectangle(this.pixelX, this.pixelY - (this.height / 2), this.width, this.height);
  }
}
