import 'App/Styles/Main.less';
import MidiLoader from 'AppCore/MIDI/MidiLoader';
import Sequence from 'AppCore/MIDI/Sequence';
import Options from 'App/Components/Options';
import Visualization from 'App/Components/Visualization';
import { h, Component } from 'preact';
import { Utils } from 'Base/Core';

enum ViewType {
  OPTIONS,
  VISUALIZATION
}

interface IMainState {
  activeSequence: number;
  sequences: Sequence[];
  view: ViewType;
}

export default class Main extends Component<any, IMainState> {
  public state: IMainState = {
    activeSequence: 0,
    sequences: [],
    view: ViewType.VISUALIZATION
  };

  public constructor () {
    super();

    Utils.bindAll(this, '_onDropFile');
  }

  public render (): JSX.Element {
    const activeSequence: Sequence = this.state.sequences[this.state.sequences.length - 1];

    return (
      <div className="app" onDrop={ this._onDropFile } onDragOver={ this._onDragOverFile }>
        {
          this.state.view === ViewType.OPTIONS ?
            <Options sequence={ activeSequence } />
          :
            <Visualization sequence={ activeSequence } />
        }
      </div>
    );
  }

  private _addSequence (sequence: Sequence): void {
    this.setState({
      sequences: [ ...this.state.sequences, sequence ]
    });
  }

  private async _onDropFile (e: DragEvent): Promise<void> {
    e.preventDefault();

    const file: File = e.dataTransfer.files[0];
    const extension: string = file.name.split('.').pop();

    if (extension === 'mid') {
      const sequence: Sequence = await MidiLoader.fileToSequence(file);

      this._addSequence(sequence);
    } else {
      // await AudioBank.uploadFile(file);

      // AudioBank.playAudioFile(0);
    }
  }

  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }
}
