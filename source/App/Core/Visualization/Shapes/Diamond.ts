import Canvas from '@core/Graphics/Canvas';
import LongShape from '@core/Visualization/Shapes/LongShape';
import { Implementation } from '@base';

export default class Diamond extends LongShape {
  @Implementation
  public draw (canvas: Canvas): void {
    const { pixelX, pixelY, width, height } = this;
    const halfWidth: number = width / 2;
    const halfHeight: number = height / 2;

    canvas
      /* Start at the diamond's left corner */
      .move(pixelX, pixelY)
      /* Draw a line to the top corner */
      .line(pixelX + halfWidth, pixelY - halfHeight)
      /* Draw a line to the right corner */
      .line(pixelX + width, pixelY)
      /* Draw a line to the bottom corner */
      .line(pixelX + halfWidth, pixelY + halfHeight)
      /* Close the shape path, snapping back to the left corner */
      .closePath();
  }
}
