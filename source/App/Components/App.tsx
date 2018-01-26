import '@styles/App.less';

import { IAppState } from '@state/Types';
import { h, Component } from 'preact';
import { Bind, Method, Override } from '@base';
import { ViewMode } from '@state/Types';
import { ActionTypes, IAction } from '@state/ActionTypes';
import Sequence from '@core/MIDI/Sequence';
import MidiLoader from '@core/MIDI/MidiLoader';
import { ActionCreators } from 'App/State/ActionCreators';
import { ActionCreator, bindActionCreators, Dispatch } from 'redux';
import DropMessage from '@components/DropMessage';
import Editor from '@components/Editor';
import Player from '@components/Player';
import { Connect } from '@components/Toolkit/Decorators';
import AudioFile from 'Audio/AudioFile';
import FileLoader from '@core/FileLoader';

interface IAppPropsFromState {
  sequence?: Sequence;
  viewMode?: ViewMode;
}

interface IAppPropsFromDispatch {
  changeAudioFile?: Method<AudioFile>;
  changeSequence?: Method<Sequence>;
}

interface IAppProps extends IAppPropsFromState, IAppPropsFromDispatch {}

function mapStateToProps (state: IAppState): IAppPropsFromState {
  const { selectedPlaylistTrack, viewMode } = state;
  const { sequence } = selectedPlaylistTrack;

  return {
    sequence,
    viewMode
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): IAppPropsFromDispatch {
  const { changeAudioFile, changeSequence } = ActionCreators;

  return bindActionCreators({
    changeAudioFile,
    changeSequence
  }, dispatch);
}

@Connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component<IAppProps, any> {
  @Override
  public render (): JSX.Element {
    const { sequence, viewMode } = this.props;

    return (
      <div class="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
        {
          !!sequence ?
            viewMode === ViewMode.EDITOR ?
              <Editor sequence={ sequence } />
            :
              <Player />
          :
            <DropMessage />
        }
      </div>
    );
  }

  @Bind
  private async _onDropFile (e: DragEvent): Promise<void> {
    e.preventDefault();

    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      this.props.changeSequence(sequence);
    } else {
      const blob: Blob = await FileLoader.fileToBlob(file);
      const url: string = URL.createObjectURL(blob);
      const audioFile: AudioFile = new AudioFile(url, file.name);

      this.props.changeAudioFile(audioFile);

      URL.revokeObjectURL(url);
    }
  }

  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }
}
