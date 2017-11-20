import IScreen from 'Graphics/IScreen';
import { IHashMap } from 'Base/Core';

type DrawHandler = (context: CanvasRenderingContext2D) => void;

interface ICanvasConfiguration {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

interface IContextConfiguration {
  fillStyle: string;
  lineWidth: number;
  strokeStyle: string;
}

export default class Canvas implements IScreen {
  private static _configurationConversions: IHashMap<keyof IContextConfiguration> = {
    fillColor: 'fillStyle',
    strokeColor: 'strokeStyle',
    strokeWidth: 'lineWidth'
  };

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

  public configure (configuration: ICanvasConfiguration): void {
    Object.keys(configuration).forEach((key: keyof ICanvasConfiguration) => {
      const contextKey: keyof IContextConfiguration = Canvas._configurationConversions[key];

      this._context[contextKey] = configuration[key];
    });
  }

  public draw (handler: DrawHandler): void {
    this._context.beginPath();

    handler(this._context);
  }

  public drawCircle (x: number, y: number, radius: number): void {
    this.draw((context: CanvasRenderingContext2D) => {
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.stroke();
      context.fill();
    });
  }

  public drawLine (x1: number, y1: number, x2: number, y2: number): void {
    this.draw((context: CanvasRenderingContext2D) => {
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    });
  }

  public drawRect (x: number, y: number, width: number, height: number): void {
    this.draw((context: CanvasRenderingContext2D) => {
      context.rect(x, y, width, height);
      context.fill();
      context.stroke();
    });
  }

  public setSize (width: number, height: number): void {
    this._element.width = width;
    this._element.height = height;
  }
}
