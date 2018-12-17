import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { authentication } from './ducks/authenticate';
import { artist } from './ducks/get-artist';
import { me } from './ducks/get-me';

const ducks = combineReducers({
  authentication,
  artist,
  me,
});

const configureStore = () => createStore(ducks, composeWithDevTools(applyMiddleware(thunk)));

export { configureStore };
