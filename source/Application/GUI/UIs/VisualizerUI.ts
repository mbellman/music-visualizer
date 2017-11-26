import 'Application/GUI/Styles/VisualizerStyles.less';
import Bar from 'AppBase/Visualization/Shapes/Bar';
import Fill from 'AppBase/Visualization/Effects/Fill';
import Glow from 'AppBase/Visualization/Effects/Glow';
import Scroll from 'AppBase/Visualization/Effects/Scroll';
import Visualizer from 'AppBase/Visualization/Visualizer';
import { $, Utils } from 'Base/Core';
import Ball from 'AppBase/Visualization/Shapes/Ball';
import Stroke from 'AppBase/Visualization/Effects/Stroke';

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

    visualizer.define('GlowingBar', (x: number, y: number) => {
      return [
        new Ball(x, y, 20)
          .add(new Glow({ R: 255, G: 0, B: 0 }, 20))
          .add(new Stroke({ R: 0, G: 255, B: 255 }, 5))
          .add(new Fill({ R: 0, G: 0, B: 0 }))
          .add(new Scroll())
      ];
    });

    /*
    visualizer.define('GreenBar', [
      (top: number) => new Bar({ R: 0, G: 255, B: 0 }, top, 200, 20),
      (top: number) => new OscillatingBall({ R: 255, G: 0, B: 0 }, top, 10, 200)
    ]);
    */

    visualizer.run();

    for (let i = 0; i < 100; i++) {
      const delay: number = Utils.random(0, 10000);
      const top: number = Utils.random(0, 90);

      setTimeout(() => {
        visualizer.spawn('GlowingBar', visualizer.width, top / 100 * visualizer.height);
      }, delay);
    }
    // visualizer.spawn('GreenBar', 60);
  }
}
