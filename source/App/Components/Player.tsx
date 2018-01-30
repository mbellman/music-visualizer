import AudioFile from 'Audio/AudioFile';
import PlayerControls from '@components/PlayerControls';
import Sequence from '@core/MIDI/Sequence';
import Visualizer from '@core/Visualization/Visualizer';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState } from '@state/Types';
import { ICustomizer } from '@core/Visualization/Types';
import { Implementation, Override } from '@base';
import '@styles/Player.less';

interface IPlayerPropsFromState {
  audioFile?: AudioFile;
  customizer?: ICustomizer;
  sequence?: Sequence;
}

interface IPlayerProps extends IPlayerPropsFromState {}

interface IPlayerState {
  visualizer: Visualizer;
}

function mapStateToProps (state: IAppState): IPlayerPropsFromState {
  const { audioFile, customizer, sequence } = state.selectedPlaylistTrack;

  return {
    audioFile,
    customizer,
    sequence
  };
}

@Connect(mapStateToProps)
export default class Player extends Component<IPlayerProps, IPlayerState> {
  @Implementation
  public componentDidMount (): void {
    this._setVisualizer();
    this._play();
  }

  @Override
  public render (): JSX.Element {
    const { visualizer } = this.state;

    return (
      <div className="player">
        <canvas></canvas>

        <PlayerControls visualizer={ visualizer } />
      </div>
    );
  }

  private _play (): void {
    const { sequence, customizer, audioFile } = this.props;
    const { visualizer } = this.state;

    visualizer.stop();
    visualizer.visualize(sequence, customizer);

    audioFile.play();
  }

  private _setVisualizer (): void {
    const canvas: HTMLCanvasElement = this.base.querySelector('canvas');
    const visualizer: Visualizer = new Visualizer(canvas);
    const { width, height, framerate, scrollSpeed } = this.props.customizer.settings;

    visualizer.setSize(width, height);

    visualizer.configure({
      framerate,
      scrollSpeed
    });

    this.setState({ visualizer });
  }
}
