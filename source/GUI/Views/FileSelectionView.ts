import 'GUI/Styles/FileSelectionStyles.less';
import MusicVisualizerStore from 'MusicVisualizerStore';
import AudioFile from 'Audio/AudioFile';
import FileLoader from 'FileLoader';
import { InjectableView, View, Implementation, Override } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View<void, MusicVisualizerStore> {
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

  private _onSelectFile (): void {
    const { files } = <HTMLInputElement>this.find('#FileSelection-input');

    this.store.addFile(files[0]);
  }
}
