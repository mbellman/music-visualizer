import MusicVisualizerStore from 'MusicVisualizerStore';
import AppView from 'GUI/Views/AppView';

class App {
  public constructor () {
    const store: MusicVisualizerStore = new MusicVisualizerStore();
    const appView: AppView = new AppView(store);

    appView.mount('body');
  }
}

const app: App = new App();
