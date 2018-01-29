import AudioFile from 'Audio/AudioFile';
import Sequence from '@core/MIDI/Sequence';
import Visualizer from '@core/Visualization/Visualizer';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState } from '@state/Types';
import { ICustomizer } from '@core/Visualization/Types';
import { Implementation, Override } from '@base';
import '@styles/Player.less';

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
    this._setVisualizer();
    this._play();
  }

  @Override
  public render (): JSX.Element {
    return (
      <div className="player">
        <canvas></canvas>
      </div>
    );
  }

  private _play (): void {
    const { sequence, customizer } = this.props;

    this._visualizer.stop();
    this._visualizer.visualize(sequence, customizer);
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

    this._visualizer = visualizer;
  }
}
