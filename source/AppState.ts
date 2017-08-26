import IFileListContext from 'GUI/FileList/IFileListContext';
import IVisualizerContext from 'GUI/Visualizer/IVisualizerContext';

export default class AppState {
  public fileListContext: IFileListContext = {
    files: []
  };
}
