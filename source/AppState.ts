import IFileSelectionContext from 'GUI/FileSelection/IFileSelectionContext';

export default class AppState {
  public fileSelectionContext: IFileSelectionContext = {
    filename: null,
    isLoading: false
  };
}
