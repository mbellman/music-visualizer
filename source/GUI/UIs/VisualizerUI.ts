import 'GUI/Styles/VisualizerStyles.less';
import Bar from 'AppCore/Visualization/Shapes/Bar';
import Fill from 'AppCore/Visualization/Effects/Fill';
import Glow from 'AppCore/Visualization/Effects/Glow';
import Scroll from 'AppCore/Visualization/Effects/Scroll';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { $, Utils } from 'Base/Core';
import Ball from 'AppCore/Visualization/Shapes/Ball';
import Stroke from 'AppCore/Visualization/Effects/Stroke';

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
        new Ball(x, y, 10)
          .pipe(
            new Glow({ R: 255, G: 0, B: 0 }, 20)
              .delay(7000)
              .fadeIn(250)
          )
          .pipe(new Stroke({ R: 0, G: 255, B: 255 }, 3))
          .pipe(
            new Fill({ R: 0, G: 255, B: 255 })
              .delay(7000)
          )
          .pipe(new Scroll())
      ];
    });

    /*
    visualizer.define('GreenBar', [
      (top: number) => new Bar({ R: 0, G: 255, B: 0 }, top, 200, 20),
      (top: number) => new OscillatingBall({ R: 255, G: 0, B: 0 }, top, 10, 200)
    ]);
    */

    visualizer.run();

    for (let i = 0; i < 500; i++) {
      const delay: number = Utils.random(0, 30000);
      const top: number = Utils.random(20, 80);

      setTimeout(() => {
        visualizer.spawn('GlowingBar', visualizer.width, top / 100 * visualizer.height);
      }, delay);
    }
    // visualizer.spawn('GreenBar', 60);
  }
}
