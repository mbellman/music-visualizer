import 'GUI/Styles/FileListStyles.less';
import AudioFile from 'Audio/AudioFile';
import IFileListContext from 'GUI/Contexts/IFileListContext';
import MusicVisualizerState from 'MusicVisualizerState';
import { InjectableView, View, U, Override, Implementation } from 'Base/Core';
import { Signal, playAudioFile } from 'Logic';
import { SoundState } from 'Audio/Constants';

@InjectableView('FileListView')
class FileListView extends View<IFileListContext, MusicVisualizerState> {
  @Override
  protected onMount (): void {
    this.follow(Signal.UPDATED_FILES);

    this.bind('click', '.FileList-item', this._onClickPlay);
  }

  @Implementation
  protected render (context: IFileListContext): string {
    const { audioFiles } = context;

    return (`
      ${
        audioFiles.map((audioFile: AudioFile) => {
          const { isPlaying } = audioFile;

          return (`
            <div class="FileList-item ${isPlaying ? 'playing' : ''}">
              File: ${audioFile.name}
            </div>
          `);
        }).join('')
      }
    `);
  }

  @Override
  protected getContext (state: MusicVisualizerState): IFileListContext {
    const { files } = this.store.getState().playlist;

    return {
      audioFiles: files
    };
  }

  private _onClickPlay (e: UIEvent): void {
    const target: HTMLElement = <HTMLElement>e.target;
    const index: number = Array.prototype.slice.call(target.parentElement.children, 0).indexOf(target);

    playAudioFile(this.store, index);

    this.update();
  }
}
