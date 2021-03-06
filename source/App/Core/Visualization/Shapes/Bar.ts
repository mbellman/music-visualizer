import Canvas from '@core/Graphics/Canvas';
import LongShape from '@core/Visualization/Shapes/LongShape';
import { Implementation } from '@base';
import { ShapeTypes } from '@core/Visualization/Types';

export default class Bar extends LongShape {
  public type: ShapeTypes = ShapeTypes.BAR;

  @Implementation
  protected draw (canvas: Canvas): void {
    canvas.rectangle(this.pixelX, this.pixelY - (this.height / 2), this.width, this.height);
  }
}
