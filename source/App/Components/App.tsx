import 'App/Styles/App.less';
import DropMessage from 'App/Components/DropMessage';
import Manager from 'App/State/Manager';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Editor from 'App/Components/Editor/Editor';
import Store from 'App/State/Store';
import Player from 'App/Components/Player';
import { ActionTypes } from 'App/State/ActionTypes';
import { h, Component } from 'preact';
import { IAppState, ViewMode } from 'App/State/Types';
import { Override, Utils } from 'Base/Core';

export default class App extends Component<any, IAppState> {
  public state: IAppState = Store.getState();

  public constructor () {
    super();

    Utils.bindAll(this, '_onDropFile', '_onStoreUpdate');
    Store.subscribe(this._onStoreUpdate);
  }

  @Override
  public render (): JSX.Element {
    const { selectedPlaylistTrack, viewMode } = this.state;
    const { audioFile, customizer, sequence } = selectedPlaylistTrack;

    return (
      <div class="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
        {
          !!sequence ?
            viewMode === ViewMode.EDITOR ?
              <Editor playlistTrack={ selectedPlaylistTrack } />
            :
              <Player
                audioFile={ audioFile }
                customizer={ customizer }
                sequence={ sequence }
              />
          :
            <DropMessage />
        }
      </div>
    );
  }

  private _setSequence (sequence: Sequence): void {
    Store.dispatch({
      type: ActionTypes.CHANGE_SEQUENCE,
      payload: sequence
    });

    Store.dispatch({
      type: ActionTypes.CHANGE_CUSTOMIZER_TEMPO,
      payload: sequence.tempo
    });
  }

  private async _onDropFile (e: DragEvent): Promise<void> {
    e.preventDefault();

    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      this._setSequence(sequence);
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
