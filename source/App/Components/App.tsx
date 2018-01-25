import '@styles/App.less';

import { IAppState } from '@state/Types';
import { h, Component } from 'preact';
import { Bind, Override } from '@base';
import { ViewMode } from '@state/Types';
import { ActionTypes, IAction } from '@state/ActionTypes';
import Sequence from '@core/MIDI/Sequence';
import MidiLoader from '@core/MIDI/MidiLoader';
import { ActionCreators } from 'App/State/ActionCreators';
import { ActionCreator, bindActionCreators, Dispatch } from 'redux';
import DropMessage from '@components/DropMessage';
import Editor from '@components/Editor';
import Player from '@components/Player';
import { Connect } from '@components/Decorators';

interface IAppProps {
  sequence?: Sequence;
  viewMode?: ViewMode;
  changeSequence?: ActionCreator<IAction>;
}

function mapStateToProps (state: IAppState): IAppProps {
  const { selectedPlaylistTrack, viewMode } = state;
  const { sequence } = selectedPlaylistTrack;

  return {
    sequence,
    viewMode
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): Partial<IAppProps> {
  const { changeSequence } = ActionCreators;

  return bindActionCreators({
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
      // await AudioBank.uploadFile(file);

      // AudioBank.playAudioFile(0);
    }
  }

  private _onDragOverFile (e: DragEvent): void {
    e.preventDefault();
  }
}
