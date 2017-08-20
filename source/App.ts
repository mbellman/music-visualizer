import AppView from 'GUI/App/AppView';
import FileSelectionView from 'GUI/FileSelection/FileSelectionView';
import { Store } from 'Base/Store';

class App {
  public constructor () {
    const store = new Store({
      appContext: {},
      fileSelectionContext: {}
    });

    const appView = new AppView(store);
    const body = document.querySelector('body');

    appView.attach(body).update();
  }
}

const app = new App();
