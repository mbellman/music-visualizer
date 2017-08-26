import 'GUI/FileList/FileListStyles.less';
import AudioFile from 'Audio/AudioFile';
import IFileListContext from 'GUI/FileList/IFileListContext';
import { InjectableView, View } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

@InjectableView('FileListView')
class FileListView extends View<IFileListContext> {
  /**
   * @override
   */
  protected context: string = 'fileListContext';

  /**
   * @override
   */
  protected render (context: IFileListContext): string {
    const { files } = context;

    return (`
      ${
        files.map((file: AudioFile) => {
          return (`
            <div class="FileList-item">
              File: ${file.name}
            </div>
          `);
        }).join('')
      }
    `);
  }
}
