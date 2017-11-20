export default interface IScreen {
  drawCircle (x: number, y: number, radius: number): void;
  clear (): void;
  drawLine (x1: number, y1: number, x2: number, y2: number): void;
  drawRect (x: number, y: number, width: number, height: number): void;
}
