import 'App/Styles/App.less';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import MusicBank from 'App/State/MusicBank';
import Sequence from 'AppCore/MIDI/Sequence';
import SequenceCustomizer from 'App/Components/SequenceCustomizer';
import Store from 'App/State/Store';
import Visualization from 'App/Components/Visualization';
import { h, Component } from 'preact';
import { IAppState, IMusicTrack, ViewMode } from 'App/State/Types';
import { Utils } from 'Base/Core';

export default class App extends Component<any, IAppState> {
  public state: IAppState = Store.getState();

  public constructor () {
    super();

    Utils.bindAll(this, '_onDropFile', '_onStoreUpdate');
    Store.subscribe(this._onStoreUpdate);
  }

  public render (): JSX.Element {
    const isCustomizerMode: boolean = this.state.viewMode === ViewMode.CUSTOMIZER;
    const currentMusicTrack: IMusicTrack = MusicBank.getCurrentMusicTrack();

    return (
      <div className="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
        {
          currentMusicTrack.sequence ?
            isCustomizerMode ?
              <SequenceCustomizer musicTrack={ currentMusicTrack } />
            :
              <Visualization
                sequence={ currentMusicTrack.sequence }
                sequenceCustomization={ currentMusicTrack.sequenceCustomization }
              />
          :
            <div className="drop">
              <div className="box">Drag and drop a file here!</div>
            </div>
        }
      </div>
    );
  }

  private async _onDropFile (e: DragEvent): Promise<void> {
    e.preventDefault();

    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      MusicBank.addSequence(sequence);
    } else {
      // await AudioBank.uploadFile(file);

      // AudioBank.playAudioFile(0);
    }
  }

  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }

  private _onStoreUpdate (): void {
    this.setState(Store.getState());
  }
}
