import 'GUI/Styles/FileSelectionStyles.less';
import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import { addFile, Signal } from 'Logic';
import { InjectableView, View, Implementation, Override } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View {
  @Override
  protected onMount (): void {
    this.bind('click', '.upload-button', this._onClickFileSelectionButton);
    this.bind('change', '#FileSelection-input', this._onSelectFile);
  }

  @Implementation
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

    await addFile(this.store, files[0]);

    this.signal(Signal.UPDATED_FILES);
  }
}
