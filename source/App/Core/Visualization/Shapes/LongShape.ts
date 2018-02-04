import Shape from '@core/Visualization/Shapes/Shape';
import { Implementation, Override } from '@base';
import { IPoolable } from '@core/Pool';

export default abstract class LongShape extends Shape implements IPoolable<LongShape> {
  protected height: number;
  protected width: number;

  @Implementation
  public get size (): number {
    return this.width;
  }

  @Override
  public construct (x: number, y: number, width: number, height: number): this {
    super.construct(x, y);

    this.width = width;
    this.height = height;

    return this;
  }

  @Override
  public destruct (): void {
    super.destruct();

    this.width = null;
    this.height = null;
  }
}
