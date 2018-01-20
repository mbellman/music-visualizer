import 'App/Styles/App.less';
import Manager from 'App/State/Manager';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Customization from 'App/Components/Customization';
import Store from 'App/State/Store';
import Visualization from 'App/Components/Visualization';
import { ActionTypes } from 'App/State/ActionTypes';
import { h, Component } from 'preact';
import { IAppState, ViewMode } from 'App/State/Types';
import { Utils } from 'Base/Core';

export default class App extends Component<any, IAppState> {
  public state: IAppState = Store.getState();

  public constructor () {
    super();

    Utils.bindAll(this, '_onDropFile', '_onStoreUpdate');
    Store.subscribe(this._onStoreUpdate);
  }

  public render (): JSX.Element {
    const { selectedPlaylistTrack, viewMode } = this.state;
    const hasSequence: boolean = !!selectedPlaylistTrack.sequence;
    const isCustomizerMode: boolean = viewMode === ViewMode.CUSTOMIZER;

    return (
      <div class="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
        {
          hasSequence ?
            isCustomizerMode ?
              <Customization playlistTrack={ selectedPlaylistTrack } />
            :
              <Visualization
                sequence={ selectedPlaylistTrack.sequence }
                customizer={ selectedPlaylistTrack.customizer }
              />
          :
            <div class="drop">
              <div class="box">Drag and drop a file here!</div>
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
      const { selectedPlaylistTrack } = Store.getState();

      Store.dispatch({
        type: ActionTypes.UPDATE_SELECTED_TRACK,
        track: {
          ...selectedPlaylistTrack,
          sequence
        }
      });
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
