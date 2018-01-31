import AudioFile from 'Audio/AudioFile';
import Editor from '@components/Editor';
import FileDropper from '@components/FileDropper';
import Player from '@components/Player';
import Sequence from '@core/MIDI/Sequence';
import { ActionCreators } from 'App/State/ActionCreators';
import { Bind, Method, Override } from '@base';
import { bindActionCreators, Dispatch } from 'redux';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState, ViewMode } from '@state/Types';
import '@styles/App.less';

interface IAppPropsFromState {
  sequence?: Sequence;
  viewMode?: ViewMode;
}

interface IAppProps extends IAppPropsFromState {}

function mapStateToProps (state: IAppState): IAppPropsFromState {
  const { selectedPlaylistTrack, viewMode } = state;
  const { sequence } = selectedPlaylistTrack;

  return {
    sequence,
    viewMode
  };
}

@Connect(mapStateToProps)
export default class App extends Component<IAppProps, any> {
  @Override
  public render (): JSX.Element {
    return (
      <div className="app">
        { this._getAppContents() }
      </div>
    );
  }

  private _getAppContents (): JSX.Element {
    const { sequence, viewMode } = this.props;

    switch (viewMode) {
      case ViewMode.EDITOR:
        return <Editor sequence={ sequence } />;
      case ViewMode.FILE_DROPPER:
        return <FileDropper />;
      case ViewMode.PLAYER:
        return <Player />;
    }
  }
}
