import Canvas from '@core/Graphics/Canvas';
import LongShape from '@core/Visualization/Shapes/LongShape';
import { Implementation } from '@base';

export default class Ellipse extends LongShape {
  @Implementation
  public draw (canvas: Canvas): void {
    const { pixelX, pixelY, width, height } = this;

    canvas.ellipse(pixelX + width / 2, pixelY, width, height);
  }
}
