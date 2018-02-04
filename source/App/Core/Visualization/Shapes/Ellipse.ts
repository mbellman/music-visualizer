import Canvas from '@core/Graphics/Canvas';
import LongShape from '@core/Visualization/Shapes/LongShape';
import { Implementation } from '@base';
import { ShapeTypes } from '@core/Visualization/Types';

export default class Ellipse extends LongShape {
  public type: ShapeTypes = ShapeTypes.ELLIPSE;

  @Implementation
  protected draw (canvas: Canvas): void {
    const { pixelX, pixelY, width, height } = this;

    // Canvas.ellipse() centers the Ellipse at the provided X
    // coordinate, so in order to set the left edge of the Ellipse
    // at the pixel X coordinate we simply add half the width.
    canvas.ellipse(pixelX + width / 2, pixelY, width, height);
  }
}
