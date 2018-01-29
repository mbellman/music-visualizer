import { CanvasImageSource, IColor } from 'Graphics/Types';

export enum DrawSetting {
  FILL_COLOR = 'fillStyle',
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

  public clear (): this {
    this._context.clearRect(0, 0, this.width, this.height);

    return this;
  }

  public circle (x: number, y: number, radius: number): this {
    this._context.beginPath();
    this._context.arc(x, y, radius, 0, 2 * Math.PI);

    return this;
  }

  public image (image: CanvasImageSource, x: number, y: number): this;
  public image (image: CanvasImageSource, x: number, y: number, width: number, height: number): this;
  public image (image: CanvasImageSource, clipX: number, clipY: number, clipWidth: number, clipHeight: number, x: number, y: number, width: number, height: number): this;

  public image (): this {
    this._context.drawImage.apply(this._context, arguments);

    return this;
  }

  public line (x1: number, y1: number, x2: number, y2: number): this {
    this._context.beginPath();
    this._context.moveTo(x1, y1);
    this._context.lineTo(x2, y2);
    this.stroke();

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
}
