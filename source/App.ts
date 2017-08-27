import AppView from 'GUI/Views/AppView';
import MusicVisualizerState from 'MusicVisualizerState';
import { Store } from 'Base/Core';

class App {
  public constructor () {
    const state: MusicVisualizerState = new MusicVisualizerState();
    const store: Store<MusicVisualizerState> = new Store<MusicVisualizerState>(state);
    const appView: AppView = new AppView(store);

    appView.mount('body');
  }
}

const app: App = new App();
