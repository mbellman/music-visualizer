import { CanvasImageSource, IColor } from '@core/Graphics/Types';

export enum DrawSetting {
  FILL_COLOR = 'fillStyle',
  FONT = 'font',
  GLOW_BLUR = 'shadowBlur',
  GLOW_COLOR = 'shadowColor',
  STROKE_COLOR = 'strokeStyle',
  STROKE_WIDTH = 'lineWidth'
}

export default class Canvas {
  public readonly element: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;

  public static colorToString (color: IColor): string {
    const { R, G, B } = color;

    return `rgb(${R}, ${G}, ${B})`;
  }

  public constructor (element?: HTMLCanvasElement) {
    if (!element) {
      element = document.createElement('canvas');
    }

    this.element = element;
    this._context = element.getContext('2d');
  }

  public get height (): number {
    return this.element.height;
  }

  public get width (): number {
    return this.element.width;
  }

  public circle (x: number, y: number, radius: number): this {
    this._context.beginPath();
    this._context.arc(x, y, radius, 0, 2 * Math.PI);

    return this;
  }

  public clear (x: number = 0, y: number = 0, width: number = this.width, height: number = this.height): this {
    this._context.clearRect(x, y, width, height);

    return this;
  }

  public clip (): this {
    this._context.clip();

    return this;
  }

  public closePath (): this {
    this._context.closePath();

    return this;
  }

  public ellipse (x: number, y: number, width: number, height: number): this {
    const controlY: number = (height / 0.75) / 2;
    const halfWidth: number = width / 2;

    this._context.beginPath();
    this._context.moveTo(x - halfWidth, y);
    this._context.bezierCurveTo(x - halfWidth, y + controlY, x + halfWidth, y + controlY, x + halfWidth, y);
    this._context.bezierCurveTo(x + halfWidth, y - controlY, x - halfWidth, y - controlY, x - halfWidth, y);

    return this;
  }

  public image (image: CanvasImageSource, x: number, y: number): this;
  public image (image: CanvasImageSource, x: number, y: number, width: number, height: number): this;
  public image (image: CanvasImageSource, clipX: number, clipY: number, clipWidth: number, clipHeight: number, x: number, y: number, width: number, height: number): this;

  public image (): this {
    this._context.drawImage.apply(this._context, arguments);

    return this;
  }

  public line (x: number, y: number): this {
    this._context.lineTo(x, y);

    return this;
  }

  public move (x: number, y: number): this {
    this._context.beginPath();
    this._context.moveTo(x, y);

    return this;
  }

  public rectangle (x: number, y: number, width: number, height: number): this {
    this._context.beginPath();
    this._context.rect(x, y, width, height);

    return this;
  }

  public fill (): this {
    this._context.fill();

    return this;
  }

  public restore (): this {
    this._context.restore();

    return this;
  }

  public save (): this {
    this._context.save();

    return this;
  }

  public set (property: DrawSetting, value: any): this {
    this._context[property] = value;

    return this;
  }

  public setSize (width: number, height: number): this {
    this.element.width = width;
    this.element.height = height;

    return this;
  }

  public stroke (): this {
    this._context.stroke();

    return this;
  }

  public text (text: string, x: number, y: number): this {
    this._context.fillText(text, x, y);

    return this;
  }
}
