import 'GUI/App/AppStyles.less';
import FileSelectionView from 'GUI/FileSelection/FileSelectionView';
import IAppContext from 'GUI/App/IAppContext';
import View from 'Base/View';
import { Store, subscribe } from 'Base/Store';

export default class AppView extends View<IAppContext> {
  public render (): string {
    return (`
      <div class="App">
        ${this.put(FileSelectionView)}
      </div>
    `);
  }
}
