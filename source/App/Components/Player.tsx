import '@styles/Player.less';

import AudioFile from 'Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import Visualizer from '@core/Visualization/Visualizer';
import { barFactory, ballFactory } from 'App/ShapeFactories';
import { h, Component } from 'preact';
import { ICustomizer, IAppState } from '@state/Types';
import { Implementation, Override } from '@base';
import { Connect } from '@components/Toolkit/Decorators';

interface IPlayerProps {
  audioFile?: AudioFile;
  customizer?: ICustomizer;
  sequence?: Sequence;
}

function mapStateToProps (state: IAppState): IPlayerProps {
  const { audioFile, customizer, sequence } = state.selectedPlaylistTrack;

  return {
    audioFile,
    customizer,
    sequence
  };
}

@Connect(mapStateToProps)
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
