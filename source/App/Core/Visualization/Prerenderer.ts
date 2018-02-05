import Canvas, { DrawSetting } from '@core/Graphics/Canvas';
import Shape from '@core/Visualization/Shapes/Shape';
import Visualizer from '@core/Visualization/Visualizer';
import { Utils } from '@base';

/**
 * A resource for prerendering Shapes with either static-only Effects
 * or dynamic Effects which have stopped/faded out. Without any sort
 * of prerendering mechanism, all Shapes in the Visualizer view would
 * be re-drawn on every frame, noticeably impairing performance when
 * higher numbers of Shapes or ones with dynamic Effects were included.
 *
 * The Prerenderer uses an extended Canvas scaled horizontally by a
 * factor of {{WIDTH_CYCLES}} compared to the width value provided to
 * its setSize() method. This extended space allows new prerendered
 * Shapes to be drawn, scrolled past the visible viewport, and erased
 * in time for more prerendering to be done on the next cycle.
 */
export default class Prerenderer {
  /**
   * The number of pixels behind the current clipping source X
   * coordinate at which old prerendered image data can be cleared.
   * If clearing occurred immediately behind the left edge of the
   * clipping source X (just off the left edge of the visible
   * frame), Shapes could scroll partially off the left edge
   * before being prerendered, and once flagged for prerendering
   * would then be drawn onto an already cleared region of the
   * canvas. The buffer amount represents an idealistic maximum
   * distance a Shape can scroll off the left edge before being
   * flagged for prerendering.
   */
  public static readonly CLEAR_BUFFER: number = 1000;

  public static readonly WIDTH_CYCLES: number = 3;
  private _canvas: Canvas = new Canvas();
  private _clipFrameWidth: number;
  private _lastScrolledAmount: number = 0;
  private _scrollX: number = 0;

  public clear (): void {
    this._canvas.clear();
  }

  public prerender (shape: Shape): void {
    // We need to reset the Shape's offset X so its computed
    // pixel X coordinate reflects its raw X coordinate
    shape.offsetX = 0;

    if (this._isShapeOutOfBounds(shape)) {
      this._wrapShapeIntoBounds(shape);
    }

    shape.render(this._canvas);

    if (this._isShapeRightEdgeOutOfBounds(shape)) {
      // Even after a Shape is wrapped into bounds and rendered, if
      // its right edge extends off the right edge of the Prerenderer
      // Canvas, it needs to be rendered once more at the beginning
      // in anticipation of the clipping frame wrapping around
      shape.offsetX -= this._canvas.width;

      shape.render(this._canvas);
    }
  }

  public scrollTo (scrollX: number): void {
    this._lastScrolledAmount = scrollX - this._scrollX;
    this._scrollX = scrollX;

    this._clearOldSpace();
  }

  public superimpose (targetCanvas: Canvas): void {
    const targetX: number = this._isScrolledPastRightEdge() ? 0 : (targetCanvas.width - this._scrollX);
    const clippingSourceX: number = this._getClippingSourceX();
    const clipWidth: number = this._clipFrameWidth - (this._isScrolledPastRightEdge() ? 0 : targetX);
    const isClippingOutOfBounds: boolean = clippingSourceX + clipWidth > this._canvas.width;

    if (isClippingOutOfBounds) {
      // When the computed clipping region extends beyond the
      // Prerenderer Canvas' right edge, we need to clip up
      // to its right edge first, and then whatever remains
      // from the beginning to fill the target Canvas
      const partialClipWidth: number = this._canvas.width - clippingSourceX;

      this._clipOntoTarget(targetCanvas, targetX, clippingSourceX, partialClipWidth);
      this._clipOntoTarget(targetCanvas, partialClipWidth, 0, clipWidth - partialClipWidth);
    } else {
      this._clipOntoTarget(targetCanvas, targetX, clippingSourceX, clipWidth);
    }
  }

  public setSize (width: number, height: number): void {
    this._canvas.setSize(width * Prerenderer.WIDTH_CYCLES, height);

    this._clipFrameWidth = width;
  }

  /**
   * Clears the Prerenderer Canvas horizontally over the last scroll amount,
   * {{Prendererer.CLEAR_BUFFER}} pixels behind the current clipping source
   * X coordinate. This is necessary to free up space behind the clipping
   * frame for later Shapes as they cycle back around.
   */
  private _clearOldSpace (): void {
    const clippingSourceX: number = this._getClippingSourceX();
    const clearX: number = this._normalize(clippingSourceX - Prerenderer.CLEAR_BUFFER);

    if (clearX > clippingSourceX) {
      // The clear X coordinate value is wrapped back to the tail of
      // the Prerenderer Canvas, so we need to clear to the end of the
      // Canvas first, then the remaining portion at the beginning
      const partialClearWidth: number = this._canvas.width - clearX;

      this._canvas.clear(clearX, 0, partialClearWidth, this._canvas.height);
      this._canvas.clear(0, 0, this._lastScrolledAmount - partialClearWidth, this._canvas.height);
    } else {
      // Occasionally, small erasure artifacts may appear due to
      // imprecise floating point values; padding the clear range
      // with 2 extra pixels on each end is a corrective hack
      this._canvas.clear(clearX - 2, 0, this._lastScrolledAmount + 2, this._canvas.height);
    }
  }

  private _clipOntoTarget (targetCanvas: Canvas, targetX: number, clipX: number, clipWidth: number): void {
    if (clipWidth === 0) {
      // Firefox doesn't like clipping regions with 0 area!
      return;
    }

    targetCanvas.image(
      this._canvas.element,
      clipX, 0, clipWidth, targetCanvas.height,
      targetX, 0, clipWidth, targetCanvas.height
    );
  }

  private _getClippingSourceX (): number {
    if (this._isScrolledPastRightEdge()) {
      return this._normalize(this._scrollX - this._clipFrameWidth);
    }

    return 0;
  }

  private _isScrolledPastRightEdge (): boolean {
    return this._scrollX > this._clipFrameWidth;
  }

  private _isShapeOutOfBounds (shape: Shape): boolean {
    return shape.pixelX > this._canvas.width;
  }

  private _isShapeRightEdgeOutOfBounds (shape: Shape): boolean {
    return (this._normalize(shape.pixelX) + shape.size) > this._canvas.width;
  }

  private _normalize (x: number): number {
    return Utils.modulo(x, this._canvas.width);
  }

  private _wrapShapeIntoBounds (shape: Shape): void {
    shape.offsetX = -1 * (shape.pixelX - this._normalize(shape.pixelX));
  }
}
