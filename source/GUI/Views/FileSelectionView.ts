import 'GUI/Styles/FileSelectionStyles.less';
import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import { uploadFile, Signal } from 'Logic';
import { InjectableView, View, Implementation, Override } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View {
  @Override
  protected onMount (): void {
    this.bind('click', '.FileSelection-button', this._onClickFileSelectionButton);
    this.bind('change', '#file-selection-input', this._onSelectFile);
  }

  @Implementation
  protected render (): string {
    return (`
      <div class="FileSelection">
        <input type="file" id="file-selection-input" class="u-hidden" />
        <button class="FileSelection-button">
          Upload a File
        </button>
      </div>
    `);
  }

  private _onClickFileSelectionButton (): void {
    this.find('#file-selection-input').click();
  }

  private async _onSelectFile (): Promise<void> {
    const { files } = <HTMLInputElement>this.find('#file-selection-input');

    await uploadFile(this.store, files[0]);

    this.signal(Signal.UPDATED_FILES);
  }
}
