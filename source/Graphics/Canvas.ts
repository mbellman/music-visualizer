import { IHashMap } from 'Base/Core';

export enum DrawSetting {
  FILL_COLOR = 'fillStyle',
  GLOW_BLUR = 'shadowBlur',
  GLOW_COLOR = 'shadowColor',
  STROKE_COLOR = 'strokeStyle',
  STROKE_WIDTH = 'lineWidth'
}

export default class Canvas {
  private _context: CanvasRenderingContext2D;
  private _element: HTMLCanvasElement;

  public constructor (element: HTMLCanvasElement) {
    this._context = element.getContext('2d');
    this._element = element;
  }

  public get height (): number {
    return this._element.height;
  }

  public get width (): number {
    return this._element.width;
  }

  public clear (): void {
    this._context.clearRect(0, 0, this.width, this.height);
  }

  public circle (x: number, y: number, radius: number): void {
    this._begin();
    this._context.arc(x, y, radius, 0, 2 * Math.PI);
  }

  public line (x1: number, y1: number, x2: number, y2: number): void {
    this._begin();
    this._context.moveTo(x1, y1);
    this._context.lineTo(x2, y2);
    this._context.stroke();
  }

  public rectangle (x: number, y: number, width: number, height: number): void {
    this._begin();
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
    this._element.width = width;
    this._element.height = height;
  }

  public stroke (): void {
    this._context.stroke();
  }

  private _begin (): void {
    this._context.beginPath();
  }
}
