import 'GUI/FileSelection/FileSelectionStyles.less';
import IFileSelectionContext from 'GUI/FileSelection/IFileSelectionContext';
import { View, InjectableView } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View<IFileSelectionContext> {
  /**
   * @override
   */
  protected binding: string = 'fileSelectionContext';

  /**
   * @override
   */
  protected onMount (): void {
    this.bind('click', '.FileSelection-upload', this._pickFile);
  }

  /**
   * @override
   */
  protected render (fileSelectionContext: IFileSelectionContext): string {
    const { file } = fileSelectionContext;

    return (`
      ${
        file ?
          `Filename: ${file}`
        :
          (`
            <button class="FileSelection-upload">
              Upload a File
            </button>
          `)
      }
    `);
  }

  private _pickFile (): void {

  }
}
