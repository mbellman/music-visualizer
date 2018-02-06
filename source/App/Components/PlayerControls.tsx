import AudioFile from '@core/Audio/AudioFile';
import Visualizer from '@core/Visualization/Visualizer';
import { ActionCreators } from '@state/ActionCreators';
import { AudioControl, IAppState, ViewMode } from '@state/Types';
import { Bind, Implementation, Method, Override } from '@base';
import { bindActionCreators } from 'redux';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import '@styles/PlayerControls.less';

interface IPlayerControlsPropsFromState {
  audioDelay?: number;
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
  const { audioDelay } = selectedPlaylistTrack.customizer.settings;

  return { audioDelay };
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

  private _playAudioTimeout: number;
  private _lastPlayAudioTime: number;
  private _pendingAudioDelay: number;

  private get _isAudioDelayed (): boolean {
    return this._pendingAudioDelay > 0;
  }

  @Implementation
  public componentDidMount (): void {
    this._resetPendingAudioDelay();
    this._playAudioMaybeDelayed();
  }

  @Override
  public render (): JSX.Element {
    const { isRunning } = this.state;

    return (
      <div class="player-controls">
        <button onClick={ this._onClickBack }>
          ⟲
        </button>
        <button class="restart-button" onClick={ this._onClickRestart }>
          ❚◄◄
        </button>
        <button onClick={ this._onClickDownload }>
          ⇓
        </button>
        <button onClick={ this._onClickPlayPause }>
          { isRunning ? `❚❚` : '►' }
        </button>
      </div>
    );
  }

  @Bind
  private _onClickBack (): void {
    const { visualizer } = this.props;

    visualizer.stop();
    window.clearTimeout(this._playAudioTimeout);

    this.props.controlAudio(AudioControl.STOP);
    this.props.changeView(ViewMode.EDITOR);
  }

  @Bind
  private _onClickDownload (): void {
    const { visualizer } = this.props;

    visualizer.startDownloadingFrames();

    this.props.controlAudio(AudioControl.STOP);
    this._restartVisualizer();
  }

  @Bind
  private _onClickPlayPause (): void {
    const { visualizer } = this.props;
    const { isRunning } = visualizer;

    if (isRunning) {
      visualizer.pause();
      this._pauseAudio();
    } else {
      visualizer.run();
      this._playAudioMaybeDelayed();
    }

    this.setState({
      isRunning: !isRunning
    });
  }

  @Bind
  private _onClickRestart (): void {
    this._restartVisualizer();
    this._restartAudio();
  }

  private _pauseAudio (): void {
    if (this._isAudioDelayed) {
      window.clearTimeout(this._playAudioTimeout);

      this._pendingAudioDelay -= (Date.now() - this._lastPlayAudioTime);
    } else {
      this.props.controlAudio(AudioControl.PAUSE);
    }
  }

  @Bind
  private _playAudioImmediately (): void {
    this._pendingAudioDelay = 0;

    this.props.controlAudio(AudioControl.PLAY);
  }

  private _playAudioMaybeDelayed (): void {
    if (this._isAudioDelayed) {
      window.clearTimeout(this._playAudioTimeout);

      this._lastPlayAudioTime = Date.now();
      this._playAudioTimeout = window.setTimeout(this._playAudioImmediately, this._pendingAudioDelay);
    } else {
      this._playAudioImmediately();
    }
  }

  private _resetPendingAudioDelay (): void {
    const { audioDelay } = this.props;

    this._pendingAudioDelay = audioDelay;
  }

  private _restartAudio (): void {
    if (!this._isAudioDelayed) {
      this.props.controlAudio(AudioControl.STOP);
    }

    this._resetPendingAudioDelay();
    this._playAudioMaybeDelayed();
  }

  private _restartVisualizer (): void {
    const { visualizer } = this.props;

    visualizer.restart();

    this.setState({
      isRunning: true
    });
  }
}
