import AudioFile from 'Audio/AudioFile';
import Visualizer from '@core/Visualization/Visualizer';
import { ActionCreators } from '@state/ActionCreators';
import { Bind, Method, Override } from '@base';
import { bindActionCreators } from 'redux';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { IAppState, ViewMode } from '@state/Types';
import '@styles/PlayerControls.less';

interface IPlayerControlsPropsFromState {
  audioFile?: AudioFile;
}

interface IPlayerControlsPropsFromDispatch {
  changeView?: Method<ViewMode>;
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
  const { changeView } = ActionCreators;

  return bindActionCreators({
    changeView,
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
    audioFile.stop();

    this.props.changeView(ViewMode.EDITOR);
  }

  @Bind
  private _onClickPlayPause (): void {
    const { visualizer, audioFile } = this.props;
    const { isRunning } = visualizer;

    if (isRunning) {
      visualizer.pause();
      audioFile.pause();
    } else {
      visualizer.run();
      audioFile.play();
    }

    this.setState({
      isRunning: !isRunning
    });
  }

  @Bind
  private _onClickRewind (): void {
    const { visualizer, audioFile } = this.props;

    visualizer.restart();
    audioFile.restart();

    this.setState({
      isRunning: true
    });
  }
}
