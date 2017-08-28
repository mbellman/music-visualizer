import 'GUI/Styles/FileListStyles.less';
import AudioFile from 'Audio/AudioFile';
import IFileListContext from 'GUI/Contexts/IFileListContext';
import { Signal, getAudioFiles, playAudioFile } from 'Logic';
import { InjectableView, View, U, Override, Implementation } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

@InjectableView('FileListView')
class FileListView extends View<IFileListContext> {
  @Override
  protected onMount (): void {
    this.listen(Signal.UPDATED_FILES);

    this.bind('click', '.FileList-item', this._onClickPlay);
  }

  @Implementation
  protected render (context: IFileListContext): string {
    const { audioFiles } = context;

    return (`
      ${
        audioFiles.map((audioFile: AudioFile) => {
          return (`
            <div class="FileList-item">
              File: ${audioFile.name}
            </div>
          `);
        }).join('')
      }
    `);
  }

  @Override
  protected getContext (): IFileListContext {
    return {
      audioFiles: getAudioFiles(this.store)
    };
  }

  private _onClickPlay (e: UIEvent): void {
    const target: HTMLElement = <HTMLElement>e.target;
    const index: number = Array.prototype.slice.call(target.parentElement.children, 0).indexOf(target);

    playAudioFile(this.store, index);
  }
}
