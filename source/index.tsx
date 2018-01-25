import App from '@components/App';
import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import { appReducer } from '@state/Reducers';
import { createStore, Store } from 'redux';
import { IAppState } from '@state/Types';

const store: Store<IAppState> = createStore<IAppState>(appReducer);

render(
  <Provider store={ store }>
    <App />
  </Provider>
, document.body);
