import 'GUI/FileSelection/FileSelectionStyles.less';
import IFileSelectionContext from 'GUI/FileSelection/IFileSelectionContext';
import { View, InjectableView } from 'Base/Core';

@InjectableView('FileSelectionView')
class FileSelectionView extends View<IFileSelectionContext> {
  protected binding: string = 'fileSelectionContext';

  protected onFirstUpdate (): void {
    console.log('First update!');

    document.body.onclick = () => {
      this.updateContext({
        file: 'Hey!'
      });
    };
  }

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
}
