import AudioFile from 'Audio/AudioFile';
import FileInfo from '@components/FileInfo';
import FileLoader from '@core/FileLoader';
import MidiLoader from '@core/MIDI/MidiLoader';
import Sequence from '@core/MIDI/Sequence';
import { ActionCreators } from '@state/ActionCreators';
import { Bind, Method, Override } from '@base';
import { bindActionCreators, Dispatch } from 'redux';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { IAppState, ViewMode } from '@state/Types';
import '@styles/FileDrop.less';

interface IFileDropPropsFromState {
  sequence?: Sequence;
  audioFile?: AudioFile;
}

interface IFileDropPropsFromDispatch {
  changeAudioFile?: Method<AudioFile>;
  changeSequence?: Method<Sequence>;
  changeView?: Method<ViewMode>;
}

interface IFileDropProps extends IFileDropPropsFromState, IFileDropPropsFromDispatch {}

function mapStateToProps ({ selectedPlaylistTrack }: IAppState): IFileDropPropsFromState {
  const { sequence, audioFile } = selectedPlaylistTrack;

  return {
    sequence,
    audioFile
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): IFileDropPropsFromDispatch {
  const { changeAudioFile, changeSequence, changeView } = ActionCreators;

  return bindActionCreators({
    changeAudioFile,
    changeSequence,
    changeView
  }, dispatch);
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class FileDrop extends Component<IFileDropProps, any> {
  @Override
  public render (): JSX.Element {
    const { sequence, audioFile } = this.props;

    return (
      <div className="file-drop" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
        <div className="box">
          { this._getFileDropBoxContents() }
        </div>
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

  private _getFileDropBoxContents (): JSX.Element {
    const { audioFile, sequence } = this.props;

    if (!sequence) {
      return (
        <div class="file-drop-message">
          Drag and drop a MIDI file here!
        </div>
      );
    } else {
      return (
        <span>
          <div class="file-drop-message secondary">
            Drag an audio file here, or click OK to continue!
          </div>
          <div>
            <FileInfo label="Sequence" file={ sequence } />
            <FileInfo label="Audio file" file={ audioFile } />
          </div>
          <input type="button" className="ok-button" value="OK" onClick={ this._showEditor } />
        </span>
      );
    }
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

  @Bind
  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }

  @Bind
  private _showEditor (): void {
    this.props.changeView(ViewMode.EDITOR);
  }
}
