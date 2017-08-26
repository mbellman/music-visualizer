import 'GUI/FileSelection/FileSelectionStyles.less';
import AppState from 'AppState';
import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import { View, InjectableView } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View<any> {
  /**
   * @override
   */
  protected onMount (): void {
    this.bind('click', '.upload-button', this._onClickFileSelectionButton);
    this.bind('change', '#FileSelection-input', this._onSelectFile);
  }

  /**
   * @override
   */
  protected render (): string {
    return (`
      <div class="FileSelection">
        <input type="file" id="FileSelection-input" class="u-hidden" />
        <button class="upload-button">
          Upload a File
        </button>
      </div>
    `);
  }

  private _onClickFileSelectionButton (): void {
    this.find('#FileSelection-input').click();
  }

  private async _onSelectFile (): Promise<void> {
    const { files } = <HTMLInputElement>this.find('#FileSelection-input');
    const blob: Blob = await FileLoader.fileToBlob(files[0]);
    const url: string = URL.createObjectURL(blob);

    this._addFile(new AudioFile(url));
  }

  private _addFile (audioFile: AudioFile): void {
    const { files } = this.store.getState().fileListContext;

    files.push(audioFile);

    this.store.update('fileListContext', { files });
  }
}
