import 'GUI/Styles/FileListStyles.less';
import AudioFile from 'Audio/AudioFile';
import IFileListContext from 'GUI/Contexts/IFileListContext';
import MusicVisualizerStore from 'MusicVisualizerStore';
import { InjectableView, View, Implementation, Override } from 'Base/Core';
import { SoundState } from 'Audio/Constants';

@InjectableView('FileListView')
class FileListView extends View<IFileListContext, MusicVisualizerStore> {
  @Override
  protected onMount (): void {
    this.subscribe('fileListContext');
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
      audioFiles: this.store.getAudioFiles()
    };
  }
}
