import 'Application/GUI/Styles/VisualizerStyles.less';
import Bar from 'AppBase/Visualization/Effects/Bar';
import Visualizer from 'AppBase/Visualization/Visualizer';
import { $, Utils } from 'Base/Core';
import Glow from 'AppBase/Visualization/Effects/Glow';
import OscillatingBall from 'AppBase/Visualization/Effects/OscillatingBall';

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

    visualizer.define('GlowingBar', {
      effects: [
        () => new Glow({ R: 0, G: 255, B: 255}, 20),
        (top: number) => new Bar({ R: 0, G: 255, B: 255 }, top, 250, 20)
      ],
      primary: 2
    });

    visualizer.define('GreenBar', {
      effects: [
        (top: number) => new Bar({ R: 0, G: 255, B: 0 }, top, 200, 20),
        (top: number) => new OscillatingBall({ R: 255, G: 0, B: 0 }, top, 10, 200)
      ]
    });

    visualizer.run();
    visualizer.spawn('GlowingBar', 40);
    visualizer.spawn('GreenBar', 60);
  }
}
