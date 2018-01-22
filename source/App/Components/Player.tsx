import 'App/Styles/Player.less';
import AudioFile from 'Audio/AudioFile';
import Sequence from 'AppCore/MIDI/Sequence';
import Visualizer from 'AppCore/Visualization/Visualizer';
import { barFactory, ballFactory } from 'App/ShapeFactories';
import { h, Component } from 'preact';
import { ICustomizer } from 'App/State/Types';
import { Implementation, Override } from 'Base/Core';

interface IPlayerProps {
  audioFile: AudioFile;
  customizer: ICustomizer;
  sequence: Sequence;
}

export default class Player extends Component<IPlayerProps, any> {
  private _visualizer: Visualizer;

  @Implementation
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

    this._play();
  }

  @Override
  public render (): JSX.Element {
    return (
      <div class="player">
        <canvas></canvas>
      </div>
    );
  }

  private _play (): void {
    this._visualizer.stop();
    this._visualizer.visualize(this.props.sequence);
  }
}
