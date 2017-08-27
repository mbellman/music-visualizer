import 'GUI/Styles/FileListStyles.less';
import AudioFile from 'Audio/AudioFile';
import IFileListContext from 'GUI/Contexts/IFileListContext';
import { Signal, getAudioFiles } from 'Logic';
import { InjectableView, View, Override, Implementation } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

@InjectableView('FileListView')
class FileListView extends View<IFileListContext> {
  @Override
  protected onMount (): void {
    this.listen(Signal.UPDATED_FILES);
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
}
