import Canvas from '@core/Graphics/Canvas';
import Visualizer from '@core/Visualization/Visualizer';
import Shape from '@core/Visualization/Shapes/Shape';
import { Utils } from '@base';

export default class Prerenderer {
  public static readonly WIDTH_FACTOR: number = 3;
  private _canvas: Canvas = new Canvas();
  private _currentClipX: number = 0;

  public clear (): void {
    this._canvas.clear();
  }

  public clipOnto (targetCanvas: Canvas, targetX: number, clipX: number): void {
    const normalizedClipX = this._normalize(clipX);
    const clipWidth: number = Math.min(targetCanvas.width, this._canvas.width - normalizedClipX);

    this._clearFromLastClipXTo(normalizedClipX);
    this._clipOntoWithWidth(targetCanvas, targetX, normalizedClipX, clipWidth);

    this._currentClipX = normalizedClipX;

    if (targetX + clipWidth < targetCanvas.width) {
      // The clip isn't wide enough to cover the whole target Canvas, so
      // we need to wrap around to the beginning of the Prerenderer Canvas
      // and clip a remaining segment. By now, new Shapes will have also
      // been wrapped into this range.
      const wrappedClipX: number = this._normalize(normalizedClipX + clipWidth);
      const wrappedClipWidth: number = targetCanvas.width - (targetX + clipWidth);

      this._clipOntoWithWidth(targetCanvas, targetX + clipWidth, wrappedClipX, wrappedClipWidth);
    }
  }

  public prerender (shape: Shape): void {
    // We need to reset the Shape's offset X so its computed
    // pixel X coordinate reflects its raw X coordinate
    shape.offsetX = 0;

    if (this._isShapeXOutOfRange(shape)) {
      this._wrapShapeIntoRange(shape);
    }

    shape.render(this._canvas);

    if (this._isShapeRightXOutOfRange(shape)) {
      shape.offsetX -= this._canvas.width;

      shape.render(this._canvas);
    }
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width * Prerenderer.WIDTH_FACTOR, height);
  }

  /**
   * Clears the Prerenderer Canvas over a range from [_currentClipX, nextClipX],
   * also ensuring that if the range wraps around to the beginning, both the tail
   * end of the Canvas and the remaining segment at the beginning are cleared.
   * This is necessary to incrementally free up space just behind the clipping
   * frame so that once Shapes cycle back around, that space is free to draw to.
   */
  private _clearFromLastClipXTo (nextClipX: number): void {
    if (nextClipX < this._currentClipX) {
      // The new clip X coordinate has wrapped around, so we need
      // to clear the tail end of the Prerenderer Canvas first
      this._canvas.clear(this._currentClipX, 0, this._canvas.width - this._currentClipX, this._canvas.height);

      this._currentClipX = 0;
    }

    const clearWidth: number = nextClipX - this._currentClipX;
    const clearX: number = nextClipX - clearWidth;

    this._canvas.clear(clearX, 0, clearWidth, this._canvas.height);
  }

  private _clipOntoWithWidth (targetCanvas: Canvas, targetX: number, clipX: number, clipWidth: number): void {
    targetCanvas.image(
      this._canvas.element,
      clipX, 0, clipWidth, targetCanvas.height,
      targetX, 0, clipWidth, targetCanvas.height
    );
  }

  private _isShapeRightXOutOfRange (shape: Shape): boolean {
    return (this._normalize(shape.pixelX) + shape.size) > this._canvas.width;
  }

  private _isShapeXOutOfRange (shape: Shape): boolean {
    return shape.pixelX > this._canvas.width;
  }

  private _normalize (x: number): number {
    return Utils.modulo(x, this._canvas.width);
  }

  private _wrapShapeIntoRange (shape: Shape): void {
    shape.offsetX = -1 * (shape.pixelX - this._normalize(shape.pixelX));
  }
}
