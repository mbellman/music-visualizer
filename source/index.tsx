import App from '@components/App';
import { appReducer } from '@state/Reducers';
import { createStore, Store } from 'redux';
import { h, render } from 'preact';
import { IAppState } from '@state/Types';
import { Provider } from 'preact-redux';

const store: Store<IAppState> = createStore<IAppState>(appReducer);

render(
  <Provider store={ store }>
    <App />
  </Provider>
, document.body);
