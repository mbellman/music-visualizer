import 'App/Styles/Visualization.less';
import Sequence from 'AppCore/MIDI/Sequence';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { h, Component } from 'preact';
import { barFactory, ballFactory } from 'App/ShapeFactories';

interface IVisualizationProps {
  sequence: Sequence;
}

export default class Visualization extends Component<IVisualizationProps, any> {
  private _visualizer: Visualizer;

  public componentDidMount (): void {
    const canvas: HTMLCanvasElement = this.base.querySelector('canvas');
    const visualizer: Visualizer = new Visualizer(canvas);

    visualizer.setSize(canvas.clientWidth, canvas.clientHeight);
    visualizer.define('Bar', barFactory);
    visualizer.define('Ball', ballFactory);

    visualizer.configure({
      framerate: 60,
      speed: 100
    });

    this._visualizer = visualizer;
  }

  public componentDidUpdate (): void {
    this._visualizer.stop();
    this._visualizer.visualize(this.props.sequence);
  }

  public render (): JSX.Element {
    return (
      <div className="visualization">
        <canvas></canvas>
      </div>
    );
  }
}
