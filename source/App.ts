import AppState from 'State/AppState';
import AppView from 'GUI/App/AppView';
import { Store } from 'Base/Core';

class App {
  public constructor () {
    const store: Store = new Store(new AppState());
    const appView: AppView = new AppView(store);
    const body: HTMLBodyElement = document.querySelector('body');

    appView.attach(body).update();
  }
}

const app: App = new App();
