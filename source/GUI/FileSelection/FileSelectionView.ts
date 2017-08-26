import 'GUI/FileSelection/FileSelectionStyles.less';
import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import IFileSelectionContext from 'GUI/FileSelection/IFileSelectionContext';
import { View, InjectableView } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View<IFileSelectionContext> {
  /**
   * @override
   */
  protected context: string = 'fileSelectionContext';

  /**
   * @override
   */
  protected onMount (): void {
    this.bind('click', '.FileSelection-button', this._onClickFileSelectionButton);
    this.bind('change', '#FileSelection-input', this._onSelectFile);
  }

  /**
   * @override
   */
  protected render (fileSelectionContext: IFileSelectionContext): string {
    const { filename } = fileSelectionContext;

    return (`
      ${
        filename ?
          `Filename: ${filename}`
        :
          (`
            <input type="file" id="FileSelection-input" class="u-hidden" />
            <button class="FileSelection-button">
              Upload a File
            </button>
          `)
      }
    `);
  }

  private _onClickFileSelectionButton (): void {
    this.find('#FileSelection-input').click();
  }

  private async _onSelectFile (): Promise<void> {
    const { files } = <HTMLInputElement>this.find('#FileSelection-input');
    const blob: Blob = await FileLoader.blobFromFile(files[0]);
    const url: string = URL.createObjectURL(blob);
    const audio: AudioFile = new AudioFile(url);

    audio.play();

    this.updateStore(this.context, { filename: files[0].name });
  }
}
