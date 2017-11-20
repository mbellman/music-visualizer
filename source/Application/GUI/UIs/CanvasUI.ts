import 'Application/GUI/Styles/CanvasStyles';
import Canvas from 'Graphics/Canvas';
import { $ } from 'Base/Core';

export default class CanvasUI {
  public static template: string = `
    <div class="canvas-container">
      <canvas></canvas>
    </div>
  `;

  public static start (): void {
    const canvas: Canvas = new Canvas($('.canvas-container canvas')[0] as HTMLCanvasElement);

    canvas.setSize(990, 640);

    canvas.configure({
      fillColor: '#F00'
    });

    canvas.drawCircle(200, 300, 50);
    canvas.drawCircle(350, 120, 40);
    canvas.drawCircle(600, 250, 120);

    canvas.configure({
      fillColor: '#0F0'
    });

    canvas.drawCircle(550, 280, 40);
  }
}
