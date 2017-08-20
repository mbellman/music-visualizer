import IFileSelectionContext from 'GUI/FileSelection/IFileSelectionContext';
import View from 'Base/View';

export default class FileSelectionView extends View<IFileSelectionContext> {
  public render (): string {
    const { fileSelectionContext } = this._store.getState();
    const { isFileSelected } = fileSelectionContext;

    return (`
      ${
        isFileSelected ?
          `Nice job.`
        :
          `You still need to pick a file...`
      }
    `);
  }
}
