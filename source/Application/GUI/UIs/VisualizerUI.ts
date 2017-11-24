import 'Application/GUI/Styles/VisualizerStyles.less';
import Bar from 'AppBase/Visualization/Effects/Bar';
import Visualizer from 'AppBase/Visualizer';
import { $, Utils } from 'Base/Core';

export default class VisualizerUI {
  public static template: string = `
    <div class="visualizer-container">
      <canvas></canvas>
    </div>
  `;

  public static start (): void {
    const visualizer: Visualizer = new Visualizer($('.visualizer-container canvas')[0] as HTMLCanvasElement);

    visualizer.setSize(1190, 640);

    visualizer.configure({
      tempo: 180
    });

    visualizer.createEffect('RedBar', [
      (top: number) => new Bar({ R: 255, G: 0, B: 0 }, top, 250, 20)
    ]);

    visualizer.run();
    visualizer.spawnEffect('RedBar', 50);
  }
}
