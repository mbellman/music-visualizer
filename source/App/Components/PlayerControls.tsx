import AudioFile from 'Audio/AudioFile';
import Visualizer from '@core/Visualization/Visualizer';
import { ActionCreators } from '@state/ActionCreators';
import { AudioControl, IAppState, ViewMode } from '@state/Types';
import { Bind, Method, Override } from '@base';
import { bindActionCreators } from 'redux';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import '@styles/PlayerControls.less';

interface IPlayerControlsPropsFromState {
  audioFile?: AudioFile;
}

interface IPlayerControlsPropsFromDispatch {
  changeView?: Method<ViewMode>;
  controlAudio?: Method<AudioControl>;
}

interface IPlayerControlsProps extends IPlayerControlsPropsFromState, IPlayerControlsPropsFromDispatch {
  visualizer: Visualizer;
}

interface IPlayerControlsState {
  isRunning: boolean;
}

function mapStateToProps ({ selectedPlaylistTrack }: IAppState): IPlayerControlsPropsFromState {
  const { audioFile } = selectedPlaylistTrack;

  return { audioFile };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): IPlayerControlsPropsFromDispatch {
  const { changeView, controlAudio } = ActionCreators;

  return bindActionCreators({
    changeView,
    controlAudio
  }, dispatch);
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class PlayerControls extends Component<IPlayerControlsProps, IPlayerControlsState> {
  public state: IPlayerControlsState = {
    isRunning: true
  };

  @Override
  public render (): JSX.Element {
    const { isRunning } = this.state;

    return (
      <div class="player-controls">
        <button onClick={ this._onClickBack }>
          ⟲
        </button>
        <button class="rewind-button" onClick={ this._onClickRewind }>
          ❚◄◄
        </button>
        <button onClick={ this._onClickPlayPause }>
          { isRunning ? `❚❚` : '►' }
        </button>
      </div>
    );
  }

  @Bind
  private _onClickBack (): void {
    const { visualizer, audioFile } = this.props;

    visualizer.stop();

    this.props.controlAudio(AudioControl.STOP);
    this.props.changeView(ViewMode.EDITOR);
  }

  @Bind
  private _onClickPlayPause (): void {
    const { visualizer, audioFile } = this.props;
    const { isRunning } = visualizer;

    if (isRunning) {
      visualizer.pause();
      this.props.controlAudio(AudioControl.PAUSE);
    } else {
      visualizer.run();
      this.props.controlAudio(AudioControl.PLAY);
    }

    this.setState({
      isRunning: !isRunning
    });
  }

  @Bind
  private _onClickRewind (): void {
    const { visualizer, audioFile } = this.props;

    visualizer.restart();
    this.props.controlAudio(AudioControl.RESTART);

    this.setState({
      isRunning: true
    });
  }
}
