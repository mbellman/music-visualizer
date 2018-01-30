import AudioFile from 'Audio/AudioFile';
import DropMessage from '@components/DropMessage';
import Editor from '@components/Editor';
import FileLoader from '@core/FileLoader';
import MidiLoader from '@core/MIDI/MidiLoader';
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

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class App extends Component<IAppProps, any> {
  @Override
  public render (): JSX.Element {
    const { sequence, viewMode } = this.props;

    return (
      <div className="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
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

  private async _changeAudioFileFromFile (file: File): Promise<void> {
    const blob: Blob = await FileLoader.fileToBlob(file);
    const url: string = URL.createObjectURL(blob);
    const audioFile: AudioFile = new AudioFile(url, file.name);

    this.props.changeAudioFile(audioFile);

    URL.revokeObjectURL(url);
  }

  private async _changeSequenceFromFile (file: File): Promise<void> {
    const sequence: Sequence = await MidiLoader.fileToSequence(file);

    this.props.changeSequence(sequence);
  }

  @Bind
  private _onDropFile (e: DragEvent): void {
    e.preventDefault();

    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      this._changeSequenceFromFile(file);
    } else {
      this._changeAudioFileFromFile(file);
    }
  }

  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }
}
