import appReducer from 'App/State/Reducers';
import { createStore } from 'redux';
import { IAppState } from 'App/State/Types';

export default createStore<IAppState>(appReducer);
