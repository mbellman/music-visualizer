import 'App/Styles/Main.less';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Visualization from 'App/Components/Visualization';
import { h, Component } from 'preact';
import { Utils } from 'Base/Core';

export default class Main extends Component<any, any> {
  public constructor () {
    super();

    Utils.bindAll(this, '_onDropFile');
  }

  public render (): JSX.Element {
    return (
      <div>
        <input type="file" id="file-input" />
        <div className="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
          <div className="options"></div>
          <Visualization />
        </div>
      </div>
    );
  }

  private async _onDropFile (e: DragEvent): Promise<void> {
    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      console.log(sequence);

      // renderSequenceOptions(sequence);
      // visualizer.visualize(sequence);
    } else {
      // await AudioBank.uploadFile(file);

      // AudioBank.playAudioFile(0);
    }

    e.preventDefault();
  }

  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }
}
