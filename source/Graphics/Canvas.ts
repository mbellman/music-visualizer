import { CanvasImageSource, IColor } from 'Graphics/Types';
import { IHashMap } from 'Base/Core';

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

  public clear (): void {
    this._context.clearRect(0, 0, this.width, this.height);
  }

  public circle (x: number, y: number, radius: number): void {
    this._context.beginPath();
    this._context.arc(x, y, radius, 0, 2 * Math.PI);
  }

  public image (image: CanvasImageSource, x: number, y: number): void;
  public image (image: CanvasImageSource, x: number, y: number, width: number, height: number): void;
  public image (image: CanvasImageSource, clipX: number, clipY: number, clipWidth: number, clipHeight: number, x: number, y: number, width: number, height: number): void;

  public image (): void {
    this._context.drawImage.apply(this._context, arguments);
  }

  public line (x1: number, y1: number, x2: number, y2: number): void {
    this._context.beginPath();
    this._context.moveTo(x1, y1);
    this._context.lineTo(x2, y2);
    this.stroke();
  }

  public rectangle (x: number, y: number, width: number, height: number): void {
    this._context.beginPath();
    this._context.rect(x, y, width, height);
  }

  public fill (): void {
    this._context.fill();
  }

  public restore (): void {
    this._context.restore();
  }

  public save (): void {
    this._context.save();
  }

  public set (property: DrawSetting, value: any): void {
    this._context[property] = value;
  }

  public setSize (width: number, height: number): void {
    this.element.width = width;
    this.element.height = height;
  }

  public stroke (): void {
    this._context.stroke();
  }
}
